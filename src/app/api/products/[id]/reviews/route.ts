import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'You must be logged in to leave a review' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { message: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user.toString() === session.user?.id?.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        { message: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const review = {
      name: session.user.name || 'Anonymous User',
      rating: Number(rating),
      comment,
      user: session.user.id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return NextResponse.json(
      { message: 'Review added successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add review error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
