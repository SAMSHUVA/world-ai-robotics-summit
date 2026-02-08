import { Metadata } from "next";
import CallForPapersClient from "./CallForPapersClient";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Call for Papers | WARS '26 Singapore - Artificial Intelligence & Robotics Summit",
    description: "Submit your research abstract for the World AI & Robotics Summit 2026. Join global experts in Singapore to discuss Generative AI, Machine Learning, and Autonomous Systems.",
    keywords: "Call for Papers, AI Conference 2026, Robotics Summit, Machine Learning Research, Singapore AI Event, WARS 2026, IAISR",
    alternates: {
        canonical: "https://wars2026.iaisr.info/call-for-papers",
    },
    openGraph: {
        title: "Call for Papers - WARS '26 Singapore",
        description: "Be part of the future of AI and Robotics. Abstract submission now open for WARS 2026.",
        url: "https://wars2026.iaisr.info/call-for-papers",
        siteName: "WARS 2026",
        locale: "en_US",
        type: "website",
    },
};

export default async function CallForPapersPage() {
    // Fetch dynamic dates
    let importantDates: any[] = [];
    try {
        importantDates = await (prisma as any).importantDate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }) || [];
    } catch (e) {
        console.error("CallForPapersPage: Failed to fetch dates", e);
    }

    // Identify specific dates for JSON-LD and FAQ
    const conferenceDate = importantDates.find(d => d.event.toLowerCase().includes('conference'));
    const abstractDate = importantDates.find(d => d.event.toLowerCase().includes('abstract'));

    const startDateStr = conferenceDate ? new Date(conferenceDate.date).toISOString() : "2026-05-22T09:00:00+08:00";
    // Assuming 3 days if not specified or just use the same if end date isn't found
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    const endDateStr = endDate.toISOString();

    const abstractDeadlineStr = abstractDate
        ? new Date(abstractDate.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : "March 15, 2026";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "World AI & Robotics Summit 2026 (WARS '26)",
        startDate: startDateStr,
        endDate: endDateStr,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: {
            "@type": "Place",
            name: "Marina Bay Sands",
            address: {
                "@type": "PostalAddress",
                streetAddress: "10 Bayfront Ave",
                addressLocality: "Singapore",
                postalCode: "018956",
                addressCountry: "SG",
            },
        },
        description: "The premier summit for researchers in AI and Robotics to present their latest breakthroughs.",
        organizer: {
            "@type": "Organization",
            name: "IAISR",
            url: "https://iaisr.org",
        },
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is the deadline for paper submission at WARS '26?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The abstract submission deadline is ${abstractDeadlineStr}.`,
                },
            },
            {
                "@type": "Question",
                name: "How long should the submitted papers be?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Papers should be a maximum of 8 pages, including references, formatted according to the official WARS templates.",
                },
            },
            {
                "@type": "Question",
                name: "Is the review process at WARS '26 anonymous?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, WARS follows a double-blind peer-review process to ensure objective evaluations.",
                },
            },
        ],
    };

    const faqSection = (
        <section id="faq" style={{ marginTop: "80px", marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
                <span style={{ fontSize: "1.5rem", color: "var(--primary)" }}>?</span>
                <h2 style={{ fontSize: "2rem" }}>Common Author Questions (FAQ)</h2>
            </div>
            <div style={{ display: "grid", gap: "20px" }}>
                <article className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>What is the abstract submission deadline?</h3>
                    <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                        The final date to submit your research abstracts is <strong>{abstractDeadlineStr}</strong>. Late submissions will not be considered for the primary proceedings.
                    </p>
                </article>
                <article className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Do you accept remote presentations?</h3>
                    <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                        Yes, WARS '26 is a hybrid summit. While we encourage in-person attendance in Singapore for networking, remote presentation options are available for accepted authors.
                    </p>
                </article>
                <article className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Is there a registration fee for authors?</h3>
                    <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                        Yes, at least one author of each accepted paper must register for the conference to be included in the proceedings and the presentation schedule.
                    </p>
                </article>
            </div>
        </section>
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <CallForPapersClient faqSection={faqSection} importantDates={importantDates} />
        </>
    );
}

