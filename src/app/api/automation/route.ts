import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const rules = await prisma.automationRule.findMany({
      where: accountId ? { accountId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const parsed = rules.map((r) => ({
      ...r,
      triggerKeywords: JSON.parse(r.triggerKeywords),
    }));

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.automationRule.create({
      data: {
        accountId: body.accountId,
        name: body.name,
        triggerKeywords: JSON.stringify(body.triggerKeywords || []),
        replyTemplate: body.replyTemplate || '',
        isActive: body.isActive ?? true,
        actionType: body.actionType || 'reply_comment',
        executionCount: 0,
      },
    });

    return NextResponse.json({
      ...created,
      triggerKeywords: JSON.parse(created.triggerKeywords),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const updated = await prisma.automationRule.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      ...updated,
      triggerKeywords: JSON.parse(updated.triggerKeywords),
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

    await prisma.automationRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
