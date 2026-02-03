import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';
import Header from '@/components/Header';

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
            </head>
            <body className={inter.className}>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh' }}>
                    {children}
                </main>
                <footer className="main-footer">
                    <div className="container footer-grid">
                        <div className="footer-col brand-col">
                            <img src="/logo.png" alt="IAISR Logo" className="footer-logo" />
                            <p className="footer-about">
                                Empowering the global research community through high-impact academic conferences and scientific innovation.
                            </p>
                            <div className="social-links">
                                <a href="https://linkedin.com/in/iaisr" target="_blank" className="social-icon">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" style={{ width: 24, height: 24 }} />
                                </a>
                                <a href="https://www.facebook.com/iaisrglobal" target="_blank" className="social-icon">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: 24, height: 24 }} />
                                </a>
                                <a href="https://www.instagram.com/iaisrmeetings/" target="_blank" className="social-icon">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{ width: 24, height: 24 }} />
                                </a>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h4>Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/call-for-papers">Submissions</a></li>
                                <li><a href="/speakers">Speakers</a></li>
                                <li><a href="/sessions">Schedule</a></li>
                                <li><a href="/about">About Us</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>Contact Us</h4>
                            <div className="contact-details">
                                <p>📍 IAISR Head Office, Chennai, India</p>
                                <p>📧 info@iaisr.com</p>
                                <p>💬 +91 87540 57375 (WhatsApp)</p>
                            </div>
                            <div className="contact-actions" style={{ marginTop: '20px' }}>
                                <a href="/register" className="btn btn-mini">Register Now</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="container">
                            <p>© 2026 International Association for Innovation and Scientific Research (IAISR). All rights reserved.</p>
                        </div>
                    </div>
                </footer>
                <ScrollToTop />
            </body>
        </html>
    );
}
