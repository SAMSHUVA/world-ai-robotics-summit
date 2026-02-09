import Link from "next/link";
import Script from "next/script";
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
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";

export const dynamic = 'force-dynamic';

import { BackgroundGradientAnimation } from "@/components/BackgroundGradient";

export default async function Home() {
    const settings = await getSiteSettings();

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
            <div className="home-page-v2" style={{ position: 'relative', background: 'transparent' }}> {/* Changed div style to className */}
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
                        {/* Updated JSON-LD Schema as per diff */}
                        <Script
                            id="ld-json"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: [
                                    // Conference Schema
                                    JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "Event",
                                        "name": settings.fullName, // Dynamic from settings
                                        "startDate": CONFERENCE_CONFIG.dates.start,
                                        "endDate": CONFERENCE_CONFIG.dates.end,
                                        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode", // Updated
                                        "eventStatus": "https://schema.org/EventScheduled",
                                        "location": [
                                            {
                                                "@type": "VirtualLocation",
                                                "url": CONFERENCE_CONFIG.urls.canonical
                                            },
                                            {
                                                "@type": "Place",
                                                "name": settings.venue, // Dynamic from settings
                                                "address": {
                                                    "@type": "PostalAddress",
                                                    "addressLocality": settings.location, // Dynamic from settings
                                                    "addressCountry": "SG"
                                                }
                                            }
                                        ],
                                        "description": `${settings.fullName}, hosted by IAISR. Join global researchers and innovators in ${settings.location}.`, // Dynamic from settings
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
                                        "name": settings.fullName, // Dynamic from settings
                                        "url": CONFERENCE_CONFIG.urls.canonical,
                                        "potentialAction": {
                                            "@type": "SearchAction",
                                            "target": `${CONFERENCE_CONFIG.urls.canonical}/speakers?q={search_term_string}`,
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
                                        <span className="hero-line neural-drift" style={{ '--delay': '0s', display: 'block', fontSize: 'clamp(3rem, 6vw, 5rem)' } as React.CSSProperties}>{settings.name}</span>
                                        <span className="hero-line neural-drift" style={{ '--delay': '0.2s', display: 'block', fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}>&</span>
                                        <span className="hero-line neural-drift" style={{ '--delay': '0.4s', display: 'block' } as React.CSSProperties}>
                                            <span className="title-gradient aura-text">& Robotics Summit {settings.year}</span> {/* Dynamic from settings */}
                                        </span>
                                    </h1>
                                </div>
                                <Reveal animation="reveal-left" delay={200}>
                                    <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '40px' }}>
                                        {settings.heroTagline}. Join us in <b>{settings.location}</b> for the {settings.heroGatheringText}.
                                    </p>
                                </Reveal>
                                <Reveal animation="reveal-left" delay={400}>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-btns">
                                        <Link href="/register" className="btn btn-primary-glow" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>{settings.heroCtaPrimary}</Link>
                                        <Link href="/call-for-papers" className="btn btn-secondary-minimal" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>{settings.heroCtaSecondary}</Link>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Quick Contact Form - Client Component */}
                            <Reveal animation="reveal" delay={300}>
                                <div className="glass-card hero-form-card" style={{ padding: '32px', textAlign: 'left' }}>
                                    <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{settings.heroFormTitle}</h3>
                                    <HeroInquiryForm settings={settings} />
                                </div>
                            </Reveal>
                        </div>
                    </section>


                    {/* Important Dates */}
                    <Reveal threshold={0.2}>
                        <ImportantDates dates={importantDates} settings={settings} />
                    </Reveal>

                    {/* AI Simulator Section (Moved & Refined) */}
                    <section className="section-margin">
                        <div className="container" style={{ position: 'relative' }}>
                            <div className="neural-drift" style={{ '--delay': '0.1s' } as React.CSSProperties}>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{settings.aiSimulatorTitle}</h2>
                                    <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                                        {settings.aiSimulatorSubtitle}
                                    </p>
                                </div>
                                <AIPromptTerminal settings={settings} />
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
                    <IAISRSection settings={settings} />

                    {/* Keynote Speakers */}
                    <section className="container section-margin">
                        <Reveal animation="reveal-fade">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>{settings.speakersTitle}</h2>
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
                            {speakers.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>{settings.speakersEmptyText}</p>}
                        </div>
                    </section>

                    {/* Conference Committee */}
                    <section className="container section-margin">
                        <Reveal animation="reveal-fade">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>{settings.committeeTitle}</h2>
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
                            {committee.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>{settings.committeeEmptyText}</p>}
                        </div>
                    </section>

                    {/* Premium About Section */}
                    <section className="container section-margin about-grid">
                        <div className="neural-drift" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                            <div className="floating-glass-box">
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{settings.aboutSectionSubtitle}</span>
                                <h2 style={{ fontSize: '3rem', marginTop: '10px', marginBottom: '24px', letterSpacing: '-0.02em', fontWeight: '800' }}>
                                    {settings.aboutSectionTitle}
                                </h2>
                                <p style={{ lineHeight: 1.8, opacity: 0.8, marginBottom: '32px', fontSize: '1.1rem' }}>
                                    {settings.aboutMainTitle}
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
                            <video
                                src="/Whisk_kzmjv2njhto2yjzx0soizdotuwmhrtl2q2y00co.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 1,
                                    opacity: 0.8
                                }}
                            />
                            <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 5, background: 'rgba(13, 11, 30, 0.8)', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6 }}>{settings.themeHeader}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{settings.themeTitle}</div>
                            </div>
                        </div>
                    </section>

                    {/* SDG Impact & Sustainability Section */}
                    <section className="container section-margin sdg-impact-section">
                        <Reveal animation="reveal-fade" threshold={0.2}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{settings.sdgHeader}</span>
                                <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>{settings.sdgTitle.split('&')[0]}<span style={{ color: 'var(--primary)' }}>& {settings.sdgTitle.split('&')[1] || 'Sustainability'}</span></h2>
                                <p style={{ opacity: 0.7, maxWidth: '600px', margin: '15px auto 0', lineHeight: 1.6 }}>
                                    {settings.sdgDescription}
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
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{settings.awardsTitle}</h2>
                                <p style={{ marginBottom: '30px', opacity: 0.9 }}>{settings.awardsDescription}</p>

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
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>{settings.testimonialsTitle}</h2>
                        </Reveal>
                        {testimonials.length > 0 ? (
                            <div className="marquee-wrapper">
                                <div className="marquee-track">
                                    {/* Duplicate for seamless loop */}
                                    {[...testimonials, ...testimonials, ...testimonials].map((t: any, i: number) => (
                                        <div key={i} className="glass-card testimonial-card-slide" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ color: '#ffbd2e', fontSize: '0.9rem', marginBottom: '15px' }}>
                                                    {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                                                </div>
                                                <p style={{ marginBottom: '20px', lineHeight: 1.6, fontStyle: 'italic', fontSize: '1rem', opacity: 0.9 }}>
                                                    "{t.message}"
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
                                                <img
                                                    src={t.photoUrl || (i % 2 === 0 ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/32.jpg")}
                                                    alt={t.name}
                                                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{t.name}</div>
                                                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{t.designation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>{settings.testimonialsEmptyText}</p>
                        )}
                    </section>

                    {/* Contact Form Section */}
                    <section className="container section-margin" style={{ marginBottom: '40px' }}>
                        <Reveal animation="reveal">
                            <div className="glass-card contact-section">
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>{settings.contactTitle}</h2>
                                <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '40px' }}>{settings.contactSubtitle}</p>
                                <ContactForm />
                            </div>
                        </Reveal>
                    </section>

                    {/* Partners Marquee */}
                    <div className="partners-marquee">
                        <div className="container" style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
                            {settings.partnersLabel}
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
                                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{settings.newsletterTitle}</h2>
                                <p style={{ opacity: 0.8, marginBottom: '30px' }}>
                                    {settings.newsletterSubtitle}
                                </p>
                                <NewsletterForm />
                            </div>
                        </Reveal>
                    </section>
                </div>
            </div>
        </div>
    );
}
