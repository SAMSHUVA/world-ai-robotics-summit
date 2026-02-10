'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Download, Filter, User, ArrowRight, Activity, Cpu, Globe, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface SessionsClientProps {
    conferenceDate: string | undefined;
    settings: any;
    agendaUrl?: string | null;
}

export default function SessionsClient({ conferenceDate, settings, agendaUrl }: SessionsClientProps) {
    const [activeDay, setActiveDay] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState('All');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Simplified Static Dates to prevent hydration errors
    const scheduleDates = [
        { day: "Day 1", date: "Nov 21" },
        { day: "Day 2", date: "Nov 22" }
    ];

    const tracks = ['All', 'Keynote', 'AgTech', 'Robotics', 'Generative AI', 'Sustainability', 'Policy', 'Workshops'];

    const scheduleData = [
        // Day 1
        [
            { time: "08:00 AM", endTime: "09:00 AM", title: "Registration & Breakfast", type: "Social", room: "Grand Foyer", desc: "Check-in, badge pickup, and morning networking with coffee and light refreshments." },
            { time: "09:00 AM", endTime: "10:15 AM", title: "Opening Keynote: The Future of AgTech & AI", speaker: "Dr. Kenji Tanaka", role: "AI Research Lead, Sony", type: "Keynote", room: "Grand Ballroom", desc: "Exploring the next frontier where large language models meet precision agriculture and autonomous farming." },
            { time: "10:30 AM", endTime: "11:30 AM", title: "Precision Agriculture: AI-Driven Crop Management", speaker: "Dr. Sarah Miller", role: "MIT CSAIL", type: "AgTech", room: "Sands Hall A", desc: "How AI and IoT sensors are optimizing irrigation, fertilization, and pest control for higher yields." },
            { time: "10:30 AM", endTime: "11:30 AM", title: "Panel: Policy Frameworks for Autonomous Farming", speaker: "Panel Discussion", role: "Industry Leaders", type: "Policy", room: "Sands Hall B", desc: "Leading experts discuss the regulatory and ethical challenges of deploying autonomous AI in agricultural settings." },
            { time: "11:45 AM", endTime: "12:45 PM", title: "Sustainable Supply Chains with Blockchain & AI", speaker: "Prof. Li Wei", role: "Tsinghua University", type: "Sustainability", room: "Sands Hall A", desc: "Tracing food from farm to table using decentralized ledgers and AI-powered logistics." },
            { time: "01:00 PM", endTime: "02:00 PM", title: "Networking Lunch", type: "Social", room: "Exhibition Hall", desc: "Connect with peers while exploring the latest demos from our 50+ partners." },
            { time: "02:15 PM", endTime: "03:45 PM", title: "Workshop: Building Custom Ag-Models", speaker: "Alex Rivera", role: "OpenAI", type: "Workshops", room: "Innovation Lab", desc: "Hands-on session: Bring your laptop and learn to fine-tune models for agricultural data analysis." },
            { time: "04:00 PM", endTime: "05:00 PM", title: "Swarm Robotics in the Field", speaker: "Robotnik Team", role: "Engineering", type: "Robotics", room: "Sands Hall B", desc: "Coordinating fleets of small robots for planting, weeding, and harvesting." },
        ],
        // Day 2
        [
            { time: "09:00 AM", endTime: "10:00 AM", title: "Keynote: AI for Climate Resilience", speaker: "Dr. Elena Vasquez", role: "Oxford Ethics Inst.", type: "Keynote", room: "Grand Ballroom", desc: "leveraging AI to predict and mitigate the impact of climate change on global agriculture." },
            { time: "10:15 AM", endTime: "11:15 AM", title: "Generative AI for Plant Breeding", speaker: "Markus Chen", role: "AgriGenomics Inc.", type: "Generative AI", room: "Sands Hall B", desc: "Accelerating the development of drought-resistant crops using generative protein models." },
            { time: "11:30 AM", endTime: "12:30 PM", title: "Robotic Harvesting: Challenges & Solutions", speaker: "Boston Dynamics Team", role: "Engineering", type: "Robotics", room: "Sands Hall A", desc: "Overcoming the mechanical and vision challenges of automated fruit and vegetable picking." },
            { time: "01:00 PM", endTime: "02:00 PM", title: "Networking Lunch", type: "Social", room: "Exhibition Hall", desc: "Enjoy a curated menu featuring sustainably sourced ingredients." },
            { time: "02:15 PM", endTime: "04:15 PM", title: "Hackathon: Smart Farm Solutions", speaker: "DevRel Team", role: "Vercel / Supabase", type: "Workshops", room: "Innovation Lab", desc: "A 2-hour sprint to build IoT dashboards and AI alerts for smart farm management." },
            { time: "04:30 PM", endTime: "05:30 PM", title: "Closing Ceremony & Innovation Awards", type: "Social", room: "Grand Ballroom", desc: "Presenting awards for 'Best AgTech Startup' and 'Impact Research', followed by closing remarks." },
        ]
    ];

    const faqs = [
        { q: "Is there a virtual attendance option?", a: "Yes, we offer a hybrid experience. All keynote sessions and select tracks will be live-streamed for virtual ticket holders." },
        { q: "Will session recordings be available?", a: "Unless speakers opt-out, all sessions are recorded and made available to attendees via our resource portal 2 weeks after the event." },
        { q: "Can I get a certificate of participation?", a: "Yes, digital certificates will be issued to all checked-in attendees. Workshop participants receive specialized certifications." },
        { q: "Are there networking opportunities?", a: "Absolutely. We have dedicated networking lunches, an evening gala, and an app-based matchmaking service to help you connect." },
        { q: "Is the Innovation Lab open to everyone?", a: "Access to the Innovation Lab requires a 'Full Access' or 'Workshop' pass due to limited seating capacity." }
    ];

    const currentSchedule = scheduleData[activeDay] ? scheduleData[activeDay].filter(s => filter === 'All' || s.type === filter) : [];

    return (
        <div style={{ background: 'transparent', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                padding: '160px 0 80px',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '20px' }}>
                            <span className="title-gradient">World-Class Agenda</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '700px', margin: '0 auto 40px' }}>
                            Join 3,000+ pioneers for 2 days of groundbreaking keynotes, technical workshops, and unparalleled networking in {settings.location}.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            {agendaUrl ? (
                                <a href={agendaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary-glow" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                    <Download size={18} /> Download Full Agenda
                                </a>
                            ) : (
                                <button className="btn btn-primary-glow" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
                                    <Download size={18} /> Agenda Coming Soon
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(91, 77, 255, 0.1) 0%, transparent 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}></div>
            </section>

            {/* Schedule Interface */}
            <section className="container" style={{ marginBottom: '100px', position: 'relative', zIndex: 10 }}>
                {/* Day Tabs */}
                <div className="schedule-tabs" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '40px',
                    flexWrap: 'wrap'
                }}>
                    {scheduleDates.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveDay(i)}
                            className={`tab-btn ${activeDay === i ? 'active' : ''}`}
                            style={{
                                padding: '16px 32px',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: activeDay === i ? '#5B4DFF' : 'var(--glass-border)',
                                background: activeDay === i ? 'linear-gradient(135deg, rgba(91, 77, 255, 0.2), rgba(91, 77, 255, 0.1))' : 'rgba(var(--glass-bg-rgb), 0.05)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'center',
                                minWidth: '140px',
                                boxShadow: activeDay === i ? '0 8px 24px rgba(91, 77, 255, 0.3)' : 'none'
                            }}
                        >
                            <span style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9, color: activeDay === i ? '#5B4DFF' : 'var(--text-secondary)' }}>{d.day}</span>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{d.date}</span>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px', scrollbarWidth: 'none' }}>
                    {tracks.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: filter === t ? '#fff' : 'transparent',
                                color: filter === t ? '#000' : 'rgba(255,255,255,0.6)',
                                fontSize: '0.9rem',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Session Cards */}
                <div className="session-list">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDay + filter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {currentSchedule.length > 0 ? (
                                currentSchedule.map((session, idx) => (
                                    <div key={idx} className="glass-card session-card" style={{
                                        padding: '24px',
                                        display: 'grid',
                                        gridTemplateColumns: '150px 1fr auto',
                                        gap: '24px',
                                        alignItems: 'center',
                                        transition: 'transform 0.2s, background 0.2s'
                                    }}>
                                        {/* Time Column */}
                                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{session.time}</div>
                                            <div style={{ fontSize: '0.9rem', opacity: 0.5, marginTop: '4px' }}>{session.endTime}</div>
                                        </div>

                                        {/* Content Column */}
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                                <span data-badge="true" style={{
                                                    background: session.type === 'Keynote' ? 'rgba(255, 59, 138, 0.2)' : 'rgba(91, 77, 255, 0.15)',
                                                    color: session.type === 'Keynote' ? '#FF3B8A' : '#5B4DFF',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {session.type}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '8px' }}>{session.title}</h3>
                                            <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '12px', lineHeight: '1.5' }}>{session.desc}</p>

                                            {session.speaker && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={16} />
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem' }}>
                                                        <span style={{ fontWeight: '600' }}>{session.speaker}</span>
                                                        <span style={{ opacity: 0.5, marginLeft: '6px' }}>• {session.role}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta Column */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', opacity: 0.7, fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={16} /> {session.room}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px', opacity: 0.6 }}>
                                    No sessions found for this filter.
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '80px 0', background: 'rgba(var(--glass-bg-rgb), 0.2)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                            <HelpCircle size={28} className="text-primary" />
                            <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
                        </div>
                        <p style={{ opacity: 0.7, color: 'var(--text-secondary)' }}>Common questions about the conference agenda and logistics.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="glass-card"
                                style={{
                                    padding: '0 24px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => toggleFaq(index)}
                            >
                                <div style={{
                                    padding: '24px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    color: 'var(--text-primary)'
                                }}>
                                    {faq.q}
                                    {openFaqIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                <AnimatePresence>
                                    {openFaqIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ paddingBottom: '24px', opacity: 0.8, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO & Content Section */}
            <section style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Activity className="text-primary" size={32} />
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Strategic Themes</h2>
                            </div>
                            <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '20px' }}>
                                Our curated agenda focuses on the most critical pillars of modern technology. From <strong>Generative AI</strong> and its enterprise applications to the ethics of <strong>Autonomous Systems</strong>, every session is designed to provide actionable insights. We believe in moving beyond the hype to discuss real-world implementation, scalability, and impact.
                            </p>
                            <Link href="/about" style={{ color: '#5B4DFF', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                Explore our Mission <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Cpu className="text-secondary" size={32} color="#FF3B8A" />
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Tech & Innovation</h2>
                            </div>
                            <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '20px' }}>
                                Experience the future firsthand. The Summit features a dedicated <strong>Innovation Lab</strong> running concurrent workshops on RAG architectures, model fine-tuning, and robotic control systems. Interact with state-of-the-art <strong>Humanoid Robots</strong> and see how AgTech drones are revolutionizing global food security in our dedicated expo hall.
                            </p>
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Globe className="text-primary" size={32} color="#5B4DFF" />
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Global Networking</h2>
                            </div>
                            <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '20px' }}>
                                With attendees from over 40 countries, the {settings.shortName} is a global melting pot of ideas. Our daily networking lunches and evening galas are structured to foster meaningful connections between <strong>researchers, investors, and founders</strong>. Don't miss the opportunity to find your next co-founder or research partner.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                .text-primary { color: #5B4DFF; }
                .text-secondary { color: #FF3B8A; }
                
                @media (max-width: 768px) {
                     .session-card {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                     }
                     .hero-title {
                        font-size: 2.5rem !important;
                     }
                     .schedule-tabs {
                        flex-direction: column;
                     }
                     .tab-btn {
                        width: 100%;
                     }
                }
            `}</style>
        </div>
    );
}

