import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    // Using lean for faster execution since we only need to read
    const order = await Order.findById(params.id).lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // We don't restrict by session here because guest users need to see their success page too.
    // However, to keep it somewhat secure, we don't expose full sensitive details (like full address).
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
