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
      const newCart = {
        id: crypto.randomUUID(),
        user_id: user.id,
        items: [{ product_id, size, color, quantity }],
        updated_at: new Date().toISOString(),
      };
      await db.collection('carts').insertOne(newCart);
    } else {
      const items = cart.items || [];
      const existingItem = items.find(
        (i: any) => i.product_id === product_id && i.size === size && i.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ product_id, size, color, quantity });
      }

      await db.collection('carts').updateOne(
        { user_id: user.id },
        { $set: { items, updated_at: new Date().toISOString() } }
      );
    }

    return NextResponse.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ detail: 'Failed to add to cart' }, { status: 500 });
  }
}