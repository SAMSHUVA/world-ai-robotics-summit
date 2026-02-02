
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, photoUrl } = body;

        const member = await (prisma as any).committeeMember.create({
            data: {
                name,
                role,
                photoUrl,
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create committee member' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const members = await (prisma as any).committeeMember.findMany();
        return NextResponse.json(members);
    } catch (error: any) {
        console.error('Get committee error:', error);
        return NextResponse.json({ error: 'Failed to fetch committee: ' + error.message }, { status: 500 });
    }
}
