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
    const orders = await db
      .collection('orders')
      .find({ user_id: user.id }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ detail: 'Failed to get orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const shippingAddress = await request.json();

    const db = await getDb();
    const cart = await db.collection('carts').findOne({ user_id: user.id });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ detail: 'Cart is empty' }, { status: 400 });
    }

    const orderItems = [];
    let total = 0;

    for (const cartItem of cart.items) {
      const product = await db
        .collection('products')
        .findOne({ id: cartItem.product_id });

      if (product) {
        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          price: product.price,
        });
        total += product.price * cartItem.quantity;
      }
    }

    const order = {
      id: generateUUID(),
      user_id: user.id,
      items: orderItems,
      total_amount: total,
      shipping_address: shippingAddress,
      payment_status: 'pending',
      order_status: 'processing',
      stripe_session_id: null,
      created_at: new Date().toISOString(),
    };

    await db.collection('orders').insertOne(order);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ detail: 'Failed to create order' }, { status: 500 });
  }
}