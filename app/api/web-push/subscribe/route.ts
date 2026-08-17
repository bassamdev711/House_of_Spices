import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const subscription: unknown = await req.json();
    if (!subscription || typeof subscription !== 'object' || Array.isArray(subscription)) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const value = subscription as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } }
    const endpoint = typeof value.endpoint === 'string' ? value.endpoint.trim() : ''
    const p256dh = typeof value.keys?.p256dh === 'string' ? value.keys.p256dh : ''
    const auth = typeof value.keys?.auth === 'string' ? value.keys.auth : ''
    let endpointUrl: URL
    try { endpointUrl = new URL(endpoint) } catch { endpointUrl = new URL('https://invalid.local') }

    if (!endpoint || endpoint.length > 2048 || endpointUrl.protocol !== 'https:' || !p256dh || p256dh.length > 512 || !auth || auth.length > 512) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await prisma.adminSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh,
        auth,
        userAgent: req.headers.get('user-agent') || 'Unknown',
      },
      create: {
        endpoint,
        p256dh,
        auth,
        userAgent: req.headers.get('user-agent') || 'Unknown',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await verifyAdmin();
    const body: unknown = await req.json();
    const endpoint = body && typeof body === 'object' && !Array.isArray(body) && typeof (body as { endpoint?: unknown }).endpoint === 'string'
      ? (body as { endpoint: string }).endpoint.trim()
      : ''

    if (!endpoint || endpoint.length > 2048) {
      return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
    }

    await prisma.adminSubscription.deleteMany({ where: { endpoint } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
