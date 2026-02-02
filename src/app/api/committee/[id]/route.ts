
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { name, role, photoUrl } = body;

        const member = await prisma.committeeMember.update({
            where: { id },
            data: { name, role, photoUrl },
        });

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        await prisma.committeeMember.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
