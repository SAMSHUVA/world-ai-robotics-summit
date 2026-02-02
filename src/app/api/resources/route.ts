
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const resources = await (prisma as any).resource.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(resources);
    } catch (error) {
        console.error('Fetch Resources Error:', error);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, fileUrl, category } = body;

        if (!title || !fileUrl) {
            return NextResponse.json({ error: 'Missing title or file' }, { status: 400 });
        }

        const resource = await (prisma as any).resource.create({
            data: {
                title,
                fileUrl,
                category: category || 'Template',
                isVisible: true
            }
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error: any) {
        console.error('Create Resource Error:', error);
        return NextResponse.json({ error: 'Failed to create resource', details: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, isVisible } = body;

        const resource = await (prisma as any).resource.update({
            where: { id: parseInt(id) },
            data: { isVisible }
        });

        return NextResponse.json(resource);
    } catch (error: any) {
        console.error('Update Resource Error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).resource.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Resource deleted' });
    } catch (error: any) {
        console.error('Delete Resource Error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
