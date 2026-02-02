import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Ensure ResourceLead table exists
async function ensureLeadTable() {
    await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ResourceLead" (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "phone" TEXT NOT NULL,
            "resource" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function POST(request: Request) {
    try {
        await ensureLeadTable();
        const body = await request.json();
        const { name, email, phone, resource } = body;

        if (!name || !email || !phone || !resource) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await (prisma as any).$executeRawUnsafe(`
            INSERT INTO "ResourceLead" ("name", "email", "phone", "resource", "createdAt")
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, name, email, phone, resource);

        return NextResponse.json({ message: 'Lead saved' }, { status: 201 });
    } catch (error: any) {
        console.error('Error saving lead:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await ensureLeadTable();
        const leads = await (prisma as any).$queryRawUnsafe(`
            SELECT * FROM "ResourceLead" ORDER BY "createdAt" DESC
        `);
        return NextResponse.json(Array.isArray(leads) ? leads : []);
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        return NextResponse.json([]);
    }
}
