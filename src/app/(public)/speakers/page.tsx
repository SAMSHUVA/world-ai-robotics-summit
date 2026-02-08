import type { Metadata } from "next";
import SpeakersPageContent from "@/components/SpeakersPageContent";
import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Speakers | ${settings.name} ${settings.year}`,
        description: `Meet keynote speakers and featured experts at the ${settings.fullName} in ${settings.location}.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/speakers`,
        },
        openGraph: {
            title: `${settings.name} ${settings.year} Speakers`,
            description: `Explore the expert speaker lineup for ${settings.name} ${settings.year}.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/speakers`,
            siteName: settings.fullName,
            type: "website",
        },
    };
}

export default async function SpeakersPage() {
    let speakers: any[] = [];
    try {
        speakers = await (prisma as any).speaker.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
    } catch (e) {
        console.error("SpeakersPage: Failed to fetch speakers", e);
    }

    return (
        <main>
            <SpeakersPageContent initialSpeakers={speakers} />
        </main>
    );
}
