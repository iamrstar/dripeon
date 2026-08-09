import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string | string[] }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryArray = Array.isArray(category) ? category : [category];
  const categoryTitle = categoryArray.join(' / ').replace(/-/g, ' ').toUpperCase();
  const categoryPath = categoryArray.join('/');
  
  const description = `Shop the latest ${categoryTitle} at Dripeon. Find premium streetwear and hip-hop outfits.`;
  
  return {
    title: `${categoryTitle} Collections`,
    description,
    alternates: {
      canonical: `https://dripeon.com/collections/${categoryPath}`,
    },
    openGraph: {
      title: `${categoryTitle} Collections | Dripeon`,
      description,
      url: `https://dripeon.com/collections/${categoryPath}`,
      images: ['/hero_mens_streetwear.png'], // You can dynamically change this based on category if needed
    }
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
