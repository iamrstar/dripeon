import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const { products, coupon } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "Invalid products array" }, { status: 400 });
    }

    await connectToDatabase();

    let calculatedTotal = 0;

    // Verify prices from MongoDB
    for (const item of products) {
      const dbProduct = await Product.findById(item.product_id);
      if (!dbProduct) {
        return NextResponse.json({ message: `Product not found: ${item.name}` }, { status: 404 });
      }
      calculatedTotal += (dbProduct.salePrice || dbProduct.price) * item.quantity;
    }

    // Apply Dynamic Coupon Logic
    let discountAmount = 0;
    if (coupon) {
      const dbCoupon = await Coupon.findOne({ code: coupon, isActive: true });
      if (dbCoupon) {
        // Check expiry date
        if (dbCoupon.expiryDate && new Date() > new Date(dbCoupon.expiryDate)) {
          // expired, do not apply
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

    // Shipping logic (Free over 999)
    const shippingCost = calculatedTotal > 999 ? 0 : 100;
    calculatedTotal += shippingCost;

    if (calculatedTotal < 1) {
      return NextResponse.json({ message: "Invalid calculated amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(calculatedTotal * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
