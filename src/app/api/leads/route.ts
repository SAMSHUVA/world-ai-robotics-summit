import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, resource } = body;

        if (!name || !email || !phone || !resource) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await (prisma as any).resourceLead.create({
            data: {
                name,
                email,
                phone,
                resource
            }
        });

        return NextResponse.json({ message: 'Lead saved', lead }, { status: 201 });
    } catch (error: any) {
        console.error('Error saving lead:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const leads = await (prisma as any).resourceLead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(Array.isArray(leads) ? leads : []);
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        return NextResponse.json([]);
    }
}
