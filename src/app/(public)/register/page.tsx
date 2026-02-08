import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';
import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from '@/config/conference';
import { getSiteSettings } from "@/config/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Register | ${settings.fullName}`,
        description: `Secure your spot at ${settings.name} ${settings.year}. Join global leaders in AI and Robotics at ${settings.venue}, ${settings.location}. Early bird tickets available now.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/register`
        },
        openGraph: {
            title: `Register for ${settings.name} ${settings.year}`,
            description: `Secure your spot at the ${settings.fullName}. Join global experts in ${settings.location}.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/register`,
            siteName: `${settings.name} ${settings.year}`,
            type: 'website',
        }
    };
}

export default async function RegisterPage() {
    let conferenceDate: any = null;
    try {
        conferenceDate = await (prisma as any).importantDate.findFirst({
            where: {
                event: { contains: 'Conference', mode: 'insensitive' },
                isActive: true
            }
        });
    } catch (e) {
        console.error("RegisterPage: Failed to fetch conference date", e);
    }

    return <RegisterClient conferenceDate={conferenceDate?.date} />;
}

