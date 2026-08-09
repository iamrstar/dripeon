import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Order ID and Email are required' }, { status: 400 });
    }

    await dbConnect();

    // Clean up the orderId in case the user pasted a '#' symbol
    const cleanOrderId = orderId.replace(/^#/, '').trim();
    
    // Use a case-insensitive regex for the email to handle autocorrect capitalization or trailing spaces
    const cleanEmail = email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emailRegex = new RegExp(`^${cleanEmail}$`, 'i');
    
    let query: any = {};
    
    if (cleanOrderId.length === 24) {
      // Validate full ObjectId
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(cleanOrderId)) {
        return NextResponse.json({ error: 'Invalid Order ID format.' }, { status: 400 });
      }
      query._id = cleanOrderId;
    } else if (cleanOrderId.match(/^\d+$/) && cleanOrderId.length <= 8) {
      // 8-digit numeric ID. It could be a new 'orderNumber' OR a legacy parsed Hex ID.
      const hexSearch = parseInt(cleanOrderId, 10).toString(16).padStart(6, '0');
      
      query.$or = [
        { orderNumber: cleanOrderId }, // Try exact match on new field
        { 
          $expr: { // Fallback to old mathematical ID conversion
            $eq: [
              { $toLower: { $substr: [{ $toString: "$_id" }, 18, 6] } },
              hexSearch.toLowerCase()
            ]
          }
        }
      ];
    } else if (cleanOrderId.length === 6) {
      // Legacy support for older 6-char hex IDs
      query.$expr = {
        $eq: [
          { $toLower: { $substr: [{ $toString: "$_id" }, 18, 6] } },
          cleanOrderId.toLowerCase()
        ]
      };
    } else {
      return NextResponse.json({ error: 'Invalid Order ID length. Please enter your 8-digit numeric ID or full ID.' }, { status: 400 });
    }

    // Fetch the order
    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json({ error: 'No order found matching this ID.' }, { status: 404 });
    }

    // Get current logged-in user
    const { userId } = await auth();

    // Verify ownership: Either email matches OR it belongs to the logged-in user
    const emailMatches = order.shippingAddress && order.shippingAddress.email && emailRegex.test(order.shippingAddress.email);
    const userMatches = userId && order.user === userId;

    if (!emailMatches && !userMatches) {
      return NextResponse.json({ error: 'No order found matching this ID and Email combination.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      trackingInfo: {
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber || null,
        courierPartner: order.courierPartner || null,
        expectedDelivery: order.orderStatus === 'DELIVERED' ? 'Delivered' : '3-4 Business Days',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        cancellationReason: order.cancellationReason || null
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
