
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientThemeWrapper from '@/components/ClientThemeWrapper';
import StyledJsxRegistry from '@/lib/StyledJsxRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://wars2026.iaisr.info'),
    title: {
        default: "WARS 2026 | World AI & Robotics Summit",
        template: "%s | WARS 2026"
    },
    description: "The 7th International Conference on AI and Robotics, hosted by IAISR in Singapore. Join global researchers and innovators in 2026.",
    keywords: ["AI Conference 2026", "Robotics Summit Singapore", "IAISR", "Artificial Intelligence Research", "Robotics Innovation", "World AI & Robotics Summit", "WARS 2026"],
    authors: [{ name: "IAISR Team" }],
    creator: "IAISR",
    publisher: "IAISR",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "WARS 2026 | World AI & Robotics Summit",
        description: "Join the 7th Annual Global Gathering of AI and Robotics experts in Singapore.",
        url: "https://wars2026.iaisr.info",
        siteName: "World AI & Robotics Summit",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
                alt: "WARS 2026 Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "WARS 2026 | World AI & Robotics Summit",
        description: "The premier global conference for AI and Robotics innovators in Singapore, 2026.",
        images: ["/logo.png"],
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Prevent flash of unstyled content */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const theme = localStorage.getItem('wars-theme') || 
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
