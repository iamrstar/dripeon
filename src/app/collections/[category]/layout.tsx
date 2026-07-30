import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const { category } = params;
  const categoryTitle = category.replace(/-/g, ' ').toUpperCase();
  const description = `Shop the latest ${categoryTitle} at Dripeon. Find premium streetwear and hip-hop outfits.`;
  
  return {
    title: `${categoryTitle} Collections`,
    description,
    alternates: {
      canonical: `https://dripeon.com/collections/${category}`,
    },
    openGraph: {
      title: `${categoryTitle} Collections | Dripeon`,
      description,
      url: `https://dripeon.com/collections/${category}`,
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
