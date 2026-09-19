import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const FALLBACK_PRODUCTS = [
  {
    _id: "demo-prod-1",
    name: "Acid Wash Heavyweight Oversized Tee",
    slug: "acid-wash-heavyweight-oversized-tee",
    description: "Ultra-heavyweight 280 GSM cotton oversized tee with custom acid-wash patina and drop shoulders.",
    originalPrice: 1999,
    salePrice: 1299,
    discount: 35,
    category: "Topwear",
    subcategory: "T-Shirts",
    gender: "Unisex",
    images: ["/product_vintage_tee.png"],
    sizes: ["S", "M", "L", "XL"],
    inventory: { S: 10, M: 15, L: 20, XL: 8 },
    featured: true,
    isActive: true,
  },
  {
    _id: "demo-prod-2",
    name: "Midnight Urban Knit Polo",
    slug: "midnight-urban-knit-polo",
    description: "Textured breathable knit polo designed for elevated streetwear comfort and clean silhouette.",
    originalPrice: 2499,
    salePrice: 1699,
    discount: 32,
    category: "Topwear",
    subcategory: "Polos",
    gender: "Unisex",
    images: ["/product_navy_polo.png"],
    sizes: ["S", "M", "L", "XL"],
    inventory: { S: 8, M: 12, L: 14, XL: 5 },
    featured: true,
    isActive: true,
  },
  {
    _id: "demo-prod-3",
    name: "Cyber Drip Cargo Pants",
    slug: "cyber-drip-cargo-pants",
    description: "Technical multi-pocket wide-leg cargo pants crafted with water-repellent ripstop fabric.",
    originalPrice: 2999,
    salePrice: 1999,
    discount: 33,
    category: "Bottomwear",
    subcategory: "Pants",
    gender: "Unisex",
    images: ["/IMG_3031.jpeg"],
    sizes: ["S", "M", "L", "XL"],
    inventory: { S: 5, M: 10, L: 12, XL: 6 },
    featured: true,
    isActive: true,
  },
  {
    _id: "demo-prod-4",
    name: "Chrome Link Heavyweight Chain",
    slug: "chrome-link-heavyweight-chain",
    description: "Stainless steel industrial link accessory with laser-engraved Dripeon signature clasp.",
    originalPrice: 1499,
    salePrice: 899,
    discount: 40,
    category: "Accessories",
    subcategory: "Jewelry",
    gender: "Unisex",
    images: ["/category_accessories.png"],
    sizes: ["One Size"],
    inventory: { "One Size": 25 },
    featured: true,
    isActive: true,
  }
];

export async function GET(req: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(FALLBACK_PRODUCTS, { status: 200 });
    }

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

    // If DB is empty, return fallback products
    if (!products || products.length === 0) {
      return NextResponse.json(FALLBACK_PRODUCTS.slice(0, limit), { status: 200 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.warn("MongoDB unavailable, serving fallback products:", error instanceof Error ? error.message : error);
    return NextResponse.json(FALLBACK_PRODUCTS, { status: 200 });
  }
}
