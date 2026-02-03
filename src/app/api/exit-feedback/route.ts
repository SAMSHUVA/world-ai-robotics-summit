import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Save exit feedback
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, ticketType, abandonReason, additionalNotes, wasOfferedCoupon, acceptedCoupon } = body;

        // Validate required fields
        if (!abandonReason) {
            return NextResponse.json(
                { error: 'Abandon reason is required' },
                { status: 400 }
            );
        }

        // Create exit feedback record
        const feedback = await prisma.exitFeedback.create({
            data: {
                email: email || null,
                ticketType: ticketType || null,
                abandonReason,
                additionalNotes: additionalNotes || null,
                wasOfferedCoupon: wasOfferedCoupon || false,
                acceptedCoupon: acceptedCoupon || false,
            },
        });

        return NextResponse.json({
            success: true,
            feedback,
        });
    } catch (error: any) {
        console.error('Exit feedback error:', error);
        return NextResponse.json(
            { error: 'Failed to save exit feedback', details: error.message },
            { status: 500 }
        );
    }
}

// GET - Retrieve all exit feedback (admin only)
export async function GET(req: NextRequest) {
    try {
        const feedbacks = await prisma.exitFeedback.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate statistics
        const stats = {
            total: feedbacks.length,
            priceHigh: feedbacks.filter(f => f.abandonReason === 'PRICE_HIGH').length,
            notReady: feedbacks.filter(f => f.abandonReason === 'NOT_READY').length,
            needApproval: feedbacks.filter(f => f.abandonReason === 'NEED_APPROVAL').length,
            technicalIssue: feedbacks.filter(f => f.abandonReason === 'TECHNICAL_ISSUE').length,
            other: feedbacks.filter(f => f.abandonReason === 'OTHER').length,
            couponsOffered: feedbacks.filter(f => f.wasOfferedCoupon).length,
            couponsAccepted: feedbacks.filter(f => f.acceptedCoupon).length,
            acceptanceRate: feedbacks.filter(f => f.wasOfferedCoupon).length > 0
                ? Math.round((feedbacks.filter(f => f.acceptedCoupon).length / feedbacks.filter(f => f.wasOfferedCoupon).length) * 100)
                : 0,
        };

        return NextResponse.json({
            success: true,
            feedbacks,
            stats,
        });
    } catch (error: any) {
        console.error('Get exit feedback error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve exit feedback', details: error.message },
            { status: 500 }
        );
    }
}
