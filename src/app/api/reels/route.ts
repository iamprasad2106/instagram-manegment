import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const reels = await prisma.reel.findMany({
      where: accountId ? { accountId } : undefined,
      orderBy: { postedAt: 'desc' },
    });

    const parsed = reels.map((r) => ({
      ...r,
      postedAt: r.postedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.reel.create({
      data: {
        accountId: body.accountId,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        caption: body.caption,
        completionRate: body.completionRate || 80,
        audioTitle: body.audioTitle || 'Original Audio',
        duration: body.duration || '0:30',
        status: body.status || 'published',
        viralityScore: Math.floor(Math.random() * 30) + 70,
      },
    });

    return NextResponse.json({
      ...created,
      postedAt: created.postedAt.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.reel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
