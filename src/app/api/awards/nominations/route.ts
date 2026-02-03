import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const nominations = await (prisma as any).awardNomination.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(nominations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch nominations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, nomineeName, affiliation, justification } = body;

        const nomination = await (prisma as any).awardNomination.create({
            data: { category, nomineeName, affiliation, justification }
        });

        return NextResponse.json(nomination);
    } catch (error: any) {
        console.error('Nomination POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).awardNomination.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
