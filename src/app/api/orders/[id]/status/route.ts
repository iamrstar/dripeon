import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

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

    await order.save();
    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
