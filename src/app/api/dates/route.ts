import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const dates = await (prisma as any).importantDate.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(dates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const date = await (prisma as any).importantDate.create({
            data: {
                event: body.event,
                date: new Date(body.date).toISOString(),
                note: body.note,
                order: body.order || 0,
                isActive: body.isActive !== undefined ? body.isActive : true
            }
        });
        return NextResponse.json(date);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const body = await request.json();

        // Handle potential date updates
        if (body.date) {
            body.date = new Date(body.date).toISOString();
        }

        const date = await (prisma as any).importantDate.update({
            where: { id: parseInt(id) },
            data: body
        });
        return NextResponse.json(date);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).importantDate.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
