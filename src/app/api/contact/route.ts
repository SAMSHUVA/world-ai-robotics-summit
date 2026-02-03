import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });

        return NextResponse.json({ message: 'Success', contactMessage }, { status: 201 });
    } catch (error: any) {
        console.error('Contact Submission Error:', error);
        return NextResponse.json({
            error: 'Failed to submit contact request',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Fetch Messages Error:', error);
        return NextResponse.json([]);
    }
}
