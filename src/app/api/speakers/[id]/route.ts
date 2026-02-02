
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { name, role, affiliation, bio, photoUrl, type } = body;

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        await (prisma as any).speaker.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete speaker error:', error);
        return NextResponse.json({ error: 'Failed to delete speaker: ' + error.message }, { status: 500 });
    }
}
