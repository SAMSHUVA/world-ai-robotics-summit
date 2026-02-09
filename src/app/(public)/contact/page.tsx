import type { Metadata } from "next";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";
import ContactClient from "./ContactClient";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Contact | ${settings.fullName}`,
        description: `Contact the ${settings.fullName} organizing team for registration support, sponsorships, and conference inquiries.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/contact`,
        },
        openGraph: {
            title: `Contact ${settings.fullName}`,
            description: `Reach the ${settings.fullName} organizing team.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/contact`,
            siteName: `${settings.name} ${settings.year}`,
            type: "website",
        },
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();
    return <ContactClient settings={settings} />;
}
