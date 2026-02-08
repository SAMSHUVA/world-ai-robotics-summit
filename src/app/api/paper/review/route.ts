import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { paperId, reviewerName, score, comments } = body;

        if (!paperId || !reviewerName || score === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prismaAny = prisma as any;

        // Debug check to see if model exists
        if (!prismaAny.paperReview) {
            console.error('Available Prisma models:', Object.keys(prismaAny).filter(k => !k.startsWith('$')));
            return NextResponse.json({
                error: 'Server configuration error: PaperReview model not found in database client. Please run "npx prisma generate" after stopping the server.'
            }, { status: 500 });
        }

        const review = await prismaAny.paperReview.create({
            data: {
                paperId: parseInt(paperId),
                reviewerName,
                score: parseInt(score),
                comments
            }
        });

        return NextResponse.json({ success: true, review });
    } catch (error: any) {
        console.error('Review submission error:', error);
        return NextResponse.json({ error: 'Failed to submit review: ' + error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paperId = searchParams.get('paperId');

        if (!paperId) {
            return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
        }

        const reviews = await (prisma as any).paperReview.findMany({
            where: { paperId: parseInt(paperId) },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error: any) {
        console.error('Fetch reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews: ' + error.message }, { status: 500 });
    }
}
