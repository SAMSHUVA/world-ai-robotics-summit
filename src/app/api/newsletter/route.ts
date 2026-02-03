import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.create({
            data: { email }
        });

        return NextResponse.json({ message: 'Success', subscriber }, { status: 201 });
    } catch (error: any) {
        console.error('Newsletter Subscription Error:', error);
        // Handle unique constraint if email already exists
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to subscribe',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Fetch Subscribers Error:', error);
        return NextResponse.json([]);
    }
}
