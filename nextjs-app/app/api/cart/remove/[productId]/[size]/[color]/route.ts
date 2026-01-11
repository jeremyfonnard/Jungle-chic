import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; size: string; color: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const { productId, size, color } = params;

    const db = await getDb();
    const cart = await db.collection('carts').findOne({ user_id: user.id });

    if (!cart) {
      return NextResponse.json({ detail: 'Cart not found' }, { status: 404 });
    }

    const items = (cart.items || []).filter(
      (i: any) => !(i.product_id === productId && i.size === size && i.color === color)
    );

    await db.collection('carts').updateOne(
      { user_id: user.id },
      { $set: { items, updated_at: new Date().toISOString() } }
    );

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ detail: 'Failed to remove from cart' }, { status: 500 });
  }
}