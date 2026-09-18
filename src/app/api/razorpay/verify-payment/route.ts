import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { OrderReceipt } from "@/emails/OrderReceipt";
import { render } from "@react-email/components";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
  
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      products, 
      shippingAddress, 
      coupon
    } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    await connectToDatabase();
    const { userId } = await auth();

    // 1. REBUILD PRODUCTS FROM DATABASE (Security Patch)
    let calculatedTotal = 0;
    const secureProducts = [];

    for (const item of products) {
      const dbProduct = await Product.findById(item.product_id);
      if (!dbProduct) {
        return NextResponse.json({ message: `Product not found: ${item.name}` }, { status: 404 });
      }
      
      const price = dbProduct.salePrice || dbProduct.originalPrice;
      calculatedTotal += price * item.quantity;
      
      secureProducts.push({
        product_id: item.product_id,
        name: dbProduct.name,
        size: item.size,
        quantity: item.quantity,
        price: price
      });

      // DEDUCT INVENTORY
      dbProduct.stock -= item.quantity;
      if (item.size && dbProduct.inventory && dbProduct.inventory[item.size] !== undefined) {
        dbProduct.inventory[item.size] -= item.quantity;
      }
      await dbProduct.save();
    }

    // 2. APPLY DISCOUNTS
    let discountAmount = 0;
    if (coupon) {
      const dbCoupon = await Coupon.findOne({ code: coupon, isActive: true });
      if (dbCoupon) {
        if (dbCoupon.expiryDate && new Date() > new Date(dbCoupon.expiryDate)) {
          // expired
        } else if (calculatedTotal >= dbCoupon.minOrderValue) {
          if (dbCoupon.discountType === 'PERCENTAGE') {
            discountAmount = (calculatedTotal * dbCoupon.discountValue) / 100;
          } else if (dbCoupon.discountType === 'FIXED') {
            discountAmount = dbCoupon.discountValue;
          }
        }
      }
    }
    calculatedTotal -= discountAmount;

    // 3. APPLY SHIPPING
    const shippingCost = calculatedTotal > 999 ? 0 : 100;
    calculatedTotal += shippingCost;

    // Generate Sequential Order Number (DDMMYYxx)
    const today = new Date();
    const dd = String(today.getUTCDate()).padStart(2, '0');
    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
    const yy = String(today.getUTCFullYear()).slice(-2);
    const dateStr = `${dd}${mm}${yy}`;

    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const count = await Order.countDocuments({ 
      createdAt: { $gte: startOfDay, $lte: endOfDay } 
    });

    const orderNumber = `${dateStr}${String(count + 1).padStart(2, '0')}`;

    // 4. CREATE SECURE ORDER
    const orderData: any = {
      orderNumber,
      user: userId || null,
      products: secureProducts,
      shippingAddress,
      totalAmount: calculatedTotal,
      coupon: coupon || null,
      discountAmount,
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      trackingNumber: razorpay_payment_id, // Storing payment ID for reference
      courierPartner: 'Razorpay',
    };

    if (userId) {
      orderData.user = userId;
    }

    const order = await Order.create(orderData);

    // Send confirmation email
    if (shippingAddress?.email) {
      let emailSent = false;

      // 1. Try Nodemailer (Gmail SMTP) if configured
      if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_APP_PASSWORD,
            },
          });

          const emailHtml = await render(
            OrderReceipt({
              orderId: order.orderNumber,
              shippingAddress,
              products: secureProducts,
              totalAmount: calculatedTotal,
            })
          );

          await transporter.sendMail({
            from: `"Dripeon Team" <${process.env.EMAIL_USER}>`,
            to: shippingAddress.email,
            subject: `Order Confirmed: #${order.orderNumber}`,
            html: emailHtml,
          });

          emailSent = true;
          console.log(`🚀 Nodemailer Order email sent to: ${shippingAddress.email}`);
        } catch (nodemailerError) {
          console.error("Nodemailer failed to send order email:", nodemailerError);
        }
      }

      // 2. Fallback to Resend if Nodemailer was not used/failed and API key is set
      if (!emailSent && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_dummy') {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Dripeon Orders <orders@dripeon.com>",
            to: shippingAddress.email,
            subject: `Order Confirmed: #${order.orderNumber}`,
            react: OrderReceipt({
              orderId: order.orderNumber,
              shippingAddress,
              products: secureProducts,
              totalAmount: calculatedTotal,
            }),
          });
          console.log(`🚀 Resend Order email sent to: ${shippingAddress.email}`);
        } catch (emailError) {
          console.error("Failed to send Resend email, but order was created:", emailError);
        }
      }
    }

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
