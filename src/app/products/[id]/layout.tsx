import { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let title = 'Product | Dripeon';
  let description = 'Check out this product on Dripeon.';
  let imageUrl = '/hero_mens_streetwear.png';

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      
      // Check if ID is a valid MongoDB ObjectId or a Slug
      const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { _id: id } : { slug: id };
      
      const product = await Product.findOne(query).lean();

      if (product) {
        title = `${product.name} | Dripeon`;
        description = product.description || `Buy ${product.name} for just Rs.${product.salePrice}. Upgrade your closet with everything trendy and new.`;
        if (product.images && product.images.length > 0) {
          imageUrl = product.images[0];
        }
      }
    }
  } catch {
    // Silently fall back to default metadata
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://dripeon.com/products/${id}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
