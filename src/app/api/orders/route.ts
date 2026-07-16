import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session = await auth();
    
    const body = await req.json();
    const { products, shippingAddress, totalAmount } = body;

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No products in order" }, { status: 400 });
    }

    // Create the order
    const orderData: any = {
      products,
      shippingAddress,
      totalAmount,
      coupon: body.coupon || null,
      discountAmount: body.discountAmount || 0,
      paymentStatus: 'PAID', // Simulating successful payment
      orderStatus: 'PROCESSING',
    };

    if (session?.user?.id) {
      orderData.user = session.user.id;
    }

    const order = await Order.create(orderData);

    // Decrease stock for each product
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Send confirmation email
    if (shippingAddress?.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      const productsHtml = products.map((p: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eaeaea;">
            <strong>${p.name}</strong><br>
            <span style="color: #888; font-size: 12px;">Size: ${p.size}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: center;">${p.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right;">₹${p.price * p.quantity}</td>
        </tr>
      `).join('');

      await transporter.sendMail({
        from: `"Dripeon Team" <${process.env.EMAIL_USER}>`,
        to: shippingAddress.email,
        subject: `Order Confirmed: DRP-${order._id.toString().substring(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Order Confirmation</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
              Hi ${shippingAddress.name},<br><br>
              Thank you for your purchase! We're getting your order ready to be shipped. 
              <strong>Tracking details will be shared soon when the item has been shipped.</strong>
            </p>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #f4f4f4;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total Paid:</td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px;">₹${totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Shipping Address:</h4>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                ${shippingAddress.name}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #888; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 30px; text-align: center;">
              If you have any questions about your order, reply to this email or contact info.dripeon@gmail.com
            </p>
          </div>
        `,
      });
      console.log(`🚀 Order email sent to: ${shippingAddress.email}`);
    }

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
