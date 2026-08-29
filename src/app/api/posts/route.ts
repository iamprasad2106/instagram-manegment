import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const posts = await prisma.post.findMany({
      where: accountId ? { accountId } : undefined,
      orderBy: { postedAt: 'desc' },
    });

    const parsed = posts.map((p) => ({
      ...p,
      carouselUrls: p.carouselUrls ? JSON.parse(p.carouselUrls) : undefined,
      hashtags: p.hashtags ? JSON.parse(p.hashtags) : [],
      taggedUsers: p.taggedUsers ? JSON.parse(p.taggedUsers) : undefined,
      postedAt: p.postedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.post.create({
      data: {
        accountId: body.accountId,
        mediaUrl: body.mediaUrl,
        carouselUrls: body.carouselUrls ? JSON.stringify(body.carouselUrls) : null,
        mediaType: body.mediaType || 'image',
        caption: body.caption,
        status: body.status || 'published',
        hashtags: JSON.stringify(body.hashtags || []),
        location: body.location || null,
        taggedUsers: body.taggedUsers ? JSON.stringify(body.taggedUsers) : null,
      },
    });

    return NextResponse.json({
      ...created,
      carouselUrls: created.carouselUrls ? JSON.parse(created.carouselUrls) : undefined,
      hashtags: created.hashtags ? JSON.parse(created.hashtags) : [],
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

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
