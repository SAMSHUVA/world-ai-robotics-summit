import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `About IAISR & ${settings.name} ${settings.year}`,
        description: `Learn about IAISR, the organization behind ${settings.fullName}, and our mission to advance responsible AI and robotics research worldwide.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/about`,
        },
        openGraph: {
            title: `About ${settings.name} ${settings.year}`,
            description: `The story, mission, and impact behind IAISR and ${settings.fullName}.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/about`,
            siteName: `${settings.name} ${settings.year}`,
            type: "website",
        },
    };
}

export default async function AboutPage() {
    const settings = await getSiteSettings();
    return <AboutClient settings={settings} />;
}
