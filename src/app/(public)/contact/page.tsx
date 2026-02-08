import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | WARS 2026",
    description: "Contact the WARS 2026 organizing team for registration support, sponsorships, and conference inquiries.",
    alternates: {
        canonical: "https://wars2026.iaisr.info/contact",
    },
    openGraph: {
        title: "Contact WARS 2026",
        description: "Reach the World AI & Robotics Summit organizing team.",
        url: "https://wars2026.iaisr.info/contact",
        siteName: "WARS 2026",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <div className="container grid-2" style={{ padding: "80px 20px" }}>
            <div>
                <h1 className="neural-drift" style={{ fontSize: "3rem", marginBottom: "24px", "--delay": "0s" } as React.CSSProperties}>Get in Touch</h1>
                <p className="neural-drift" style={{ opacity: 0.8, fontSize: "1.1rem", marginBottom: "40px", "--delay": "0.1s" } as React.CSSProperties}>
                    Have questions about registration, paper submission, sponsorships, or visa support? The WARS team can help.
                </p>

                <div className="neural-drift" style={{ display: "grid", gap: "30px", "--delay": "0.2s" } as React.CSSProperties}>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>Conference Venue</h3>
                        <p style={{ opacity: 0.6 }}>
                            Marina Bay Sands Convention Centre
                            <br />
                            10 Bayfront Avenue
                            <br />
                            Singapore 018956
                        </p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>Email</h3>
                        <p style={{ opacity: 0.6 }}>
                            info@iaisr.com
                            <br />
                            support@iaisr.com
                        </p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>WhatsApp</h3>
                        <p style={{ opacity: 0.6 }}>+91 87540 57375</p>
                    </div>
                </div>
            </div>

            <div className="glass-card neural-drift" style={{ "--delay": "0.3s" } as React.CSSProperties}>
                <h2 style={{ marginBottom: "24px" }}>Send Us a Message</h2>
                <form style={{ display: "grid", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px" }}>Name</label>
                        <input
                            type="text"
                            style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
                        <input
                            type="email"
                            style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px" }}>Message</label>
                        <textarea
                            rows={5}
                            style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "white" }}
                        />
                    </div>
                    <button type="submit" className="btn">Send Message</button>
                </form>
            </div>
        </div>
    );
}
