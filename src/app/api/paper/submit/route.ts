import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

        let fileUrl = '';

        // Try to save file locally (works in development, fails gracefully in production/Vercel)
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const uploadDir = join(process.cwd(), 'public/uploads');

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });

            const filepath = join(uploadDir, filename);
            await writeFile(filepath, buffer);
            fileUrl = `/uploads/${filename}`;
        } catch (fileError: any) {
            console.error('File save error (expected on Vercel):', fileError.message);
            // On Vercel, file system is read-only. Store filename as placeholder.
            fileUrl = `[PENDING_UPLOAD]_${file.name}`;
        }

        // Save to Database
        const submission = await (prisma as any).paperSubmission.create({
            data: {
                authorName,
                country,
                email,
                organization,
                fileUrl,
                whatsappNumber,
                coAttributes: coAuthors,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            success: true,
            submission,
            warning: fileUrl.startsWith('[PENDING_UPLOAD]')
                ? 'Paper metadata saved. File upload requires external storage (S3/Cloudinary) on Vercel.'
                : undefined
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
