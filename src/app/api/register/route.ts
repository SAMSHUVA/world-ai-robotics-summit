import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, org, role, dietary, ticketType } = body;

        // 1. Create Attendee Record
        const attendee = await prisma.attendee.create({
            data: {
                firstName,
                lastName,
                email,
                org,
                role,
                dietary,
                ticketType,
                hasPaid: false, // Will update after mock payment
            },
        });

        // 2. Simulate Payment Gateway Interaction (Stripe Intent)
        // In a real app, we would create a Stripe PaymentIntent here and return client_secret
        const mockPaymentIntentId = `pi_${Math.random().toString(36).substring(7)}`;

        return NextResponse.json({
            success: true,
            attendee,
            paymentIntentId: mockPaymentIntentId,
            message: 'Redirecting to payment...'
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}

export async function GET() {
    const attendees = await prisma.attendee.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(attendees);
}
