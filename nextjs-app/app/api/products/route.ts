import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');

    const query: any = {};
    
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const db = await getDb();
    const products = await db
      .collection('products')
      .find(query, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { detail: 'Failed to get products' },
      { status: 500 }
    );
  }
}