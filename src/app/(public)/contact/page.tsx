import type { Metadata } from "next";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Contact | ${settings.name} ${settings.year}`,
        description: `Contact the ${settings.name} ${settings.year} organizing team for registration support, sponsorships, and conference inquiries.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/contact`,
        },
        openGraph: {
            title: `Contact ${settings.name} ${settings.year}`,
            description: `Reach the ${settings.fullName} organizing team.`,
            url: `${CONFERENCE_CONFIG.urls.canonical}/contact`,
            siteName: `${settings.name} ${settings.year}`,
            type: "website",
        },
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();
    return (
        <div className="container grid-2" style={{ padding: "80px 20px" }}>
            <div>
                <h1 className="neural-drift" style={{ fontSize: "3rem", marginBottom: "24px", "--delay": "0s" } as React.CSSProperties}>Get in Touch</h1>
                <p className="neural-drift" style={{ opacity: 0.8, fontSize: "1.1rem", marginBottom: "40px", "--delay": "0.1s" } as React.CSSProperties}>
                    Have questions about registration, paper submission, sponsorships, or visa support? The {settings.name} team can help.
                </p>

                <div className="neural-drift" style={{ display: "grid", gap: "30px", "--delay": "0.2s" } as React.CSSProperties}>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>Conference Venue</h3>
                        <p style={{ opacity: 0.6 }}>
                            {settings.venue}
                            <br />
                            {settings.location}
                        </p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>Email</h3>
                        <p style={{ opacity: 0.6 }}>
                            {settings.social.email}
                        </p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: "8px" }}>WhatsApp</h3>
                        <p style={{ opacity: 0.6 }}>{settings.social.whatsapp}</p>
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
