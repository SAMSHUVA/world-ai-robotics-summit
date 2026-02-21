import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from "@/config/conference";
import { getSiteSettings } from "@/config/settings";
import nextDynamic from 'next/dynamic';

const AwardsGrid = nextDynamic(() => import("@/components/AwardsGrid"));
const AwardsModal = nextDynamic(() => import("@/components/AwardsModal"));
const ResourcesSection = nextDynamic(() => import("@/components/ResourcesSection"));
const HeroInquiryForm = nextDynamic(() => import("@/components/HeroInquiryForm"));
const ImportantDates = nextDynamic(() => import("@/components/ImportantDates"));
const ContactForm = nextDynamic(() => import("@/components/ContactForm"), { ssr: false });
const NewsletterForm = nextDynamic(() => import("@/components/NewsletterForm"));
const AIPromptTerminal = nextDynamic(() => import("@/components/AIPromptTerminal"), { ssr: false });
const IAISRSection = nextDynamic(() => import("@/components/IAISRSection"));
import ScrollIndicator from "@/components/ScrollIndicator";
const TracksSection = nextDynamic(() => import("@/components/TracksSection"));

import Reveal from "@/components/Reveal";
const BackgroundGradientAnimation = nextDynamic(() => import("@/components/BackgroundGradient").then(mod => mod.BackgroundGradientAnimation), { ssr: false });

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
    const settings = await getSiteSettings();
    const aboutSectionTitle = /nexus of human & machine/i.test(settings.aboutSectionTitle ?? "")
        ? "Transforming Indian Agriculture Through Innovation"
        : settings.aboutSectionTitle;
    const trustAvatars = [
        { src: "/speaker_1.png", alt: "IAISR participant" },
        { src: "/speaker_2.png", alt: "IAISR researcher" },
        { src: "/speaker_3.png", alt: "IAISR academic" },
        { src: "/Iaisr Logo.webp", alt: "IAISR community" }
    ];

    // Fetch Data with error handling for production stability
    let speakers = [];
    let committee = [];
    let importantDates = [];
    let testimonials = [];
    let awards = [];

    // Fetch Data in parallel for better performance
    const [speakersRes, committeeRes, importantDatesRes, testimonialsRes, awardsRes] = await Promise.allSettled([
        prisma.speaker.findMany({
            where: { type: 'KEYNOTE' },
            orderBy: { displayOrder: 'asc' }
        }),
        prisma.committeeMember.findMany({
            orderBy: { displayOrder: 'asc' }
        }),
        prisma.importantDate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }),
        prisma.testimonial.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }),
        (prisma as any).award.findMany({
            orderBy: { id: 'asc' }
        })
    ]);

    if (speakersRes.status === 'rejected') console.error('Speakers fetch failed:', speakersRes.reason);
    if (committeeRes.status === 'rejected') console.error('Committee fetch failed:', committeeRes.reason);

    speakers = speakersRes.status === 'fulfilled' ? (speakersRes.value || []) : [];
    committee = committeeRes.status === 'fulfilled' ? (committeeRes.value || []) : [];
    importantDates = importantDatesRes.status === 'fulfilled' ? (importantDatesRes.value || []) : [];
    testimonials = testimonialsRes.status === 'fulfilled' ? (testimonialsRes.value || []) : [];
    awards = awardsRes.status === 'fulfilled' ? (awardsRes.value || []) : [];

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
                    {/* Hero Section - Using <header> instead of <section> for better LCP & semantic structure */}
                    <header className="hero-section" style={{ background: 'transparent', border: 'none' }}>
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
                                                    "addressCountry": "IN"
                                                }
                                            }
                                        ],
                                        "image": [
                                            `${CONFERENCE_CONFIG.urls.canonical}/Iaisr%20Logo.webp`,
                                            `${CONFERENCE_CONFIG.urls.canonical}/banner2.png`
                                        ],
                                        "description": `${settings.fullName}, hosted by IAISR. Join global researchers and innovators in ${settings.location}.`, // Dynamic from settings
                                        "offers": {
                                            "@type": "Offer",
                                            "url": `${CONFERENCE_CONFIG.urls.canonical}/register`,
                                            "price": "0",
                                            "priceCurrency": "USD",
                                            "availability": "https://schema.org/InStock",
                                            "validFrom": new Date().toISOString().split('T')[0]
                                        },
                                        "performer": speakers.map((s: any) => ({
                                            "@type": "Person",
                                            "name": s.name
                                        })),
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
                                    <h1 className="hero-main-title" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <span className="hero-line neural-drift" style={{ '--delay': '0s', display: 'block', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' } as React.CSSProperties}>{settings.name}</span>
                                        <span className="hero-line neural-drift" style={{ '--delay': '0.4s', display: 'block', fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)', fontWeight: 500, opacity: 0.9, letterSpacing: '0.02em' } as React.CSSProperties}>
                                            <span className="title-gradient aura-text" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>{settings.heroTitleLine2} {settings.year}</span>
                                        </span>
                                    </h1>
                                </div>
                                <Reveal animation="reveal-left" delay={200}>
                                    <p className="hero-tagline-v2" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', opacity: 0.7, marginBottom: '40px', lineHeight: 1.6, maxWidth: '90%' }}>
                                        {settings.heroTagline}. Join us in <b>{settings.location}</b> for the {settings.heroGatheringText}.
                                    </p>
                                </Reveal>
                                <Reveal animation="reveal-left" delay={400}>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-btns">
                                        <Link href="/register" className="btn btn-primary-glow" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>{settings.heroCtaPrimary}</Link>
                                        <Link href="/call-for-papers" className="btn btn-secondary-minimal" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>{settings.heroCtaSecondary}</Link>
                                    </div>
                                </Reveal>
                                <Reveal animation="reveal-left" delay={520}>
                                    <div className="hero-trust-card hero-trust-card-mobile" aria-label="Trust indicators">
                                        <div className="hero-trust-stars" aria-hidden="true"><span>&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                                        <p className="hero-trust-text">
                                            Trusted by <strong>5k+ Academics, Researchers, and Universities</strong>
                                        </p>
                                        <div className="hero-trust-avatars">
                                            {trustAvatars.map((avatar, idx) => (
                                                <span key={idx} className="hero-trust-avatar">
                                                    <Image
                                                        src={avatar.src}
                                                        alt={avatar.alt}
                                                        width={38}
                                                        height={38}
                                                        style={{ objectFit: "cover" }}
                                                        priority={true}
                                                    />
                                                </span>
                                            ))}
                                            <span className="hero-trust-badge">+5k</span>
                                        </div>
                                        <p className="hero-trust-meta">50+ Countries | 10k+ Members | 200+ IAISR Events</p>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Quick Contact Form - Client Component */}
                            <Reveal animation="reveal" delay={300}>
                                <div className="hero-right-stack">
                                    <div className="glass-card hero-form-card" style={{ padding: '32px', textAlign: 'left' }}>
                                        <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{settings.heroFormTitle}</h3>
                                        <HeroInquiryForm settings={settings} />
                                    </div>
                                    <div className="hero-trust-card hero-trust-card-desktop" aria-label="Trust indicators">
                                        <div className="hero-trust-stars" aria-hidden="true"><span>&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
                                        <p className="hero-trust-text">
                                            Trusted by <strong>5k+ Academics, Researchers, and Universities</strong>
                                        </p>
                                        <div className="hero-trust-avatars">
                                            {trustAvatars.map((avatar, idx) => (
                                                <span key={idx} className="hero-trust-avatar">
                                                    <Image
                                                        src={avatar.src}
                                                        alt={avatar.alt}
                                                        width={38}
                                                        height={38}
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </span>
                                            ))}
                                            <span className="hero-trust-badge">+5k</span>
                                        </div>
                                        <p className="hero-trust-meta">50+ Countries | 10k+ Members | 200+ IAISR Events</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </header>


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
                                background: 'radial-gradient(circle, rgba(31, 203, 143, 0.15) 0%, transparent 70%)',
                                zIndex: -1,
                                filter: 'blur(100px)'
                            }}></div>
                        </div>
                    </section>

                    <Reveal threshold={0.2}>
                        <TracksSection />
                    </Reveal>

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
                                        <Image
                                            src={speaker.photoUrl || '/Iaisr%20Logo.webp'}
                                            alt={speaker.name}
                                            className="speaker-image"
                                            width={400}
                                            height={500}
                                            priority={idx < 3}
                                        />
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
                                            {member.photoUrl ? <Image src={member.photoUrl} alt="" width={50} height={50} style={{ borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
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
                                    {aboutSectionTitle}
                                </h2>
                                <p style={{ lineHeight: 1.8, opacity: 0.8, marginBottom: '32px', fontSize: '1.1rem' }}>
                                    {settings.aboutMainTitle}
                                </p>

                                <div className="feature-cards-container">
                                    {[
                                        { title: 'AI for Farmers', icon: '🌾', desc: 'Field-ready intelligence for crop planning, pest alerts, and yield-focused decisions.' },
                                        { title: 'Precision Agriculture', icon: '🛰️', desc: 'Using sensors, automation, and analytics to improve productivity and reduce input costs.' },
                                        { title: 'Climate Resilience', icon: '🌦️', desc: 'Data-backed strategies for water efficiency, soil health, and climate-smart farming.' },
                                        { title: 'Research to Impact', icon: '🤝', desc: 'Bringing together academia, startups, and policymakers for adoption across Indian agriculture.' }
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
                            minHeight: '460px',
                            height: '700px',
                            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                            border: '1px solid rgba(91, 77, 255, 0.3)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                src="/banner2.png"
                                alt="AgTech innovation banner"
                                fill
                                sizes="(max-width: 992px) 100vw, 45vw"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: '50% 50%',
                                    zIndex: 1,
                                    opacity: 0.88
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
                                { id: 4, label: 'Quality Education', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_4.png', color: '#C5192D', desc: 'Empowering students, extension workers, and farmers with practical AI literacy, precision-farming methods, and open research access.', alignment: 91 },
                                { id: 9, label: 'Industry & Innovation', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_9.png', color: '#F36E25', desc: 'Accelerating agri-innovation through smart mechanization, data platforms, and scalable AI solutions for crops, soil, and supply chains.', alignment: 94 },
                                { id: 11, label: 'Sustainable Communities', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_11.png', color: '#FD9D24', desc: 'Strengthening rural and peri-urban food systems with resilient agri-logistics, waste-to-value models, and resource-efficient planning.', alignment: 86 },
                                { id: 13, label: 'Climate Action', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_13.png', color: '#3F7E44', desc: 'Advancing climate-smart agriculture using AI for drought prediction, carbon-aware farming, and adaptation strategies for Indian conditions.', alignment: 92 },
                                { id: 17, label: 'Partnerships for Goals', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_17.png', color: '#19486A', desc: 'Connecting academia, agritech startups, policymakers, and farmer networks to co-create high-impact, field-ready innovations.', alignment: 100 },
                                { id: 16, label: 'Responsible AI', icon: '/SDG%20Icons/TheGlobalGoals_Icons_Color_Goal_16.png', color: '#4B2C82', desc: 'Embedding ethics, transparency, and farmer-first safeguards across conference submissions, pilots, and deployment frameworks.', alignment: 100 },
                            ].map((sdg, i) => (
                                <Reveal key={i} animation="reveal" index={i % 3} stagger={150}>
                                    <div className="impact-card" style={{ borderTop: `4px solid ${sdg.color}` }}>
                                        <div className="impact-header">
                                            <div className="impact-icon-box" style={{ overflow: 'hidden', borderRadius: '12px' }}>
                                                <Image
                                                    src={sdg.icon}
                                                    alt={sdg.label}
                                                    width={60}
                                                    height={60}
                                                    style={{ objectFit: 'cover', borderRadius: 'inherit' }}
                                                />
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

                    {/* Redesigned Awards Section */}
                    <AwardsGrid awards={awards} settings={settings} />

                    {/* Moved Modal to Root for better stacking context */}
                    <AwardsModal awards={awards} />

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
                                                <Image
                                                    src={t.photoUrl || (i % 2 === 0 ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/32.jpg")}
                                                    alt={t.name}
                                                    width={50}
                                                    height={50}
                                                    style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
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
            <ScrollIndicator />
        </div>
    );
}



