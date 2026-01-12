import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDb();
    const order = await db
      .collection('orders')
      .findOne(
        { id: params.id, user_id: user.id },
        { projection: { _id: 0 } }
      );

    if (!order) {
      return NextResponse.json({ detail: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ detail: 'Failed to get order' }, { status: 500 });
  }
}