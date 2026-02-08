import type { Metadata } from 'next';
import SessionsClient from './SessionsClient';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Schedule & Agenda | WARS 2026',
    description: 'Explore the full 3-day schedule of the World AI & Robotics Summit 2026. Keynotes, technical sessions, and workshops in Singapore.',
    alternates: {
        canonical: 'https://wars2026.iaisr.info/sessions'
    },
    openGraph: {
        title: 'WARS 2026 Schedule',
        description: '3 Days of AI & Robotics Innovation. Check the full agenda.',
        url: 'https://wars2026.iaisr.info/sessions',
        siteName: 'WARS 2026',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
            }
        ],
        locale: 'en_US',
        type: 'website',
    }
};

export default async function SessionsPage() {
    // Fetch dynamic dates
    let importantDates: any[] = [];
    try {
        importantDates = await (prisma as any).importantDate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }) || [];
    } catch (e) {
        console.error("SessionsPage: Failed to fetch dates", e);
    }

    const conferenceDate = importantDates.find(d => d.event.toLowerCase().includes('conference'));
    const startDateStr = conferenceDate ? new Date(conferenceDate.date).toISOString().split('T')[0] : "2026-05-22";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "World AI & Robotics Summit 2026 - Schedule",
        "startDate": startDateStr,
        "endDate": "2026-05-24", // Assuming 3 days
        "location": {
            "@type": "Place",
            "name": "Marina Bay Sands, Singapore",
            "address": "10 Bayfront Ave, Singapore 018956"
        },
        "subEvent": [
            {
                "@type": "Event",
                "name": "Opening Keynote: The Future of Embodied AI",
                "startDate": `${startDateStr}T09:00:00+08:00`,
                "endDate": `${startDateStr}T10:00:00+08:00`,
                "performer": {
                    "@type": "Person",
                    "name": "Dr. Kenji Tanaka"
                }
            },
            {
                "@type": "Event",
                "name": "Large World Models: Beyond Text",
                "startDate": `${startDateStr}T10:30:00+08:00`,
                "endDate": `${startDateStr}T11:30:00+08:00`,
                "performer": {
                    "@type": "Person",
                    "name": "Dr. Sarah Miller"
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SessionsClient conferenceDate={conferenceDate?.date} />
        </>
    );
}

