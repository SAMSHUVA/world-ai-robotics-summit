import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_PRICES = [
    { type: 'EARLY_BIRD', label: 'Early Bird registration', price: 299 },
    { type: 'REGULAR', label: 'Regular registration', price: 399 },
    { type: 'STUDENT', label: 'Student registration', price: 199 },
    { type: 'E_ORAL', label: 'E-Oral Presentation', price: 149 },
    { type: 'E_POSTER', label: 'E-Poster Presentation', price: 99 },
    { type: 'LISTENER', label: 'Listener registration', price: 79 },
];

export async function GET() {
    try {
        let prices = await (prisma as any).ticketPrice.findMany();

        // If no prices in DB yet, seed with defaults
        if (prices.length === 0) {
            for (const p of DEFAULT_PRICES) {
                await (prisma as any).ticketPrice.create({ data: p });
            }
            prices = await (prisma as any).ticketPrice.findMany();
        }

        return NextResponse.json(prices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { type, price } = body;

        if (!type || price === undefined) {
            return NextResponse.json({ error: 'Type and Price required' }, { status: 400 });
        }

        const updated = await (prisma as any).ticketPrice.update({
            where: { type },
            data: { price: parseFloat(price) }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
