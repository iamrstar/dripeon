import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const FALLBACK_PRODUCTS = [
  {
    _id: "demo-prod-1",
    name: "Acid Wash Heavyweight Oversized Tee",
    slug: "acid-wash-heavyweight-oversized-tee",
    description: "Ultra-heavyweight 280 GSM cotton oversized tee with custom acid-wash patina and drop shoulders. Engineered for ultimate streetwear drape and durability.",
    originalPrice: 1999,
    salePrice: 1299,
    discount: 35,
    category: "Topwear",
    subcategory: "T-Shirts",
    gender: "Unisex",
    images: ["/product_vintage_tee.png"],
    sizes: ["S", "M", "L", "XL"],
    inventory: { S: 10, M: 15, L: 20, XL: 8 },
    stock: 53,
    featured: true,
    isActive: true,
    features: [
      { title: "Fabric", desc: "100% Super Combed Heavyweight Cotton (280 GSM)" },
      { title: "Fit", desc: "Boxy oversized streetwear silhouette" },
      { title: "Wash Care", desc: "Cold machine wash inside out" }
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Do not tumble dry",
      "Warm iron if needed, avoid graphic area"
    ],
    reviews: [],
    averageRating: 4.8,
    numReviews: 24,
  },
  {
    _id: "demo-prod-2",
    name: "Midnight Urban Knit Polo",
    slug: "midnight-urban-knit-polo",
    description: "Textured breathable knit polo designed for elevated streetwear comfort and clean modern silhouette.",
    originalPrice: 2499,
    salePrice: 1699,
    discount: 32,
    category: "Topwear",
    subcategory: "Polos",
    gender: "Unisex",
    images: ["/product_navy_polo.png"],
    sizes: ["S", "M", "L", "XL"],
    inventory: { S: 8, M: 12, L: 14, XL: 5 },
    stock: 39,
    featured: true,
    isActive: true,
    features: [
      { title: "Fabric", desc: "Premium Jacquard Knit Blend" },
      { title: "Fit", desc: "Relaxed resort polo cut" }
    ],
    careInstructions: ["Gentle cold wash", "Dry flat in shade"],
    reviews: [],
    averageRating: 4.9,
    numReviews: 18,
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
    stock: 33,
    featured: true,
    isActive: true,
    features: [
      { title: "Material", desc: "Heavyweight Ripstop Nylon/Cotton" },
      { title: "Details", desc: "Modular utility straps and dual cargo pockets" }
    ],
    careInstructions: ["Machine wash cold with like colors"],
    reviews: [],
    averageRating: 5.0,
    numReviews: 31,
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
    stock: 25,
    featured: true,
    isActive: true,
    features: [
      { title: "Material", desc: "316L Surgical Grade Stainless Steel" },
      { title: "Finish", desc: "High Polish Anti-Tarnish Chrome" }
    ],
    careInstructions: ["Wipe clean with microfiber cloth"],
    reviews: [],
    averageRating: 4.7,
    numReviews: 12,
  }
];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check fallback products first if no DB configured
    if (!process.env.MONGODB_URI) {
      const fallback = FALLBACK_PRODUCTS.find(p => p._id === id || p.slug === id);
      if (fallback) return NextResponse.json(fallback, { status: 200 });
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    await connectToDatabase();

    // Try to find by MongoDB _id first, then by slug
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: id, isActive: true }).lean();
    }

    if (!product) {
      // Check fallback list before 404
      const fallback = FALLBACK_PRODUCTS.find(p => p._id === id || p.slug === id);
      if (fallback) return NextResponse.json(fallback, { status: 200 });

      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const { id } = await params;
    const fallback = FALLBACK_PRODUCTS.find(p => p._id === id || p.slug === id);
    if (fallback) return NextResponse.json(fallback, { status: 200 });

    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
