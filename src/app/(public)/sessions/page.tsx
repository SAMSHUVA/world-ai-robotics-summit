import type { Metadata } from 'next';
import SessionsClient from './SessionsClient';

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

export default function SessionsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "World AI & Robotics Summit 2026 - Schedule",
        "startDate": "2026-05-22",
        "endDate": "2026-05-24",
        "location": {
            "@type": "Place",
            "name": "Marina Bay Sands, Singapore",
            "address": "10 Bayfront Ave, Singapore 018956"
        },
        "subEvent": [
            {
                "@type": "Event",
                "name": "Opening Keynote: The Future of Embodied AI",
                "startDate": "2026-05-22T09:00:00+08:00",
                "endDate": "2026-05-22T10:00:00+08:00",
                "performer": {
                    "@type": "Person",
                    "name": "Dr. Kenji Tanaka"
                }
            },
            {
                "@type": "Event",
                "name": "Large World Models: Beyond Text",
                "startDate": "2026-05-22T10:30:00+08:00",
                "endDate": "2026-05-22T11:30:00+08:00",
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
            <SessionsClient />
        </>
    );
}
