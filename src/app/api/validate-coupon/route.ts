import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    await dbConnect();
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return NextResponse.json({ error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` }, { status: 400 });
    }

    // Return the discount amount to apply
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(cartTotal * (coupon.discountValue / 100));
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure we don't discount more than the cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({ 
      success: true, 
      discountAmount,
      code: coupon.code,
      message: `Coupon applied! You saved ₹${discountAmount}`
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
