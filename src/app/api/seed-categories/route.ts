import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing for a clean slate during dev
    await Category.deleteMany({});
    
    const categories = [
      {
        name: 'Topwear',
        slug: 'topwear',
        columns: [
          {
            title: 'Categories',
            links: [
              { label: 'Oversized T-Shirts', url: '/collections/topwear?filter=oversized' },
              { label: 'T-Shirts', url: '/collections/topwear?filter=tshirts' },
              { label: 'Polos', url: '/collections/topwear?filter=polos' },
              { label: 'Shirts', url: '/collections/topwear?filter=shirts' },
            ]
          },
          {
            title: 'Outerwear',
            links: [
              { label: 'Hoodies', url: '/collections/topwear?filter=hoodies' },
              { label: 'Sweatshirts', url: '/collections/topwear?filter=sweatshirts' },
              { label: 'Jackets', url: '/collections/topwear?filter=jackets' },
              { label: 'Gym Wear', url: '/collections/topwear?filter=gymwear' },
            ]
          }
        ],
        imageCards: [
          { title: 'ESSENTIALS', imageUrl: '/product_vintage_tee.png', url: '/collections/essentials' },
          { title: 'PREMIUM EDIT', imageUrl: '/hero_mens_streetwear.png', url: '/collections/premium' }
        ]
      },
      {
        name: 'Bottomwear',
        slug: 'bottomwear',
        columns: [
          {
            title: 'Styles',
            links: [
              { label: 'Jeans', url: '/collections/bottomwear?filter=jeans' },
              { label: 'Cargos', url: '/collections/bottomwear?filter=cargos' },
              { label: 'Joggers', url: '/collections/bottomwear?filter=joggers' },
              { label: 'Shorts', url: '/collections/bottomwear?filter=shorts' },
            ]
          },
          {
            title: 'Fits',
            links: [
              { label: 'Relaxed Fit', url: '/collections/bottomwear?filter=relaxed' },
              { label: 'Slim Fit', url: '/collections/bottomwear?filter=slim' },
              { label: 'Baggy', url: '/collections/bottomwear?filter=baggy' },
            ]
          }
        ],
        imageCards: [
          { title: 'DENIM EDIT', imageUrl: '/hero_mens_streetwear.png', url: '/collections/denim' },
          { title: 'STREET CARGOS', imageUrl: '/product_vintage_tee.png', url: '/collections/cargos' }
        ]
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        columns: [
          {
            title: 'Headwear',
            links: [
              { label: 'Caps', url: '/collections/accessories?filter=caps' },
              { label: 'Beanies', url: '/collections/accessories?filter=beanies' },
              { label: 'Bucket Hats', url: '/collections/accessories?filter=bucket' },
            ]
          },
          {
            title: 'Jewelry',
            links: [
              { label: 'Chains', url: '/collections/accessories?filter=chains' },
              { label: 'Rings', url: '/collections/accessories?filter=rings' },
              { label: 'Bracelets', url: '/collections/accessories?filter=bracelets' },
            ]
          }
        ],
        imageCards: [
          { title: 'PREMIUM CAPS', imageUrl: '/category_accessories.png', url: '/collections/caps' },
          { title: 'CHAINS', imageUrl: '/product_navy_polo.png', url: '/collections/jewelry' }
        ]
      }
    ];

    await Category.insertMany(categories);
    
    return NextResponse.json({ success: true, message: 'Seeded successfully', categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
