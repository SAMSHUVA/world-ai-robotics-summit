
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const TICKET_PRICES: Record<string, number> = {
    'EARLY_BIRD': 500000, // Amount in paise (e.g., 5000 INR = 500000 paise)
    'REGULAR': 750000,
    'STUDENT': 300000,
};

export async function POST(request: Request) {
    try {
        const { attendeeId, ticketType } = await request.json();

        const amount = TICKET_PRICES[ticketType];
        if (!amount) {
            return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
        }

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${attendeeId}`,
        };

        const order = await razorpay.orders.create(options);

        // Update attendee with order ID
        await prisma.attendee.update({
            where: { id: attendeeId },
            data: { razorpayOrderId: order.id }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
