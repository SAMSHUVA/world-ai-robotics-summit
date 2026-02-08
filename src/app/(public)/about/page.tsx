import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About IAISR & WARS 2026",
    description: "Learn about IAISR, the organization behind WARS 2026, and our mission to advance responsible AI and robotics research worldwide.",
    alternates: {
        canonical: "https://wars2026.iaisr.info/about",
    },
    openGraph: {
        title: "About WARS 2026",
        description: "The story, mission, and impact behind IAISR and WARS 2026.",
        url: "https://wars2026.iaisr.info/about",
        siteName: "WARS 2026",
        type: "website",
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
