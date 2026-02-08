import Link from "next/link";
import prisma from "@/lib/prisma";
import AwardsModal from "@/components/AwardsModal";
import ResourcesSection from "@/components/ResourcesSection";
import HeroInquiryForm from "@/components/HeroInquiryForm";
import ImportantDates from "@/components/ImportantDates";
import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";

import Reveal from "@/components/Reveal";
import AIPromptTerminal from '@/components/AIPromptTerminal';
import IAISRSection from '@/components/IAISRSection';

export const dynamic = 'force-dynamic';

import { BackgroundGradientAnimation } from "@/components/BackgroundGradient";

export default async function Home() {
    // Fetch Data with error handling for production stability
    let speakers = [];
    let committee = [];
    let importantDates = [];
    let testimonials = [];

    try {
        speakers = await (prisma.speaker as any).findMany({
            where: { type: 'KEYNOTE' },
            orderBy: { displayOrder: 'asc' }
        }) || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch speakers", e);
    }

    try {
        committee = await (prisma as any).committeeMember.findMany({
            orderBy: { displayOrder: 'asc' }
        }) || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch committee", e);
    }

    try {
        importantDates = await (prisma as any).importantDate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }) || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch dates", e);
    }

    try {
        testimonials = await (prisma as any).testimonial.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }) || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch testimonials", e);
    }

    return (
        <div style={{ position: 'relative', background: 'transparent' }}>
            {/* Full Page Background Animation - Stacked correctly to be visible */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
                <BackgroundGradientAnimation
                    interactive={true}
                    containerClassName="h-full w-full"
                />
            </div>

            <div style={{ paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
                {/* Hero Section - Fully transparent to show the animation */}
                <section className="hero-section" style={{ background: 'transparent', border: 'none' }}>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: [
                                JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Event",
                                    "name": "World AI & Robotics Summit 2026",
                                    "startDate": "2026-05-22",
                                    "endDate": "2026-05-24",
                                    "eventStatus": "https://schema.org/EventScheduled",
                                    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                                    "location": {
                                        "@type": "Place",
                                        "name": "Marina Bay Sands",
                                        "address": {
                                            "@type": "PostalAddress",
                                            "streetAddress": "10 Bayfront Ave",
                                            "addressLocality": "Singapore",
                                            "postalCode": "018956",
                                            "addressCountry": "SG"
                                        }
                                    },
                                    "image": [
                                        "https://wars2026.iaisr.info/logo.png",
                                        "https://wars2026.iaisr.info/about_image.png"
                                    ],
                                    "description": "The 7th International Conference on AI and Robotics, hosted by IAISR. Join global researchers and innovators to bridge the gap between intelligent systems and human innovation.",
                                    "organizer": {
                                        "@type": "Organization",
                                        "name": "IAISR",
                                        "url": "https://iaisr.info"
                                    }
                                }),
                                // WebSite Schema
                                JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "WebSite",
                                    "name": "World AI & Robotics Summit 2026",
                                    "url": "https://wars2026.iaisr.info",
                                    "potentialAction": {
                                        "@type": "SearchAction",
                                        "target": "https://wars2026.iaisr.info/speakers?q={search_term_string}",
                                        "query-input": "required name=search_term_string"
                                    }
                                })
                            ].join('\n')
                        }}
                    />
                    <div className="container hero-grid">
                        <div className="hero-content-left">
                            <div className="hero-title-container">
                                <h1 className="hero-main-title" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span className="hero-line neural-drift" style={{ '--delay': '0s', display: 'block', fontSize: 'clamp(3rem, 6vw, 5rem)' } as React.CSSProperties}>World AI</span>
                                    <span className="hero-line neural-drift" style={{ '--delay': '0.2s', display: 'block', fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}>&</span>
                                    <span className="hero-line neural-drift" style={{ '--delay': '0.4s', display: 'block' } as React.CSSProperties}>
                                        <span className="title-gradient aura-text">Robotics Summit 2026</span>
                                    </span>
                                </h1>
                            </div>
                            <Reveal animation="reveal-left" delay={200}>
                                <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '40px' }}>
                                    Bridging Intelligent Systems and Human Innovation. Join us in <b>Singapore</b> for the 7th Annual Global Gathering.
                                </p>
                            </Reveal>
                            <Reveal animation="reveal-left" delay={400}>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-btns">
                                    <Link href="/register" className="btn btn-primary-glow" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Explore Tickets</Link>
                                    <Link href="/call-for-papers" className="btn btn-secondary-minimal" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>Submit Abstract</Link>
                                </div>
                            </Reveal>
                        </div>

                        {/* Quick Contact Form - Client Component */}
                        <Reveal animation="reveal" delay={300}>
                            <div className="glass-card hero-form-card" style={{ padding: '32px', textAlign: 'left' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Get Conference Updates</h3>
                                <HeroInquiryForm />
                            </div>
                        </Reveal>
                    </div>
                </section>


                {/* Important Dates */}
                <Reveal threshold={0.2}>
                    <ImportantDates dates={importantDates} />
                </Reveal>

                {/* AI Simulator Section (Moved & Refined) */}
                <section className="section-margin">
                    <div className="container" style={{ position: 'relative' }}>
                        <div className="neural-drift" style={{ '--delay': '0.1s' } as React.CSSProperties}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The <span className="title-gradient">Future</span> of Summit Intelligence</h2>
                                <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                                    WARS '26 leverages advanced cognitive systems to redefine the academic gathering. Experience our vision for the summit of tomorrow.
                                </p>
                            </div>
                            <AIPromptTerminal />
                        </div>
                        {/* Background Glow */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            height: '80%',
                            background: 'radial-gradient(circle, rgba(91, 77, 255, 0.15) 0%, transparent 70%)',
                            zIndex: -1,
                            filter: 'blur(100px)'
                        }}></div>
                    </div>
                </section>

                <Reveal threshold={0.2}>
                    <ResourcesSection />
                </Reveal>

                {/* Organized By IAISR - Premium Transition */}
                <IAISRSection />

                {/* Keynote Speakers */}
                <section className="container section-margin">
                    <Reveal animation="reveal-fade">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Keynote Speakers</h2>
                    </Reveal>
                    <div className="speaker-grid">
                        {speakers.map((speaker: any, idx: number) => (
                            <Reveal key={idx} animation="reveal" index={idx} stagger={100} threshold={0.1}>
                                <div className="glass-card speaker-card">
                                    <img src={speaker.photoUrl || '/logo.png'} alt={speaker.name} className="speaker-image" style={{ objectFit: 'cover' }} />
                                    <div className="speaker-info">
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{speaker.name}</h3>
                                        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{speaker.role}</div>
                                        <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>{speaker.affiliation}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                        {speakers.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Speakers to be announced.</p>}
                    </div>
                </section>

                {/* Conference Committee */}
                <section className="container section-margin">
                    <Reveal animation="reveal-fade">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Conference Committee</h2>
                    </Reveal>
                    <div className="committee-grid">
                        {committee.map((member: any, i: number) => (
                            <Reveal key={i} animation="reveal" index={i % 4} stagger={100} threshold={0.1}>
                                <div className="glass-card committee-card">
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                        {member.photoUrl ? <img src={member.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>{member.name}</h4>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{member.role}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                        {committee.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Committee members to be announced.</p>}
                    </div>
                </section>

                {/* Premium About Section */}
                <section className="container section-margin about-grid">
                    <div className="neural-drift" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                        <div className="floating-glass-box">
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Intelligence Redefined</span>
                            <h2 style={{ fontSize: '3rem', marginTop: '10px', marginBottom: '24px', letterSpacing: '-0.02em', fontWeight: '800' }}>
                                The Nexus of <span className="title-gradient">Human & Machine</span>
                            </h2>
                            <p style={{ lineHeight: 1.8, opacity: 0.8, marginBottom: '32px', fontSize: '1.1rem' }}>
                                WARS '26 isn't just a summit—it's the world's most sophisticated launchpad for autonomous systems and cognitive computing. We gather the architects of the future at Marina Bay Sands to bridge the gap between abstract theory and planetary-scale deployment.
                            </p>

                            <div className="feature-cards-container">
                                {[
                                    { title: 'Global Network', icon: '🌐', desc: '1,200+ delegates' },
                                    { title: 'Core Keynotes', icon: '💎', desc: 'Industry titans' },
                                    { title: 'Deep Workshops', icon: '⚡', desc: 'AI architectures' },
                                    { title: 'Research Tracks', icon: '🔮', desc: '15+ focus areas' }
                                ].map((item, idx) => (
                                    <div key={idx} className="about-feature-card">
                                        <span className="about-feature-icon">{item.icon}</span>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', fontWeight: '700' }}>{item.title}</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0, lineHeight: '1.3' }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="about-image-wrapper" style={{
                        minHeight: '400px',
                        height: '550px',
                        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                        border: '1px solid rgba(91, 77, 255, 0.3)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Animated gradient orbs */}
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left: '20%',
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(91, 77, 255, 0.3) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)',
                            animation: 'float 8s ease-in-out infinite'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            bottom: '20%',
                            right: '20%',
                            width: '250px',
                            height: '250px',
                            background: 'radial-gradient(circle, rgba(255, 59, 138, 0.3) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)',
                            animation: 'float 10s ease-in-out infinite reverse'
                        }}></div>
                        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 5, background: 'rgba(13, 11, 30, 0.8)', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6 }}>Theme</div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Neural Fusion '26</div>
                        </div>
                    </div>
                </section>

                {/* SDG Impact & Sustainability Section */}
                <section className="container section-margin sdg-impact-section">
                    <Reveal animation="reveal-fade" threshold={0.2}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>UN 2030 Agenda</span>
                            <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>SDG Impact & <span style={{ color: 'var(--primary)' }}>Sustainability</span></h2>
                            <p style={{ opacity: 0.7, maxWidth: '600px', margin: '15px auto 0', lineHeight: 1.6 }}>
                                Harnessing Artificial Intelligence as a catalyst for the UN Sustainable Development Goals through rigorous research, ethical innovation, and net-zero event practices.
                            </p>
                        </div>
                    </Reveal>

                    <div className="sdg-impact-grid">
                        {[
                            { id: 4, label: 'Quality Education', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Sustainable_Development_Goal_4.png', color: '#C5192D', desc: 'Promoting AI literacy through workshops and providing inclusive access to research databases.', alignment: 85 },
                            { id: 9, label: 'Industry & Innovation', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Sustainable_Development_Goal_9.png', color: '#F36E25', desc: 'Accelerating digital transformation via cutting-edge AI architecture and ethical deployment frameworks.', alignment: 92 },
                            { id: 11, label: 'Sustainable Cities', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Sustainable_Development_Goal_11.png', color: '#FD9D24', desc: 'Optimizing urban living through AI-driven traffic management, waste reduction planning, and energy-efficient building models.', alignment: 78 },
                            { id: 13, label: 'Climate Action', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Sustainable_Development_Goal_13.png', color: '#3F7E44', desc: 'Research into carbon-efficient computing and AI systems designed specifically for climate modeling and adaptation strategies.', alignment: 88 },
                            { id: 17, label: 'Partnerships for Goals', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Sustainable_Development_Goal_17.png', color: '#19486A', desc: 'Building a global network of academic, industrial, and government bodies to share open-source AI tools and sustainability data.', alignment: 100 },
                            { id: 'Ethics', label: 'Responsible AI', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Sustainable_Development_Goal_16.png', color: '#4B2C82', desc: 'A mandatory framework for all conference submissions ensuring research adheres to global ethical standards.', alignment: 100 },
                        ].map((sdg, i) => (
                            <Reveal key={i} animation="reveal" index={i % 3} stagger={150}>
                                <div className="impact-card" style={{ borderTop: `4px solid ${sdg.color}` }}>
                                    <div className="impact-header">
                                        <div className="impact-icon-box" style={{ background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                            <img src={sdg.icon} alt={sdg.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div className="impact-meta">
                                            <h4 className="impact-title">{sdg.label}</h4>
                                            <span className="impact-goal">Goal {sdg.id}</span>
                                        </div>
                                    </div>
                                    <p className="impact-desc">{sdg.desc}</p>
                                    <div className="impact-progress-container">
                                        <div className="impact-progress-bar" style={{ background: sdg.color, width: `${sdg.alignment}%`, '--progress': `${sdg.alignment}%` } as any}></div>
                                    </div>
                                    <div className="impact-footer">
                                        <span>Alignment Score</span>
                                        <span style={{ fontWeight: 'bold' }}>{sdg.alignment}%</span>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Awards Section (New) */}
                <section className="container section-margin" style={{ textAlign: 'center' }}>
                    <Reveal animation="reveal" threshold={0.4}>
                        <div className="glass-card" style={{ background: 'linear-gradient(rgba(13, 11, 30, 0.8), rgba(13, 11, 30, 0.8)), url(/about_image.png)', backgroundSize: 'cover', padding: '60px 20px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Excellence Awards</h2>
                            <p style={{ marginBottom: '30px', opacity: 0.9 }}>Nominations are now open for Best Paper, Young Researcher, and Innovation Excellence awards.</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                                {['🥇 Best Paper', '🥈 Young Researcher', '🥉 Innovation'].map(award => (
                                    <div key={award} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>{award}</div>
                                ))}
                            </div>
                            <AwardsModal />
                        </div>
                    </Reveal>
                </section>

                {/* Testimonials (Restored) */}
                <section className="container section-margin">
                    <Reveal animation="reveal-fade">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>What Attendees Say</h2>
                    </Reveal>
                    <div className="grid-3">
                        {testimonials.map((t: any, i: number) => (
                            <Reveal key={i} animation="reveal" index={i} stagger={200}>
                                <div className="glass-card">
                                    <p style={{ marginBottom: '20px', lineHeight: 1.5, fontStyle: 'italic' }}>
                                        "{t.message}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={t.photoUrl || (i % 2 === 0 ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/32.jpg")} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{t.designation}</div>
                                        </div>
                                    </div>
                                    {/* Optional: Show rating if stored */}
                                    <div style={{ marginTop: '10px', color: '#ffbd2e', fontSize: '0.8rem' }}>
                                        {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                        {testimonials.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Testimonials to be added soon.</p>}
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="container section-margin" style={{ marginBottom: '40px' }}>
                    <Reveal animation="reveal">
                        <div className="glass-card contact-section">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Contact Us</h2>
                            <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '40px' }}>Have questions? Reach out to our support team.</p>
                            <ContactForm />
                        </div>
                    </Reveal>
                </section>

                {/* Partners Marquee */}
                <div className="partners-marquee">
                    <div className="container" style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        In Association With
                    </div>
                    <div className="partners-track">
                        {/* Logos duplicated for infinite scroll effect */}
                        {[1, 2, 3, 1, 2, 3, 1, 2, 3].map((i, index) => (
                            <img key={index} src={
                                i === 1 ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Nus_logo.png/320px-Nus_logo.png" :
                                    i === 2 ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_NTU.png/320px-Logo_NTU.png" :
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SMU_script_logo.png/320px-SMU_script_logo.png"
                            } className="partner-logo" alt="Partner" loading="lazy" />
                        ))}
                    </div>
                </div>

                {/* Newsletter Section - Background removed to blend */}
                <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '-40px' }}>
                    <Reveal animation="reveal-fade">
                        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Stay Updated</h2>
                            <p style={{ opacity: 0.8, marginBottom: '30px' }}>
                                Subscribe to receive the latest updates on keynote speakers, schedule changes, and exclusive networking opportunities.
                            </p>
                            <NewsletterForm />
                        </div>
                    </Reveal>
                </section>
            </div>
        </div>
    );
}
