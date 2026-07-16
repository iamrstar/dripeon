import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const seedProducts = [
  {
    name: "Classic Oversized Tee",
    slug: "classic-oversized-tee",
    description: "Classic Oversized Tee designed for everyday comfort, durability, and hassle-free delivery. Premium heavy-weight cotton oversized t-shirt featuring a drop shoulder fit and ribbed crewneck.",
    originalPrice: 1899,
    salePrice: 1499,
    category: "topwear",
    subcategory: "Oversized",
    images: ["/IMG_3033.jpeg", "/IMG_3031.jpeg", "/IMG_3034.jpeg", "/IMG_3035.jpeg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    highlights: { Composition: "100% Cotton", GSM: "250", Color: "Jet Black", "Sleeve length": "Half Sleeve", Print: "Graphic" },
    sizeChart: { chest: "45", length: "28" },
    features: [
      { title: "250 GSM Heavyweight Fabric", desc: "More structure with everyday comfort" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    modelInfo: 'The model (Height 6\'1") is wearing size XL',
    stock: 100,
    featured: true,
    isActive: true,
  },
  {
    name: "Baggy Wash Jeans",
    slug: "baggy-wash-jeans",
    description: "Baggy Wash Jeans designed for everyday comfort, durability, and hassle-free delivery. Relaxed fit baggy denim with vintage wash finish.",
    originalPrice: 3499,
    salePrice: 2999,
    category: "bottomwear",
    subcategory: "Jeans",
    images: ["/IMG_3034.jpeg", "/IMG_3035.jpeg", "/IMG_3031.jpeg", "/IMG_3033.jpeg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    highlights: { Composition: "98% Cotton, 2% Spandex", GSM: "340", Color: "Vintage Blue", Fit: "Relaxed Baggy", Wash: "Stone Wash" },
    sizeChart: { waist: "32", length: "42" },
    features: [
      { title: "340 GSM Premium Denim", desc: "Heavyweight denim built to last" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    stock: 80,
    featured: true,
    isActive: true,
  },
  {
    name: "Dripeon Signature Cap",
    slug: "dripeon-signature-cap",
    description: "Dripeon Signature Cap designed for everyday style, durability, and hassle-free delivery. Structured 6-panel cap with embroidered logo.",
    originalPrice: 1299,
    salePrice: 999,
    category: "accessories",
    subcategory: "Caps",
    images: ["/IMG_3035.jpeg", "/IMG_3031.jpeg", "/IMG_3033.jpeg", "/IMG_3034.jpeg"],
    sizes: ["One Size"],
    highlights: { Composition: "100% Cotton Twill", Color: "Black", Style: "6-Panel", Closure: "Strapback" },
    sizeChart: { circumference: "22" },
    features: [
      { title: "Premium Cotton Twill", desc: "Structured yet breathable" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    stock: 200,
    featured: false,
    isActive: true,
  },
  {
    name: "Vintage Wash Tank",
    slug: "vintage-wash-tank",
    description: "Vintage acid-wash sleeveless tank top. Cut from premium cotton with raw-edge armholes for an effortless streetwear look.",
    originalPrice: 2499,
    salePrice: 1999,
    category: "topwear",
    subcategory: "Tank Top",
    images: ["/IMG_3031.jpeg", "/IMG_3033.jpeg", "/IMG_3034.jpeg", "/IMG_3035.jpeg"],
    sizes: ["S", "M", "L", "XL"],
    highlights: { Composition: "100% Cotton", GSM: "250", Color: "Faded Grey", "Sleeve length": "Sleeveless", Print: "Graphic" },
    sizeChart: { chest: "44", length: "27" },
    features: [
      { title: "250 GSM Heavyweight Fabric", desc: "More structure with everyday comfort" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    stock: 60,
    featured: true,
    isActive: true,
  },
  {
    name: "Graphic Street Tee",
    slug: "graphic-street-tee",
    description: "Statement graphic t-shirt with bold back print. Made from 100% organic cotton with a relaxed fit.",
    originalPrice: 1999,
    salePrice: 1599,
    category: "topwear",
    subcategory: "T-Shirt",
    images: ["/IMG_3031.jpeg", "/IMG_3034.jpeg", "/IMG_3035.jpeg", "/IMG_3033.jpeg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    highlights: { Composition: "100% Cotton", GSM: "220", Color: "Off White", "Sleeve length": "Half Sleeve", Print: "Bold Back Print" },
    sizeChart: { chest: "43", length: "27" },
    features: [
      { title: "220 GSM Premium Cotton", desc: "Soft hand feel, durable build" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    stock: 90,
    featured: false,
    isActive: true,
  },
  {
    name: "Oversized Drop Shoulder",
    slug: "oversized-drop-shoulder",
    description: "Ultra-oversized drop shoulder tee in a premium heavyweight 240 GSM cotton. A wardrobe essential for streetwear lovers.",
    originalPrice: 2299,
    salePrice: 1899,
    category: "topwear",
    subcategory: "Oversized",
    images: ["/IMG_3033.jpeg", "/IMG_3035.jpeg", "/IMG_3031.jpeg", "/IMG_3034.jpeg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    highlights: { Composition: "100% Cotton", GSM: "240", Color: "Charcoal", "Sleeve length": "Drop Shoulder", Fit: "Ultra Oversized" },
    sizeChart: { chest: "48", length: "30" },
    features: [
      { title: "240 GSM Heavyweight Fabric", desc: "Premium weight, premium feel" },
      { title: "Flexible Payment Options", desc: "COD available + prepaid savings" },
      { title: "Fast Delivery", desc: "Ships within 2-3 business days" },
    ],
    stock: 70,
    featured: true,
    isActive: true,
  },
];

export async function POST() {
  try {
    await connectToDatabase();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert seed data
    const products = await Product.insertMany(seedProducts);

    console.log(`✅ Seeded ${products.length} products successfully!`);

    return NextResponse.json(
      { message: `Seeded ${products.length} products successfully!`, products },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { message: "Failed to seed products", error: String(error) },
      { status: 500 }
    );
  }
}
