import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const testimonials = await (prisma as any).testimonial.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const testimonial = await (prisma as any).testimonial.create({
            data: {
                name: body.name,
                designation: body.designation,
                message: body.message,
                photoUrl: body.photoUrl,
                rating: body.rating || 5,
                order: body.order || 0,
                isActive: body.isActive !== undefined ? body.isActive : true
            }
        });
        return NextResponse.json(testimonial);
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
        const testimonial = await (prisma as any).testimonial.update({
            where: { id: parseInt(id) },
            data: body
        });
        return NextResponse.json(testimonial);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).testimonial.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
