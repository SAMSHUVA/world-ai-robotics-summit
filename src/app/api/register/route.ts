import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, org, role, dietary, ticketType } = body;

        // 1. Create Attendee Record
        const attendee = await (prisma as any).attendee.create({
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

    } catch (error: any) {
        console.error('Registration error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'This email is already registered.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Registration failed: ' + (error.message || 'Unknown error') }, { status: 500 });
    }
}

export async function GET() {
    try {
        const attendees = await (prisma as any).attendee.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(attendees);
    } catch (error: any) {
        console.error('Get attendees error:', error);
        return NextResponse.json({ error: 'Failed to fetch attendees: ' + error.message }, { status: 500 });
    }
}
