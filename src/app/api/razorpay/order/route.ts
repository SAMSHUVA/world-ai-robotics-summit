
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const USD_TO_INR = 84;

const TICKET_PRICES: Record<string, number> = {
    'EARLY_BIRD': 299,
    'REGULAR': 399,
    'STUDENT': 199,
    'E_ORAL': 149,
    'E_POSTER': 99,
    'LISTENER': 79,
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { attendeeId, ticketType, discountAmount, customTotal } = body;

        let amountInUsd = TICKET_PRICES[ticketType];

        if (!amountInUsd) {
            return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
        }

        // Apply discount if provided (discountAmount is in USD)
        if (discountAmount) {
            amountInUsd -= discountAmount;
        }

        // Add 5% tax (matching frontend logic)
        const totalUsd = amountInUsd * 1.05;

        // Convert to INR and then to Paise
        // We use Math.round to avoid floating point issues with Razorpay
        const amountInPaise = Math.round(totalUsd * USD_TO_INR * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${attendeeId}`,
        };

        const order = await razorpay.orders.create(options);

        // Update attendee with order ID
        await (prisma.attendee as any).update({
            where: { id: attendeeId },
            data: { razorpayOrderId: order.id }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
