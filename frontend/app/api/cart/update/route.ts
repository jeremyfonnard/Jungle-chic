import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const { product_id, size, color, quantity } = await request.json();

    const db = await getDb();
    const cart = await db.collection('carts').findOne({ user_id: user.id });

    if (!cart) {
      return NextResponse.json({ detail: 'Cart not found' }, { status: 404 });
    }

    const items = cart.items || [];
    const item = items.find(
      (i: any) => i.product_id === product_id && i.size === size && i.color === color
    );

    if (item) {
      item.quantity = quantity;
    }

    await db.collection('carts').updateOne(
      { user_id: user.id },
      { $set: { items, updated_at: new Date().toISOString() } }
    );

    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ detail: 'Failed to update cart' }, { status: 500 });
  }
}