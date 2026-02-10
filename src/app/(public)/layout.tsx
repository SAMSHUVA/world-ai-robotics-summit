import { Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";
import dynamic from 'next/dynamic';

const MobileDock = dynamic(() => import("@/components/MobileDock"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"));

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSiteSettings();

    // Fetch important dates for the "Smart Badge" in Header
    let abstractDeadline = "March 15, 2026"; // Fallback
    try {
        const importantDates = await (prisma as any).importantDate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }) || [];
        const abstractDate = importantDates.find((d: any) => d.event.toLowerCase().includes('abstract'));
        if (abstractDate) {
            abstractDeadline = new Date(abstractDate.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    } catch (e) {
        console.error("PublicLayout: Failed to fetch dates", e);
    }

    return (
        <>
            <Header settings={settings} abstractDeadline={abstractDeadline} />
            <main style={{ paddingTop: "var(--header-height)", minHeight: "100vh" }}>
                {children}
            </main>
            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-col brand-col">
                        <Image
                            src="/Iaisr%20Logo.webp"
                            alt="IAISR Logo"
                            className="footer-logo"
                            width={150}
                            height={50}
                            style={{ height: 'auto', width: 'auto' }}
                        />
                        <p className="footer-about">
                            Empowering the global research community through high-impact academic conferences and scientific innovation.
                        </p>
                        <div className="social-links">
                            <a href="https://linkedin.com/in/iaisr" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Linkedin size={22} strokeWidth={1.5} />
                            </a>
                            <a href="https://www.facebook.com/iaisrglobal" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Facebook size={22} strokeWidth={1.5} />
                            </a>
                            <a href="https://www.instagram.com/iaisrmeetings/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Instagram size={22} strokeWidth={1.5} />
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
                            <p>IAISR Head Office, Chennai, India</p>
                            <p>
                                <a href={`mailto:${settings.social.email}`} style={{ color: "inherit", textDecoration: "none" }}>{settings.social.email}</a>
                            </p>
                            <p>
                                <a href={settings.social.whatsapp.startsWith('http') ? settings.social.whatsapp : `https://wa.me/${settings.social.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                                    {settings.social.whatsapp.includes('wa.me/') ? settings.social.whatsapp.split('wa.me/')[1].split('?')[0] :
                                        settings.social.whatsapp.includes('chat.whatsapp.com') ? "Join Community" :
                                            settings.social.whatsapp.replace('https://', '')} (WhatsApp)
                                </a>
                            </p>
                            <p style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(91, 77, 255, 0.1)", borderRadius: "4px", fontSize: "0.85rem" }}>
                                24-hour support response time
                            </p>
                        </div>
                        <div className="contact-actions" style={{ marginTop: "20px" }}>
                            <a href="/register" className="btn btn-mini">Register Now</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul className="footer-links">
                            <li><a href="/terms">Terms & Conditions</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="container">
                        <p>Copyright {settings.year} International Association for Innovation and Scientific Research (IAISR). All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <ScrollToTop />
            <MobileDock />
        </>
    );
}
