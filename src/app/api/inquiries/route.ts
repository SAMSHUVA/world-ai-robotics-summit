import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, whatsappNumber, country } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Self-healing: Create table if missing (SQLite Syntax)
        await (prisma as any).$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "ConferenceInquiry" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "fullName" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "whatsappNumber" TEXT NOT NULL,
                "country" TEXT NOT NULL,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert using raw SQL to bypass out-of-sync Prisma Client
        await (prisma as any).$executeRawUnsafe(`
            INSERT INTO "ConferenceInquiry" ("fullName", "email", "whatsappNumber", "country", "createdAt")
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, fullName, email, whatsappNumber || '', country || 'Not Specified');

        return NextResponse.json({ message: 'Success' }, { status: 201 });
    } catch (error: any) {
        console.error('Inquiry Submission Error Detail:', error);
        return NextResponse.json({
            error: 'Failed to submit inquiry',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Ensure table exists before querying
        await (prisma as any).$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "ConferenceInquiry" (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "fullName" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "whatsappNumber" TEXT NOT NULL,
                "country" TEXT NOT NULL,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Fetch via raw SQL
        const inquiries = await (prisma as any).$queryRawUnsafe(`
            SELECT * FROM "ConferenceInquiry" ORDER BY "createdAt" DESC
        `);
        return NextResponse.json(Array.isArray(inquiries) ? inquiries : []);
    } catch (error) {
        console.error('Fetch Inquiries Error:', error);
        return NextResponse.json([]);
    }
}
