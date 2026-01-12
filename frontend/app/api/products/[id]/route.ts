import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const product = await db
      .collection('products')
      .findOne({ id: params.id }, { projection: { _id: 0 } });

    if (!product) {
      return NextResponse.json(
        { detail: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { detail: 'Failed to get product' },
      { status: 500 }
    );
  }
}