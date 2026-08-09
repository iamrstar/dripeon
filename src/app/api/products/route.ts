import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const gender = searchParams.get("gender");
    const featured = searchParams.get("featured");
    const ids = searchParams.get("ids");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: any = { isActive: true };
    if (category) filter.category = new RegExp(`^${category}$`, "i");
    if (subcategory) filter.subcategory = new RegExp(`^${subcategory}$`, "i");
    if (gender) filter.gender = new RegExp(`^${gender}$`, "i");
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (ids) {
      const idArray = ids.split(',');
      // Check if it's a valid ObjectId, otherwise it's a slug
      const objectIds = idArray.filter(id => id.length === 24);
      const slugs = idArray.filter(id => id.length !== 24);
      
      filter.$or = [];
      if (objectIds.length > 0) filter.$or.push({ _id: { $in: objectIds } });
      if (slugs.length > 0) filter.$or.push({ slug: { $in: slugs } });
      
      if (filter.$or.length === 0) delete filter.$or;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
