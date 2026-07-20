import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Order ID and Email are required' }, { status: 400 });
    }

    await dbConnect();

    // Fetch the order, matching the _id and the shipping email to ensure security
    const order = await Order.findOne({ 
      _id: orderId, 
      'shippingAddress.email': email.toLowerCase().trim() 
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'No order found matching this ID and Email combination.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      trackingInfo: {
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber || null,
        courierPartner: order.courierPartner || null,
        expectedDelivery: order.orderStatus === 'DELIVERED' ? 'Delivered' : '3-4 Business Days',
      }
    });

  } catch (error: any) {
    console.error("Track order error:", error);
    // If ObjectId is invalid, it throws an error. Catch it and return 404 cleanly.
    if (error.name === 'CastError') {
       return NextResponse.json({ error: 'Invalid Order ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to track order. Please try again.' }, { status: 500 });
  }
}
