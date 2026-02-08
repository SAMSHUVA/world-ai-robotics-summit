import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | WARS 2026",
    description: "Privacy policy for WARS 2026 and IAISR conference services.",
    alternates: {
        canonical: "https://wars2026.iaisr.info/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px", maxWidth: "900px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Privacy Policy</h1>
            <p style={{ opacity: 0.7, marginBottom: "40px" }}>Last updated: February 8, 2026</p>

            <div className="glass-card" style={{ padding: "40px" }}>
                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>1. Information We Collect</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        We collect details required for conference participation, including contact information, registration
                        details, payment status metadata, and communication preferences.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>2. How We Use Information</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        Data is used to deliver registration services, issue conference communications, provide support,
                        and improve event operations.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>3. Data Sharing</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        We do not sell personal data. We may share limited data with processors that support payment,
                        communication, and hosting under contractual safeguards.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>4. Data Retention</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        We retain personal data only as long as necessary for legal, operational, and academic recordkeeping requirements.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>5. Your Rights</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        You may request access, correction, or deletion of your personal information by contacting our support team.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "var(--primary)" }}>6. Contact</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        Email: <a href="mailto:info@iaisr.com" style={{ color: "var(--primary)" }}>info@iaisr.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
