import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { getCheckoutSession } from '@/lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const db = await getDb();
    const transaction = await db
      .collection('payment_transactions')
      .findOne({ session_id: params.sessionId }, { projection: { _id: 0 } });

    if (!transaction) {
      return NextResponse.json({ detail: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.payment_status === 'paid') {
      return NextResponse.json({
        status: 'paid',
        order_id: transaction.order_id,
      });
    }

    const session = await getCheckoutSession(params.sessionId);

    if (session.payment_status === 'paid' && transaction.payment_status !== 'paid') {
      await db.collection('payment_transactions').updateOne(
        { session_id: params.sessionId },
        {
          $set: {
            payment_status: 'paid',
            updated_at: new Date().toISOString(),
          },
        }
      );

      await db.collection('orders').updateOne(
        { id: transaction.order_id },
        {
          $set: {
            payment_status: 'paid',
            order_status: 'confirmed',
          },
        }
      );

      await db.collection('carts').updateOne(
        { user_id: transaction.user_id },
        { $set: { items: [], updated_at: new Date().toISOString() } }
      );
    }

    return NextResponse.json({
      status: session.payment_status,
      order_id: transaction.order_id,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return NextResponse.json(
      { detail: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}