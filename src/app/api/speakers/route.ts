
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, affiliation, bio, photoUrl, type } = body;

        const speaker = await (prisma as any).speaker.create({
            data: {
                name,
                role,
                affiliation,
                bio,
                photoUrl,
                type: type || 'KEYNOTE',
            },
        });

        return NextResponse.json(speaker);
    } catch (error: any) {
        console.error('Create speaker error:', error);
        return NextResponse.json({ error: 'Failed to create speaker: ' + error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, role, affiliation, bio, photoUrl, type } = body;

        if (!id) {
            return NextResponse.json({ error: 'Speaker ID is required for update.' }, { status: 400 });
        }

        const speaker = await (prisma as any).speaker.update({
            where: { id },
            data: { name, role, affiliation, bio, photoUrl, type },
        });

        return NextResponse.json(speaker);
    } catch (error: any) {
        console.error('Update speaker error:', error);
        return NextResponse.json({ error: 'Failed to update speaker: ' + error.message }, { status: 500 });
    }
}

export async function GET() {
    const speakers = await (prisma as any).speaker.findMany();
    return NextResponse.json(speakers);
}
