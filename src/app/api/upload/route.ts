import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = `uploads/${filename}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('conference-files')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({
                error: 'Upload failed: ' + error.message,
                hint: 'Make sure the "conference-files" storage bucket exists in Supabase'
            }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('conference-files')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed: ' + error.message
        }, { status: 500 });
    }
}
