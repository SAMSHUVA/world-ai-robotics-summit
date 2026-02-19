
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientThemeWrapper from '@/components/ClientThemeWrapper';
import StyledJsxRegistry from '@/lib/StyledJsxRegistry';
import { CONFERENCE_CONFIG } from '@/config/conference';
import { getSiteSettings } from "@/config/settings";

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        metadataBase: new URL(CONFERENCE_CONFIG.urls.canonical),
        title: {
            default: `${settings.name} ${settings.year} | ${settings.fullName}`,
            template: `%s | ${settings.name} ${settings.year}`
        },
        description: `The 7th International Conference on AI and Robotics, hosted by IAISR in ${settings.location}. Join global researchers and innovators in ${settings.year}.`,
        keywords: [`AI Conference ${settings.year}`, `${settings.name} Summit ${settings.location}`, "IAISR", "Artificial Intelligence Research", "Robotics Innovation", settings.fullName, `${settings.name} ${settings.year}`],
        authors: [{ name: "IAISR Team" }],
        creator: "IAISR",
        publisher: "IAISR",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title: `${settings.name} ${settings.year} | ${settings.fullName}`,
            description: `Join the 7th Annual Global Gathering of AI and Robotics experts in ${settings.location}.`,
            url: CONFERENCE_CONFIG.urls.canonical,
            siteName: settings.fullName,
            images: [
                {
                    url: "/Iaisr%20Logo.webp",
                    width: 800,
                    height: 600,
                    alt: `${settings.name} ${settings.year} Logo`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${settings.name} ${settings.year} | ${settings.fullName}`,
            description: `The premier global conference for AI and Robotics innovators in ${settings.location}, ${settings.year}.`,
            images: ["/Iaisr%20Logo.webp"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Preload critical fonts */}
                <link
                    rel="preload"
                    href="/_next/static/media/8e9860b6e62d6359-s.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                {/* Prevent flash of unstyled content */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const theme = localStorage.getItem('conference-theme') || 
                                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                                document.documentElement.setAttribute('data-theme', theme);
                            })();
                        `,
                    }}
                />
            </head>
            <body className={inter.className}>
                <StyledJsxRegistry>
                    <ClientThemeWrapper>
                        {children}
                    </ClientThemeWrapper>
                </StyledJsxRegistry>
            </body>
        </html>
    );
}
