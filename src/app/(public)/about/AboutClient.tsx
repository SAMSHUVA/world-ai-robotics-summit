"use client";
import "./about.css";

interface AboutClientProps {
    settings: {
        name: string;
        shortName: string;
        year: string;
        fullName: string;
        location: string;
        venue: string;
        tagline: string;
        theme: string;
        social: {
            whatsapp: string;
            email: string;
        };
        urls: {
            canonical: string;
        };
    };
}

const pillars = [
    {
        title: "Scientific Rigor",
        description: "Peer-reviewed tracks, qualified program committees, and transparent selection standards.",
    },
    {
        title: "Global Collaboration",
        description: "A multidisciplinary network across academia, industry, and policy ecosystems.",
    },
    {
        title: "Responsible Innovation",
        description: "Research translation that prioritizes ethics, safety, and human-centered outcomes.",
    },
];

const impact = [
    "International conference programs across AI, robotics, and emerging technologies.",
    "Cross-border researcher and institutional partnerships through IAISR networks.",
    "Publication pathways, mentorship, and visibility for early and mid-career researchers.",
];

export default function AboutClient({ settings }: AboutClientProps) {
    const orgJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "International Association for Innovation and Scientific Research (IAISR)",
        url: "https://iaisr.com",
        logo: "https://wars2026.iaisr.info/logo.png",
        sameAs: [
            "https://www.linkedin.com/in/iaisr",
            "https://www.facebook.com/iaisrglobal",
            "https://www.instagram.com/iaisrmeetings/",
        ],
    };

    return (
        <div className="about-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
            />

            <section className="about-hero container">
                <div className="hero-grid">
                    <div>
                        <p className="eyebrow neural-drift" style={{ '--delay': '0s' } as React.CSSProperties}>About IAISR</p>
                        <h1 className="hero-title neural-drift" style={{ '--delay': '0.1s' } as React.CSSProperties}>Building the Research Ecosystem Behind {settings.name} {settings.year}</h1>
                        <p className="hero-copy neural-drift" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                            IAISR supports a global community of researchers, educators, and practitioners.
                            {settings.shortName} is one of our flagship forums designed to connect frontier science
                            with real-world deployment in AI and robotics.
                        </p>
                        <div className="hero-actions neural-drift" style={{ '--delay': '0.3s' } as React.CSSProperties}>
                            <a href="/register" className="btn btn-primary-glow">Join {settings.name} {settings.year}</a>
                            <a href="/call-for-papers" className="btn btn-secondary-minimal">Submit a Paper</a>
                        </div>
                    </div>

                    <div className="signal-card">
                        <div className="signal-grid" />
                        <div className="signal-content">
                            <p className="signal-label">Focus {settings.year}</p>
                            <h2>AI Systems, Robotics, and Ethical Deployment</h2>
                            <p>From foundational models to applied autonomy, IAISR programs align research depth with practical impact.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container about-section">
                <h2>Core Pillars</h2>
                <div className="pillars-grid">
                    {pillars.map((item) => (
                        <article key={item.title} className="pillar-card">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="container about-section">
                <div className="impact-wrap">
                    <div>
                        <p className="eyebrow">Institutional Impact</p>
                        <h2>Research Programs with Measurable Outcomes</h2>
                        <p>
                            IAISR initiatives are designed to strengthen research quality, collaboration, and
                            dissemination through structured conference ecosystems and expert communities.
                        </p>
                    </div>
                    <div className="impact-list">
                        {impact.map((item) => (
                            <div key={item} className="impact-item">{item}</div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container about-cta">
                <h2>Partner with IAISR at {settings.name} {settings.year}</h2>
                <p>
                    Collaborate through speaking, sponsorship, academic partnerships, or technical workshops.
                </p>
                <a href="/contact" className="btn">Contact Organizers</a>
            </section>
        </div>
    );
}
