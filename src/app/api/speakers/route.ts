
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, affiliation, bio, photoUrl, type } = body;

        const speaker = await prisma.speaker.create({
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
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create speaker' }, { status: 500 });
    }
}

export async function GET() {
    const speakers = await prisma.speaker.findMany();
    return NextResponse.json(speakers);
}
