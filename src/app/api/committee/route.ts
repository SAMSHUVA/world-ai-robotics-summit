import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        let photoUrl = formData.get('photoUrl') as string;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `committee-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `committee/${filename}`;

            const { data, error: uploadError } = await supabase.storage
                .from('conference-files')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('conference-files')
                .getPublicUrl(filePath);

            photoUrl = publicUrl;
        }

        const member = await (prisma as any).committeeMember.create({
            data: {
                name,
                role,
                photoUrl: photoUrl || '',
            },
        });

        return NextResponse.json(member);
    } catch (error: any) {
        console.error('Create committee error:', error);
        return NextResponse.json({ error: 'Failed to create committee member: ' + error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        let photoUrl = formData.get('photoUrl') as string;

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `committee-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `committee/${filename}`;

            const { data, error: uploadError } = await supabase.storage
                .from('conference-files')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('conference-files')
                .getPublicUrl(filePath);

            photoUrl = publicUrl;
        }

        const member = await (prisma as any).committeeMember.update({
            where: { id: parseInt(id) },
            data: {
                name,
                role,
                photoUrl: photoUrl || '',
            },
        });

        return NextResponse.json(member);
    } catch (error: any) {
        console.error('Update committee error:', error);
        return NextResponse.json({ error: 'Failed to update member: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).committeeMember.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error: any) {
        console.error('Delete committee error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { orders } = body;

        if (!orders || !Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid orders data' }, { status: 400 });
        }

        await prisma.$transaction(
            orders.map((item: any) =>
                (prisma as any).committeeMember.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Reorder committee error:', error);
        return NextResponse.json({ error: 'Failed to reorder: ' + error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        try {
            const members = await (prisma as any).committeeMember.findMany({
                orderBy: { displayOrder: 'asc' }
            });
            return NextResponse.json(members);
        } catch (sortError) {
            console.warn('Committee sorting failed, falling back:', sortError);
            const members = await (prisma as any).committeeMember.findMany();
            return NextResponse.json(members);
        }
    } catch (error: any) {
        console.error('Get committee error:', error);
        return NextResponse.json({ error: 'Failed to fetch committee: ' + error.message }, { status: 500 });
    }
}
