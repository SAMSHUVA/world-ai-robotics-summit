import prisma from "@/lib/prisma";
import AwardsModal from "@/components/AwardsModal";
import ResourcesSection from "@/components/ResourcesSection";
import HeroInquiryForm from "@/components/HeroInquiryForm";

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch Data with error handling for production stability
    let speakers = [];
    let committee = [];

    try {
        speakers = await (prisma.speaker as any).findMany({
            where: { type: 'KEYNOTE' }
        }) || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch speakers", e);
    }

    try {
        committee = await (prisma as any).committeeMember.findMany() || [];
    } catch (e) {
        console.error("Home Page: Failed to fetch committee", e);
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-content-left">
                        <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.2' }}>
                            World AI & <br />
                            <span className="title-gradient">Robotics Summit 2026</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '40px' }}>
                            Bridging Intelligent Systems and Human Innovation. Join us in <b>Singapore</b> for the 7th Annual Global Gathering.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-btns">
                            <a href="/register" className="btn btn-primary-glow" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Explore Tickets</a>
                            <a href="/call-for-papers" className="btn btn-secondary-minimal" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>Submit Abstract</a>
                        </div>
                    </div>

                    {/* Quick Contact Form - Client Component */}
                    <div className="glass-card hero-form-card" style={{ padding: '32px', textAlign: 'left' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Get Conference Updates</h3>
                        <HeroInquiryForm />
                    </div>
                </div>
            </section>

            {/* Important Dates - Optimized for Mobile Carousel */}
            <section className="container section-margin">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '50px', textAlign: 'center' }}>Important Dates</h2>
                <div className="dates-carousel-mobile">
                    <div className="dates-grid">
                        {[
                            { label: 'Paper Submission Deadline', date: 'March 15, 2026', icon: '📝' },
                            { label: 'Notification of Acceptance', date: 'April 5, 2026', icon: '📩' },
                            { label: 'Camera Ready Submission', date: 'April 20, 2026', icon: '🎟️' },
                            { label: 'Conference Dates', date: 'May 22-24, 2026', icon: '📅' },
                        ].map((item, i) => (
                            <div key={i} className="date-3d-card">
                                <span className="date-3d-icon">{item.icon}</span>
                                <div className="date-3d-text">
                                    <span className="date-3d-value">{item.date}</span>
                                    <span className="date-3d-label">{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ResourcesSection />

            {/* Organized By IAISR - Premium Transition */}
            <section className="container section-margin">
                <div className="glass-card iaisr-branding-card">
                    <div className="iaisr-branding-content">
                        <img src="/logo.png" alt="IAISR Logo" className="footer-iaisr-logo" />
                        <div className="iaisr-text">
                            <h2 className="iaisr-title">Organized by IAISR</h2>
                            <h3 className="iaisr-subtitle">International Association for Innovation and Scientific Research</h3>
                            <p className="iaisr-description">
                                Bridging global research and future innovation. IAISR is dedicated to fostering a world-class community of scholars and industry leaders to drive scientific progress and sustainable development.
                            </p>
                            <div className="iaisr-stats">
                                <div className="stat-item"><span>50+</span> Countries</div>
                                <div className="stat-item"><span>10k+</span> Members</div>
                                <div className="stat-item"><span>200+</span> Events</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Keynote Speakers */}
            <section className="container section-margin">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Keynote Speakers</h2>
                <div className="speaker-grid">
                    {speakers.map((speaker: any, idx: number) => (
                        <div key={idx} className="glass-card speaker-card">
                            <img src={speaker.photoUrl || '/logo.png'} alt={speaker.name} className="speaker-image" style={{ objectFit: 'cover' }} />
                            <div className="speaker-info">
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{speaker.name}</h3>
                                <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{speaker.role}</div>
                                <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>{speaker.affiliation}</div>
                            </div>
                        </div>
                    ))}
                    {speakers.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Speakers to be announced.</p>}
                </div>
            </section>

            {/* Conference Committee */}
            <section className="container section-margin">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Conference Committee</h2>
                <div className="committee-grid">
                    {committee.map((member: any, i: number) => (
                        <div key={i} className="glass-card committee-card">
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                {member.photoUrl ? <img src={member.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>{member.name}</h4>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{member.role}</div>
                            </div>
                        </div>
                    ))}
                    {committee.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Committee members to be announced.</p>}
                </div>
            </section>

            {/* About Section */}
            <section className="container section-margin grid-2">
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>About WARS '26</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.8, marginBottom: '24px' }}>
                        The World AI & Robotics Summit (WARS '26) is the flagship event organized by IAISR to foster deep integration between autonomous systems and cognitive computing. Hosted at the prestigious Marina Bay Sands, the summit brings together 1,200+ delegates from across the globe.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['Global Networking', 'World-class Keynotes', 'Interactive Workshops'].map(item => (
                            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ color: 'var(--primary)' }}>✓</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0 }}>
                    <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000" alt="About Conference" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </section>

            {/* SDG Impact & Sustainability Section */}
            <section className="container section-margin sdg-impact-section">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>UN 2030 Agenda</span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>SDG Impact & <span style={{ color: 'var(--primary)' }}>Sustainability</span></h2>
                    <p style={{ opacity: 0.7, maxWidth: '600px', margin: '15px auto 0', lineHeight: 1.6 }}>
                        Harnessing Artificial Intelligence as a catalyst for the UN Sustainable Development Goals through rigorous research, ethical innovation, and net-zero event practices.
                    </p>
                </div>

                <div className="sdg-impact-grid">
                    {[
                        { id: 4, label: 'Quality Education', icon: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/08/E_SDG_Icons_Individual_04.png', color: '#C5192D', desc: 'Promoting AI literacy through workshops and providing inclusive access to research databases.', alignment: 85 },
                        { id: 9, label: 'Industry & Innovation', icon: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/08/E_SDG_Icons_Individual_09.png', color: '#F36E25', desc: 'Accelerating digital transformation via cutting-edge AI architecture and ethical deployment frameworks.', alignment: 92 },
                        { id: 11, label: 'Sustainable Cities', icon: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/08/E_SDG_Icons_Individual_11.png', color: '#FD9D24', desc: 'Optimizing urban living through AI-driven traffic management, waste reduction planning, and energy-efficient building models.', alignment: 78 },
                        { id: 13, label: 'Climate Action', icon: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/08/E_SDG_Icons_Individual_13.png', color: '#3F7E44', desc: 'Research into carbon-efficient computing and AI systems designed specifically for climate modeling and adaptation strategies.', alignment: 88 },
                        { id: 17, label: 'Partnerships for Goals', icon: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/08/E_SDG_Icons_Individual_17.png', color: '#19486A', desc: 'Building a global network of academic, industrial, and government bodies to share open-source AI tools and sustainability data.', alignment: 100 },
                        { id: 'Ethics', label: 'Responsible AI', icon: 'https://www.un.org/sustainabledevelopment/static/wp-content/uploads/2019/01/SDG_Wheel_Transparent-300x300.png', color: '#4B2C82', desc: 'A mandatory framework for all conference submissions ensuring research adheres to global ethical standards.', alignment: 100 },
                    ].map((sdg, i) => (
                        <div key={i} className="impact-card" style={{ borderTop: `4px solid ${sdg.color}` }}>
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
                    ))}
                </div>
            </section>

            {/* Awards Section (New) */}
            <section className="container section-margin" style={{ textAlign: 'center' }}>
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
            </section>

            {/* Testimonials (Restored) */}
            <section className="container section-margin">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>What Attendees Say</h2>
                <div className="grid-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card">
                            <p style={{ marginBottom: '20px', lineHeight: 1.5, fontStyle: 'italic' }}>
                                "An incredible experience. The quality of research presented was outstanding, and the networking opportunities were invaluable."
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#333' }}></div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>Dr. Sarah Smith</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>MIT Research Lab</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="container section-margin">
                <div className="glass-card contact-section">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Contact Us</h2>
                    <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '40px' }}>Have questions? Reach out to our support team.</p>

                    <form style={{ display: 'grid', gap: '20px' }}>
                        <div className="form-grid-2">
                            <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                        </div>
                        <input type="text" placeholder="Subject" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                        <textarea placeholder="Message" rows={5} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'vertical' }}></textarea>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Send Message</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
