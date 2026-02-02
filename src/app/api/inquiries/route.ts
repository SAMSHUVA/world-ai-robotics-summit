import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, whatsappNumber, country } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquiry = await (prisma as any).conferenceInquiry.create({
            data: {
                fullName,
                email,
                whatsappNumber: whatsappNumber || '',
                country: country || 'Not Specified'
            }
        });

        return NextResponse.json({ message: 'Success', inquiry }, { status: 201 });
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
        const inquiries = await (prisma as any).conferenceInquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(Array.isArray(inquiries) ? inquiries : []);
    } catch (error) {
        console.error('Fetch Inquiries Error:', error);
        return NextResponse.json([]);
    }
}
