import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const affiliation = formData.get('affiliation') as string;
        const bio = formData.get('bio') as string;
        const type = formData.get('type') as string || 'KEYNOTE';
        let photoUrl = formData.get('photoUrl') as string;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `speaker-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `speakers/${filename}`;

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

        const speaker = await (prisma as any).speaker.create({
            data: {
                name,
                role,
                affiliation,
                bio: bio || '',
                photoUrl: photoUrl || '',
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
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const affiliation = formData.get('affiliation') as string;
        const bio = formData.get('bio') as string;
        const type = formData.get('type') as string;
        let photoUrl = formData.get('photoUrl') as string;

        if (!id) {
            return NextResponse.json({ error: 'Speaker ID is required for update.' }, { status: 400 });
        }

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `speaker-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `speakers/${filename}`;

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

        const speaker = await (prisma as any).speaker.update({
            where: { id: parseInt(id) },
            data: {
                name,
                role,
                affiliation,
                bio: bio || '',
                photoUrl: photoUrl || '',
                type
            },
        });

        return NextResponse.json(speaker);
    } catch (error: any) {
        console.error('Update speaker error:', error);
        return NextResponse.json({ error: 'Failed to update speaker: ' + error.message }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).speaker.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Speaker deleted' });
    } catch (error: any) {
        console.error('Delete speaker error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { orders } = body; // Array of {id: number, displayOrder: number}

        if (!orders || !Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid orders data' }, { status: 400 });
        }

        // Use a transaction for bulk update
        await prisma.$transaction(
            orders.map((item: any) =>
                (prisma as any).speaker.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Reorder speaker error:', error);
        return NextResponse.json({ error: 'Failed to reorder: ' + error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Try with sorting first
        try {
            const speakers = await (prisma as any).speaker.findMany({
                orderBy: { displayOrder: 'asc' }
            });
            return NextResponse.json(speakers);
        } catch (sortError) {
            console.warn('Sorting failed, falling back to default fetch:', sortError);
            const speakers = await (prisma as any).speaker.findMany();
            return NextResponse.json(speakers);
        }
    } catch (error: any) {
        console.error('Get speakers error:', error);
        return NextResponse.json({ error: 'Failed to fetch speakers: ' + error.message }, { status: 500 });
    }
}
