import type { Metadata } from "next";
import SpeakersPageContent from "@/components/SpeakersPageContent";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: "Speakers | WARS 2026",
    description: "Meet keynote speakers and featured experts at the World AI & Robotics Summit 2026 in Singapore.",
    alternates: {
        canonical: "https://wars2026.iaisr.info/speakers",
    },
    openGraph: {
        title: "WARS 2026 Speakers",
        description: "Explore the expert speaker lineup for WARS 2026.",
        url: "https://wars2026.iaisr.info/speakers",
        siteName: "WARS 2026",
        type: "website",
    },
};

export default function SpeakersPage() {
    return (
        <main>
            <SpeakersPageContent />
        </main>
    );
}
