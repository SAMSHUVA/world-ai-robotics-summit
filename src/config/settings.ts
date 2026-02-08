import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from "./conference";

export async function getSiteSettings() {
    try {
        const settings = await prisma.globalSetting.findMany();
        const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return {
            name: settingsMap.shortName || CONFERENCE_CONFIG.name,
            year: settingsMap.year || CONFERENCE_CONFIG.year,
            fullName: settingsMap.fullName || CONFERENCE_CONFIG.fullName,
            location: settingsMap.location || CONFERENCE_CONFIG.location,
            venue: settingsMap.venue || CONFERENCE_CONFIG.venue,
            tagline: settingsMap.tagline || CONFERENCE_CONFIG.tagline,
            theme: settingsMap.theme || CONFERENCE_CONFIG.theme,
            social: {
                whatsapp: settingsMap.whatsapp || CONFERENCE_CONFIG.social.whatsapp,
                email: settingsMap.email || CONFERENCE_CONFIG.social.email,
            },
            urls: CONFERENCE_CONFIG.urls
        };
    } catch (error) {
        console.error("getSiteSettings Error:", error);
        return {
            ...CONFERENCE_CONFIG,
            social: {
                whatsapp: CONFERENCE_CONFIG.social.whatsapp,
                email: CONFERENCE_CONFIG.social.email
            }
        };
    }
}
