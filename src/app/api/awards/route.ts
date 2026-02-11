import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const awards = await (prisma as any).award.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        return NextResponse.json(awards);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let title, category, description;

        if (contentType.includes('application/json')) {
            const body = await request.json();
            title = body.title;
            category = body.category;
            description = body.description;
        } else {
            const formData = await request.formData();
            title = formData.get('title') as string;
            category = formData.get('category') as string;
            description = formData.get('description') as string;
        }

        const award = await (prisma as any).award.create({
            data: { title, category, description }
        });

        return NextResponse.json(award);
    } catch (error: any) {
        console.error('Award POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).award.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let id, title, category, description;

        if (contentType.includes('application/json')) {
            const body = await request.json();
            id = body.id;
            title = body.title;
            category = body.category;
            description = body.description;
        } else {
            const formData = await request.formData();
            id = formData.get('id') as string;
            title = formData.get('title') as string;
            category = formData.get('category') as string;
            description = formData.get('description') as string;
        }

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const award = await (prisma as any).award.update({
            where: { id: parseInt(id) },
            data: { title, category, description }
        });

        return NextResponse.json(award);
    } catch (error: any) {
        console.error('Award PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
