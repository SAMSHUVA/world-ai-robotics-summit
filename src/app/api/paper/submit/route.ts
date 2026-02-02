import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get('file') as File;
        const authorName = formData.get('authorName') as string;
        const country = formData.get('country') as string;
        const email = formData.get('email') as string;
        const organization = formData.get('organization') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string || '';
        const coAuthors = formData.get('coAuthors') as string || '';

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!authorName || !email || !country || !organization) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload file to Supabase Storage
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = `papers/${filename}`;

        const { data, error: uploadError } = await supabase.storage
            .from('conference-files')
            .upload(filePath, buffer, {
                contentType: file.type || 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json({
                error: 'File upload failed: ' + uploadError.message,
                hint: 'Make sure the "conference-files" storage bucket exists in Supabase'
            }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('conference-files')
            .getPublicUrl(filePath);

        // Save to Database
        const submission = await (prisma as any).paperSubmission.create({
            data: {
                authorName,
                country,
                email,
                organization,
                fileUrl: publicUrl,
                whatsappNumber,
                coAttributes: coAuthors,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            success: true,
            submission
        });

    } catch (error: any) {
        console.error('Submission error:', error);
        return NextResponse.json({
            error: 'Submission failed: ' + error.message,
            details: error.stack
        }, { status: 500 });
    }
}

export async function GET() {
    const submissions = await (prisma as any).paperSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(submissions);
}
