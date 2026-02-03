import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Validate coupon code
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { valid: false, error: 'Coupon code is required' },
                { status: 400 }
            );
        }

        // Find coupon (try original, then upper, then lower)
        let coupon = await (prisma as any).coupon.findUnique({
            where: { code: code },
        });

        if (!coupon) {
            coupon = await (prisma as any).coupon.findUnique({
                where: { code: code.toUpperCase() },
            });
        }

        if (!coupon) {
            coupon = await (prisma as any).coupon.findUnique({
                where: { code: code.toLowerCase() },
            });
        }

        // Check if coupon exists
        if (!coupon) {
            console.log(`Coupon validation failed: Code "${code}" not found in DB`);
            return NextResponse.json({
                valid: false,
                error: 'Invalid coupon code',
            });
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            return NextResponse.json({
                valid: false,
                error: 'This coupon is no longer active',
            });
        }

        // Check if coupon has expired
        if (new Date() > new Date(coupon.validUntil)) {
            return NextResponse.json({
                valid: false,
                error: 'This coupon has expired',
            });
        }

        // Check if coupon has reached max uses
        if (coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({
                valid: false,
                error: 'This coupon has reached its usage limit',
            });
        }

        // Coupon is valid
        return NextResponse.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
        });
    } catch (error: any) {
        console.error('Validate coupon error:', error);
        return NextResponse.json(
            { valid: false, error: 'Failed to validate coupon', details: error.message },
            { status: 500 }
        );
    }
}
