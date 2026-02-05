import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const applications = await (prisma as any).speakerApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Fetch speaker applications error:', error);
        return NextResponse.json({ error: 'Failed to fetch speaker applications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            linkedin,
            website,
            role,
            company,
            bio,
            title,
            type,
            description,
            duration
        } = body;

        // Map frontend fields to Prisma fields
        const application = await (prisma as any).speakerApplication.create({
            data: {
                fullName,
                email,
                linkedinUrl: linkedin,
                websiteUrl: website,
                currentPosition: role,
                organization: company,
                yearsExperience: 5, // Default for now as it's not in the simplified form
                sessionTitle: title,
                sessionType: type,
                sessionDescription: description,
                durationPreference: parseInt(duration) || 30,
                status: "PENDING"
            }
        });

        return NextResponse.json(application);
    } catch (error: any) {
        console.error('Speaker Application POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).speakerApplication.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Delete speaker application error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
