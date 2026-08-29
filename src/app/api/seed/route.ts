import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await seedDatabase();
    const count = await prisma.account.count();
    return NextResponse.json({ success: true, message: `Database ready with ${count} creator accounts.` });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
