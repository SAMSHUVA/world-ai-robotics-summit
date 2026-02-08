import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Register | World AI & Robotics Summit 2026',
    description: 'Secure your spot at WARS 2026. Join global leaders in AI and Robotics at Marina Bay Sands, Singapore. Early bird tickets available now.',
    alternates: {
        canonical: 'https://wars2026.iaisr.info/register'
    },
    openGraph: {
        title: 'Register for WARS 2026',
        description: 'Secure your spot at the World AI & Robotics Summit 2026. Join global experts in Singapore.',
        url: 'https://wars2026.iaisr.info/register',
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

