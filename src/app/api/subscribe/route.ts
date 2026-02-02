import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.create({
            data: { email },
        });

        return NextResponse.json({ success: true, subscriber });
    } catch (error) {
        console.error('Subscribe error:', error);
        // Handle unique constraint violation
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
