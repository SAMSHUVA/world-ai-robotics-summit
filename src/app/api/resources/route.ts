import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Ensure Resource table exists
async function ensureResourceTable() {
    await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Resource" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "title" TEXT NOT NULL,
            "fileUrl" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "isVisible" BOOLEAN NOT NULL DEFAULT 1,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function GET() {
    try {
        await ensureResourceTable();
        const resources = await (prisma as any).$queryRawUnsafe(`
            SELECT * FROM "Resource" ORDER BY "createdAt" DESC
        `);
        return NextResponse.json(Array.isArray(resources) ? resources : []);
    } catch (error) {
        console.error('Fetch Resources Error:', error);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        await ensureResourceTable();
        const body = await req.json();
        const { title, fileUrl, category } = body;

        if (!title || !fileUrl) {
            return NextResponse.json({ error: 'Missing title or file' }, { status: 400 });
        }

        await (prisma as any).$executeRawUnsafe(`
            INSERT INTO "Resource" ("title", "fileUrl", "category", "isVisible", "createdAt")
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
        `, title, fileUrl, category || 'Template');

        return NextResponse.json({ message: 'Resource created' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create resource', details: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await ensureResourceTable();
        const body = await req.json();
        const { id, isVisible } = body;

        await (prisma as any).$executeRawUnsafe(`
            UPDATE "Resource" SET "isVisible" = ? WHERE "id" = ?
        `, isVisible ? 1 : 0, id);

        return NextResponse.json({ message: 'Visibility updated' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).$executeRawUnsafe(`
            DELETE FROM "Resource" WHERE "id" = ?
        `, parseInt(id));

        return NextResponse.json({ message: 'Resource deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
