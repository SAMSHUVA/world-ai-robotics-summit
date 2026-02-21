
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
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
        description: `The premier AgTech Transformation Summit, hosted by IAISR in ${settings.location}. Join global agricultural researchers and innovators in ${settings.year}.`,
        keywords: [`AgTech Conference ${settings.year}`, `${settings.name} Summit ${settings.location}`, "IAISR", "Agricultural Technology", "Farming Innovation", settings.fullName, `${settings.name} ${settings.year}`],
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
            description: `Join the premier gathering of AgTech and farming innovation experts in ${settings.location}.`,
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
            description: `The premier global conference for AgTech innovators in ${settings.location}, ${settings.year}.`,
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
        verification: {
            google: 'ZdL8stzsycrhCLzbK2TPFi2XUkevjtXhWmD5unoGnB8',
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

                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-V3MK06BQ96"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-V3MK06BQ96');
                    `}
                </Script>
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
