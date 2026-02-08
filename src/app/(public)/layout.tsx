import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main style={{ paddingTop: "var(--header-height)", minHeight: "100vh" }}>
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
                            <a href="https://linkedin.com/in/iaisr" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" style={{ width: 24, height: 24 }} />
                            </a>
                            <a href="https://www.facebook.com/iaisrglobal" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: 24, height: 24 }} />
                            </a>
                            <a href="https://www.instagram.com/iaisrmeetings/" target="_blank" rel="noopener noreferrer" className="social-icon">
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
                            <p>IAISR Head Office, Chennai, India</p>
                            <p>info@iaisr.com</p>
                            <p>+91 87540 57375 (WhatsApp)</p>
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
                        <p>Copyright 2026 International Association for Innovation and Scientific Research (IAISR). All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <ScrollToTop />
        </>
    );
}
