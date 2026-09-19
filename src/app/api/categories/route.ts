import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-topwear', name: 'Topwear', slug: 'topwear', image: '/product_vintage_tee.png' },
  { _id: 'cat-bottomwear', name: 'Bottomwear', slug: 'bottomwear', image: '/IMG_3031.jpeg' },
  { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories', image: '/category_accessories.png' },
  { _id: 'cat-new', name: 'New Arrivals', slug: 'new-arrivals', image: '/product_navy_polo.png' },
];

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: 1 });
    if (!categories || categories.length === 0) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}
