import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    let accounts = await prisma.account.findMany({
      orderBy: { followersCount: 'desc' },
    });

    if (accounts.length === 0) {
      await seedDatabase();
      accounts = await prisma.account.findMany({
        orderBy: { followersCount: 'desc' },
      });
    }

    return NextResponse.json(accounts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanUsername = body.username.replace('@', '').trim().toLowerCase();

    const created = await prisma.account.create({
      data: {
        username: cleanUsername,
        fullName: body.fullName || cleanUsername,
        avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        bio: body.bio || 'Digital creator & aesthetic curator ✨',
        category: body.category || 'Creator',
        website: body.website || '',
        isVerified: body.isVerified ?? false,
        followersCount: body.followersCount || 1000,
        followingCount: body.followingCount || 120,
        postsCount: 0,
        engagementRate: 5.2,
        storyReach: 450,
        profileViewsWeek: 620,
        websiteClicksWeek: 85,
      },
    });

    return NextResponse.json(created);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const updated = await prisma.account.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
