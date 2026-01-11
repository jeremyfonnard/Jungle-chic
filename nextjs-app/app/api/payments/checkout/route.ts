import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { createCheckoutSession } from '@/lib/stripe';
import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const { order_id, origin_url } = await request.json();

    const db = await getDb();
    const order = await db
      .collection('orders')
      .findOne({ id: order_id, user_id: user.id });

    if (!order) {
      return NextResponse.json({ detail: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ detail: 'Order already paid' }, { status: 400 });
    }

    const successUrl = `${origin_url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin_url}/checkout/cancel`;

    const session = await createCheckoutSession({
      amount: order.total_amount,
      currency: 'usd',
      successUrl,
      cancelUrl,
      metadata: {
        order_id,
        user_id: user.id,
        user_email: user.email,
      },
    });

    const transaction = {
      id: generateUUID(),
      session_id: session.id,
      user_id: user.id,
      order_id,
      amount: order.total_amount,
      currency: 'usd',
      payment_status: 'pending',
      metadata: {
        order_id,
        user_id: user.id,
        user_email: user.email,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.collection('payment_transactions').insertOne(transaction);
    await db
      .collection('orders')
      .updateOne({ id: order_id }, { $set: { stripe_session_id: session.id } });

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { detail: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}