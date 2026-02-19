import type { Metadata } from 'next';
import SessionsClient from './SessionsClient';
import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from '@/config/conference';
import { getSiteSettings } from "@/config/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Schedule & Agenda | ${settings.name} ${settings.year}`,
        description: `Explore the full 3-day schedule of the ${settings.fullName}. Keynotes, technical sessions, and workshops in ${settings.location}.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/sessions`
        },
        openGraph: {
            title: `${settings.name} ${settings.year} Schedule`,
            description: `3 Days of AI & Robotics Innovation. Check the full agenda.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/sessions`,
            siteName: `${settings.name} ${settings.year}`,
            type: 'website',
        }
    };
}

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

    const settings = await getSiteSettings();
    const conferenceDate = importantDates.find(d => d.event.toLowerCase().includes('conference'));
    const startDateStr = conferenceDate ? new Date(conferenceDate.date).toISOString().split('T')[0] : CONFERENCE_CONFIG.dates.start;

    // Fetch Agenda Resource
    let agendaUrl = null;
    try {
        const agendaResource = await (prisma as any).resource.findFirst({
            where: {
                title: { contains: 'Agenda', mode: 'insensitive' },
                isVisible: true
            }
        });
        if (agendaResource) {
            agendaUrl = agendaResource.fileUrl;
        }
    } catch (e) {
        console.error("SessionsPage: Failed to fetch agenda", e);
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": `${settings.fullName} - Schedule`,
        "startDate": startDateStr,
        "endDate": CONFERENCE_CONFIG.dates.end,
        "location": {
            "@type": "Place",
            "name": settings.venue,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": settings.location,
                "addressCountry": "IN"
            }
        },
        "image": [
            `${CONFERENCE_CONFIG.urls.canonical}/Iaisr%20Logo.webp`,
            `${CONFERENCE_CONFIG.urls.canonical}/banner2.png`
        ],
        "offers": {
            "@type": "Offer",
            "url": `${CONFERENCE_CONFIG.urls.canonical}/register`,
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString().split('T')[0]
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
            <SessionsClient conferenceDate={conferenceDate?.date} settings={settings} agendaUrl={agendaUrl} />
        </>
    );
}
