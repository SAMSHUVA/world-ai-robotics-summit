import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "WARS 2026 | World AI & Robotics Summit",
    description: "The 7th International Conference on AI and Robotics, hosted by IAISR in Singapore.",
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
                {/* We can import google fonts via next/font above, which is optimized */}
            </head>
            <body className={inter.className}>
                <header className="header-fixed">
                    <div className="top-bar">
                        <div className="container top-bar-content">
                            <div className="top-bar-info">
                                <span>📍 Marina Bay Sands, Singapore</span>
                                <a href="https://wa.me/1234567890" target="_blank" className="whatsapp-link">💬 Support</a>
                            </div>
                            <div className="top-bar-actions">
                                <a href="/register" className="top-register-btn">Register</a>
                            </div>
                        </div>
                    </div>
                    <div className="main-header glass-card">
                        <div className="container header-content">
                            <a href="/" className="logo-container">
                                <img src="/logo.png" alt="IAISR Logo" className="header-logo" />
                            </a>
                            <nav className="nav-links">
                                <a href="/">Home</a>
                                <a href="/call-for-papers">Submissions</a>
                                <a href="/speakers">Speakers</a>
                                <a href="/sessions">Schedule</a>
                                <a href="/about">About</a>
                            </nav>
                            <a href="/register" className="btn btn-header">Register Now →</a>
                        </div>
                    </div>
                    {/* Horizontal Scroll Nav for Mobile */}
                    <div className="mobile-scroll-nav">
                        <div className="container scroll-nav-container">
                            <a href="/" className="scroll-nav-link active">Home</a>
                            <a href="/call-for-papers" className="scroll-nav-link">Papers</a>
                            <a href="/speakers" className="scroll-nav-link">Speakers</a>
                            <a href="/sessions" className="scroll-nav-link">Schedule</a>
                            <a href="/about" className="scroll-nav-link">About</a>
                        </div>
                    </div>
                </header>
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
                                <a href="#" className="social-icon">IN</a>
                                <a href="#" className="social-icon">TW</a>
                                <a href="#" className="social-icon">FB</a>
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
                                <p>📍 IAISR Headquarters, New Delhi, India</p>
                                <p>📧 contact@iaisr.org</p>
                                <p>💬 +91 123 456 7890 (WhatsApp)</p>
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
