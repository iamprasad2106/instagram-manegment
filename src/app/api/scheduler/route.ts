import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const scheduled = await prisma.scheduledPost.findMany({
      where: accountId ? { accountId } : undefined,
      orderBy: { scheduledDateTime: 'asc' },
    });

    const parsed = scheduled.map((s) => ({
      ...s,
      carouselUrls: s.carouselUrls ? JSON.parse(s.carouselUrls) : undefined,
      hashtags: s.hashtags ? JSON.parse(s.hashtags) : [],
      scheduledDateTime: s.scheduledDateTime.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.scheduledPost.create({
      data: {
        accountId: body.accountId,
        type: body.type || 'post',
        mediaUrl: body.mediaUrl,
        carouselUrls: body.carouselUrls ? JSON.stringify(body.carouselUrls) : null,
        caption: body.caption,
        scheduledDateTime: new Date(body.scheduledDateTime),
        status: body.status || 'scheduled',
        hashtags: JSON.stringify(body.hashtags || []),
        location: body.location || null,
        firstComment: body.firstComment || null,
        audioTitle: body.audioTitle || null,
      },
    });

    return NextResponse.json({
      ...created,
      carouselUrls: created.carouselUrls ? JSON.parse(created.carouselUrls) : undefined,
      hashtags: created.hashtags ? JSON.parse(created.hashtags) : [],
      scheduledDateTime: created.scheduledDateTime.toISOString(),
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

    await prisma.scheduledPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
