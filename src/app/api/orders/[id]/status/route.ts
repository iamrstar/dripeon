import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { Resend } from "resend";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, reason, image } = body;

    await connectToDatabase();

    const order = await Order.findOne({ _id: id, user: userId });
    
    if (!order) {
      return NextResponse.json({ message: "Order not found or unauthorized" }, { status: 404 });
    }

    if (action === 'CANCEL') {
      if (!['PENDING', 'PROCESSING'].includes(order.orderStatus)) {
        return NextResponse.json({ message: "Order cannot be cancelled at this stage" }, { status: 400 });
      }
      
      order.orderStatus = 'CANCELLED';
      if (reason) order.cancellationReason = reason;

      // RESTORE INVENTORY
      for (const item of order.products) {
        const dbProduct = await Product.findById(item.product_id);
        if (dbProduct) {
          dbProduct.stock += item.quantity;
          if (item.size && dbProduct.inventory && dbProduct.inventory[item.size] !== undefined) {
            dbProduct.inventory[item.size] += item.quantity;
          }
          await dbProduct.save();
        }
      }
      
    } else if (action === 'RETURN') {
      if (order.orderStatus !== 'DELIVERED') {
        return NextResponse.json({ message: "Only delivered orders can be returned" }, { status: 400 });
      }
      
      if (!image) {
        return NextResponse.json({ message: "Product image is required for returns" }, { status: 400 });
      }
      
      order.orderStatus = 'RETURN_REQUESTED';
      if (reason) order.returnReason = reason;
      order.returnImage = image;
      
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await Order.updateOne(
      { _id: id },
      { 
        $set: { 
          orderStatus: order.orderStatus,
          cancellationReason: order.cancellationReason,
          returnReason: order.returnReason,
          returnImage: order.returnImage
        } 
      }
    );

    // Send confirmation email
    if (order.shippingAddress && order.shippingAddress.email) {
      const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
      const orderNumber = order.orderNumber || order._id.toString().substring(0, 8);
      
      let subject = "";
      let htmlBody = "";
      
      if (action === 'CANCEL') {
        subject = `Order Cancelled: #${orderNumber}`;
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #000;">Order Cancellation Confirmed</h2>
            <p>Your request to cancel order <strong>#${orderNumber}</strong> has been processed successfully.</p>
            <p>If you have already paid, a refund will be initiated to your original payment method and should reflect in 3-5 business days.</p>
            <br/>
            <p>Thanks,</p>
            <p><strong>Dripeon Team</strong></p>
          </div>
        `;
      } else if (action === 'RETURN') {
        const isReplace = reason && reason.includes('[REPLACE]');
        const typeStr = isReplace ? 'Replacement' : 'Return';
        subject = `${typeStr} Request Received: #${orderNumber}`;
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #000;">${typeStr} Request Successfully Submitted</h2>
            <p>We have successfully received your ${typeStr.toLowerCase()} request for order <strong>#${orderNumber}</strong>.</p>
            <p>Our team will verify the details and images provided. Once verified and accepted, you will receive further instructions on how to send the item back.</p>
            <br/>
            <p>Thanks,</p>
            <p><strong>Dripeon Team</strong></p>
          </div>
        `;
      }

      if (subject && htmlBody) {
        try {
          await resend.emails.send({
            from: "Dripeon Orders <orders@dripeon.com>",
            to: order.shippingAddress.email,
            subject,
            html: htmlBody
          });
          console.log(`🚀 Resend ${action} email sent to: ${order.shippingAddress.email}`);
        } catch (emailError) {
          console.error(`Failed to send ${action} email:`, emailError);
        }
      }
    }

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
