
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { orderId, status, feedback } = await request.json();

        await (prisma.attendee as any).update({
            where: { razorpayOrderId: orderId },
            data: {
                paymentStatus: status, // e.g., 'ABANDONED'
                paymentFeedback: feedback,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback update error:', error);
        return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
    }
}
