import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    const db = await getDb();
    const existing = await db.collection('users').findOne({ email });

    if (existing) {
      return NextResponse.json(
        { detail: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUUID();
    const now = new Date().toISOString();

    const user = {
      id: userId,
      email,
      first_name,
      last_name,
      password: hashedPassword,
      created_at: now,
    };

    await db.collection('users').insertOne(user);

    const token = createToken(userId, email);

    return NextResponse.json({
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        created_at: now,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { detail: 'Registration failed' },
      { status: 500 }
    );
  }
}