import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDb();
    let cart = await db.collection('carts').findOne(
      { user_id: user.id },
      { projection: { _id: 0 } }
    );

    if (!cart) {
      cart = {
        id: generateUUID(),
        user_id: user.id,
        items: [],
        updated_at: new Date().toISOString(),
      };
      await db.collection('carts').insertOne(cart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ detail: 'Failed to get cart' }, { status: 500 });
  }
}