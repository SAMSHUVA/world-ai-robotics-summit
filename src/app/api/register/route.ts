import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, org, role, dietary, ticketType, attendanceMode, couponCode, discountApplied } = body;

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
                attendanceMode: attendanceMode || 'IN_PERSON',
                couponCode: couponCode || null,
                discountApplied: discountApplied ? parseFloat(discountApplied) : 0,
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

export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const body = await request.json();
        const updated = await (prisma as any).attendee.update({
            where: { id: parseInt(id) },
            data: body
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Update attendee error:', error);
        return NextResponse.json({ error: 'Update failed: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).attendee.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete attendee error:', error);
        return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 });
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
