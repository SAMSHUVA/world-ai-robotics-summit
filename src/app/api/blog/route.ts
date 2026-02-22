import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    try {
        if (id) {
            const post = await prisma.blogPost.findUnique({
                where: { id: parseInt(id) }
            });
            return NextResponse.json(post);
        }

        if (slug) {
            const post = await prisma.blogPost.findUnique({
                where: { slug }
            });
            return NextResponse.json(post);
        }

        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const excerpt = formData.get('excerpt') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const readTime = formData.get('readTime') as string;
        const file = formData.get('file') as File;
        let image = formData.get('image') as string;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `blog-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `blog/${filename}`;

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

            image = publicUrl;
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                author,
                category,
                image: image || '',
                isPublished,
                readTime
            }
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post: ' + error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const excerpt = formData.get('excerpt') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const readTime = formData.get('readTime') as string;
        const file = formData.get('file') as File;
        let image = formData.get('image') as string;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `blog-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = `blog/${filename}`;

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

            image = publicUrl;
        }

        const updateData: any = {
            title,
            excerpt,
            content,
            author,
            category,
            isPublished,
            readTime
        };

        if (image) {
            updateData.image = image;
        }

        const post = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ error: 'Failed to update blog post: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await prisma.blogPost.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}
