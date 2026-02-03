import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sponsors = await (prisma as any).sponsor.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        return NextResponse.json(sponsors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const tier = formData.get('tier') as string;
        const website = formData.get('website') as string;
        const photoFile = formData.get('file') as File;
        let logoUrl = formData.get('logoUrl') as string;

        if (photoFile && photoFile.size > 0) {
            const buffer = Buffer.from(await photoFile.arrayBuffer());
            const fileName = `sponsor_${Date.now()}_${photoFile.name}`;

            const { data, error } = await supabase.storage
                .from('speakers') // Reusing speakers bucket for simplicity or use a generic one
                .upload(fileName, buffer, {
                    contentType: photoFile.type,
                    upsert: true
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('speakers')
                .getPublicUrl(fileName);

            logoUrl = publicUrl;
        }

        const sponsor = await (prisma as any).sponsor.create({
            data: { name, tier, website, logoUrl }
        });

        return NextResponse.json(sponsor);
    } catch (error: any) {
        console.error('Sponsor POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).sponsor.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
