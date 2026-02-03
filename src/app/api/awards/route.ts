import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;

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
