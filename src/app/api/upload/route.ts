
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create filename and path
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const uploadDir = join(process.cwd(), 'public/uploads');

        try {
            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });

            const filepath = join(uploadDir, filename);
            await writeFile(filepath, buffer);

            return NextResponse.json({ url: `/uploads/${filename}` });
        } catch (fsError: any) {
            console.error('File system error (Vercel does not support file uploads):', fsError.message);

            // On Vercel, return a placeholder URL with the filename
            return NextResponse.json({
                url: `[LOCAL_ONLY]_${filename}`,
                warning: 'File system uploads not supported on Vercel. Use Cloudinary or S3 for production.'
            });
        }

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed: ' + error.message
        }, { status: 500 });
    }
}
