import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const testimonials = await (prisma as any).testimonial.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function uploadFile(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `testimonial-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = `testimonials/${filename}`;

    const { error: uploadError } = await supabase.storage
        .from('conference-files')
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('conference-files')
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const designation = formData.get('designation') as string;
        const message = formData.get('message') as string;
        const rating = parseInt(formData.get('rating') as string || '5');
        const order = parseInt(formData.get('order') as string || '0');
        const isActive = formData.get('isActive') === 'true';
        const file = formData.get('file') as File;

        let photoUrl = formData.get('photoUrl') as string;

        if (file && file.size > 0) {
            photoUrl = await uploadFile(file);
        }

        const testimonial = await (prisma as any).testimonial.create({
            data: {
                name,
                designation,
                message,
                photoUrl,
                rating,
                order,
                isActive
            }
        });
        return NextResponse.json(testimonial);
    } catch (error: any) {
        console.error('Testimonial POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let id = searchParams.get('id');
        const formData = await request.formData();
        if (!id) id = formData.get('id') as string;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const data: any = {};

        if (formData.has('name')) data.name = formData.get('name');
        if (formData.has('designation')) data.designation = formData.get('designation');
        if (formData.has('message')) data.message = formData.get('message');
        if (formData.has('rating')) data.rating = parseInt(formData.get('rating') as string);
        if (formData.has('order')) data.order = parseInt(formData.get('order') as string);
        if (formData.has('isActive')) data.isActive = formData.get('isActive') === 'true';

        const file = formData.get('file') as File;
        if (file && file.size > 0) {
            data.photoUrl = await uploadFile(file);
        }

        const testimonial = await (prisma as any).testimonial.update({
            where: { id: parseInt(id) },
            data
        });
        return NextResponse.json(testimonial);
    } catch (error: any) {
        console.error('Testimonial PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).testimonial.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
