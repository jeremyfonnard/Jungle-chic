import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getDb } from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'jungle-swimwear-secret-key-2024';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export function createToken(userId: string, email: string): string {
  return jwt.sign(
    { user_id: userId, email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }

  const db = await getDb();
  const user = await db.collection('users').findOne(
    { id: payload.user_id },
    { projection: { _id: 0, password: 0 } }
  );

  return user as User | null;
}