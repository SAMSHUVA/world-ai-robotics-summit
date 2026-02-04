import { Metadata } from 'next';
import SpeakersPageContent from '@/components/SpeakersPageContent';
import SpeakersFAQ from '@/components/SpeakersFAQ';

// SEO Metadata
export const metadata: Metadata = {
    title: "Speakers | WARS '26 - World AI & Robotics Summit",
    description: "Meet the visionary speakers at WARS '26. Join 50+ experts in Generative AI, Robotics, and Intelligent Systems. Apply to speak or register now.",
    keywords: ["AI Conference Speakers", "Robotics Summit", "Call for Papers AI", "WARS 2026 Speakers", "Tech Conference Singapore"],
    openGraph: {
        title: "Speakers | World AI & Robotics Summit '26",
        description: "Discover the industry leaders shaping the future of AI and Robotics. View speaker bios and sessions.",
        type: 'website',
        locale: 'en_US',
        siteName: "WARS '26",
    }
};

// JSON-LD Structured Data for AEO
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Event",
            "name": "World AI & Robotics Summit '26",
            "startDate": "2026-05-22",
            "endDate": "2026-05-24",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
                "@type": "Place",
                "name": "Marina Bay Sands Expo",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "10 Bayfront Ave",
                    "addressLocality": "Singapore",
                    "postalCode": "018956",
                    "addressCountry": "SG"
                }
            },
            "description": "Leading the conversation on Intelligent Systems in Singapore. Join 50+ experts from 20+ countries."
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How can I apply to speak at WARS '26?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You can apply to speak by submitting a proposal through our website's application form. We accept proposals for Keynotes, Panel Discussions, and Technical Workshops."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What topics are you looking for?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We are looking for talks on Generative AI, Robotics, Autonomous Systems, AI Ethics, Computer Vision, and the Future of Work."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is there a deadline for speaker applications?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, the Call for Papers closes on August 31, 2026."
                    }
                }
            ]
        }
    ]
};

export default function SpeakersPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SpeakersPageContent />
            <SpeakersFAQ />
        </>
    );
}
