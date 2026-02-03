import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create new coupon (admin only)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, discountType, discountValue, maxUses, validUntil } = body;

        // Validate required fields
        if (!code || !discountType || !discountValue || !validUntil) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if coupon code already exists
        const existing = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Coupon code already exists' },
                { status: 409 }
            );
        }

        // Create coupon
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue: parseFloat(discountValue),
                maxUses: maxUses || 1,
                validUntil: new Date(validUntil),
            },
        });

        return NextResponse.json({
            success: true,
            coupon,
        });
    } catch (error: any) {
        console.error('Create coupon error:', error);
        return NextResponse.json(
            { error: 'Failed to create coupon', details: error.message },
            { status: 500 }
        );
    }
}

// GET - List all coupons (admin only)
export async function GET(req: NextRequest) {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            coupons,
        });
    } catch (error: any) {
        console.error('Get coupons error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve coupons', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove coupon (admin only)
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        await prisma.coupon.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: 'Coupon deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete coupon error:', error);
        return NextResponse.json(
            { error: 'Failed to delete coupon', details: error.message },
            { status: 500 }
        );
    }
}

// PATCH - Toggle coupon active status (admin only)
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, isActive } = body;

        if (!id || isActive === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.update({
            where: { id: parseInt(id) },
            data: { isActive },
        });

        return NextResponse.json({
            success: true,
            coupon,
        });
    } catch (error: any) {
        console.error('Toggle coupon error:', error);
        return NextResponse.json(
            { error: 'Failed to toggle coupon', details: error.message },
            { status: 500 }
        );
    }
}
