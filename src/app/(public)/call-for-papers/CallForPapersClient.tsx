'use client';

import React, { useState, useEffect } from 'react';
import MagneticButton from '../../../components/ui/MagneticButton';
import PageLoader from '../../../components/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    ShieldCheck,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Calendar,
    Brain,
    Bot,
    Cpu,
    Network,
    Database,
    Eye
} from "lucide-react";

interface Resource {
    id: number;
    title: string;
    fileUrl: string;
    category: string;
    isVisible: boolean;
}

interface ImportantDate {
    id: number;
    event: string;
    date: string;
    note?: string;
    isActive: boolean;
    order: number;
}

interface CallForPapersClientProps {
    faqSection: React.ReactNode;
    importantDates: ImportantDate[];
    settings: any;
}

export default function CallForPapersClient({ faqSection, importantDates, settings }: CallForPapersClientProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
    const [hasMounted, setHasMounted] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [templates, setTemplates] = useState<Resource[]>([]);

    useEffect(() => {
        setHasMounted(true);

        // Fetch templates from Resources
        async function fetchTemplates() {
            try {
                const response = await fetch('/api/resources');
                const data = await response.json();
                // Filter for visible templates only
                const templateResources = data.filter((r: Resource) =>
                    r.isVisible && r.category.toLowerCase().includes('template')
                );
                setTemplates(templateResources);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            } finally {
                // Done fetching
            }
        }
        fetchTemplates();
    }, []);

    useEffect(() => {
        // Find the "Conference" or "Conference Dates" event for the countdown
        const conferenceDate = importantDates.find(d =>
            d.event.toLowerCase().includes('conference')
        );

        // Fallback to Nov 21, 2026 if no conference date found in DB
        const defaultTarget = new Date('November 21, 2026 09:00:00').getTime();

        let targetDate = conferenceDate
            ? new Date(conferenceDate.date).getTime()
            : defaultTarget;

        // If the selected date is in the past, try to find the next upcoming important date
        if (targetDate < new Date().getTime()) {
            const nextUpcoming = importantDates
                .map(d => new Date(d.date).getTime())
                .filter(t => t > new Date().getTime())
                .sort((a, b) => a - b)[0];

            if (nextUpcoming) targetDate = nextUpcoming;
        }
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                secs: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        try {
            const response = await fetch('/api/paper/submit', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert('Submission failed: ' + result.error);
            }
        } catch (e) {
            alert('Network error');
        } finally {
            setLoading(false);
        }
    }

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    if (submitted) {
        return (
            <div className="container success-container">
                <div className="glass-card success-card">
                    <div className="success-icon">✅</div>
                    <h1>Submission Received!</h1>
                    <p>Thank you for submitting your research to {settings.shortName}. A confirmation email has been sent to you.</p>
                    <button onClick={() => setSubmitted(false)} className="btn">Submit Another Paper</button>
                </div>
                <style jsx>{`
                    .success-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; }
                    .success-card { text-align: center; max-width: 500px; padding: 60px 40px; }
                    .success-icon { font-size: 4rem; margin-bottom: 20px; }
                    h1 { margin-bottom: 16px; font-size: 2rem; }
                    p { opacity: 0.7; margin-bottom: 30px; line-height: 1.6; }
                `}</style>
            </div>
        );
    }

    return (
        <>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hasMounted ? 1 : 0, y: hasMounted ? 0 : 20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className={`page-wrapper ${hasMounted ? 'mounted' : ''}`}>

                    {/* 1. Hero Section */}
                    <header className="hero-section">
                        <div className="hero-bg"></div>
                        <div className="container hero-content">
                            <div className="hero-badge neural-drift" style={{ '--delay': '0s' } as React.CSSProperties}>{settings.shortName} {settings.location.toUpperCase()}</div>
                            <h1 className="hero-title neural-drift" style={{ '--delay': '0.1s' } as React.CSSProperties}>Call for Papers</h1>
                            <p className="hero-subtitle neural-drift" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                                {settings.tagline || 'Join the global discourse on the future of autonomy. Submit your latest research in AI, Robotics, and Machine Learning.'}
                            </p>

                            <div className="countdown-grid neural-drift" style={{ '--delay': '0.3s' } as React.CSSProperties}>
                                {[
                                    { val: timeLeft.days, label: 'DAYS' },
                                    { val: timeLeft.hours, label: 'HOURS' },
                                    { val: timeLeft.mins, label: 'MINS' },
                                    { val: timeLeft.secs, label: 'SECS' }
                                ].map((t, i) => (
                                    <div key={i} className="countdown-item">
                                        <span className="countdown-val">{t.val}</span>
                                        <span className="countdown-label">{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* 2. Floating Submission Form */}
                    <section className="form-section">
                        <div className="container">
                            <div className="glass-card submission-card">
                                <div className="form-header">
                                    <h2>Submit Your Abstract</h2>
                                    <p>Phase 1: Early Submission • Ends <span className="highlight">
                                        {(() => {
                                            if (!hasMounted) return '...';
                                            const abstractDate = importantDates.find(d => d.event.toLowerCase().includes('abstract'));
                                            return abstractDate
                                                ? new Date(abstractDate.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                                                : 'March 15';
                                        })()}
                                    </span></p>
                                </div>

                                {/* Guidance Alert */}
                                <div className="guidance-alert">
                                    <AlertCircle size={20} className="guidance-icon" />
                                    <div className="guidance-text">
                                        <strong>Before you submit:</strong> Please ensure your abstract uses the official {settings.shortName} template.
                                        <button onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })} className="link-btn">
                                            Download Templates ↓
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="submission-form">
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>Author Name</label>
                                            <input type="text" name="authorName" required placeholder="John Doe" />
                                        </div>
                                        <div className="input-group">
                                            <label>Email Address</label>
                                            <input type="email" name="email" required placeholder="john@university.edu" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>WhatsApp / Phone</label>
                                            <input type="text" name="whatsappNumber" required placeholder="+65 XXXX XXXX" />
                                        </div>
                                        <div className="input-group">
                                            <label>Country</label>
                                            <input type="text" name="country" required placeholder="e.g. Singapore" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>Paper Title</label>
                                            <input type="text" name="paperTitle" required placeholder="Enter research title" />
                                        </div>
                                        <div className="input-group">
                                            <label>Organization</label>
                                            <input type="text" name="organization" required placeholder="University / Company" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>Research Track</label>
                                            <select name="track" required className="input-group input" style={{ appearance: 'none' }}>
                                                <option value="">Select a Track</option>
                                                <option value="Generative AI">Generative AI</option>
                                                <option value="Autonomous Robotics">Autonomous Robotics</option>
                                                <option value="Computer Vision">Computer Vision</option>
                                                <option value="Machine Learning">Machine Learning</option>
                                                <option value="Edge AI & IoT">Edge AI & IoT</option>
                                                <option value="AI Ethics">AI Ethics</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>Co-Authors Details (Optional)</label>
                                            <input type="text" name="coAuthors" placeholder="Jane Smith (MIT), Bob Wilson (Stanford)" />
                                        </div>
                                    </div>

                                    <div className="upload-box">
                                        <div className="upload-content">
                                            <FileText size={32} className="upload-icon" />
                                            <span>Upload Abstract (PDF/DOCX)</span>
                                            <small>Max 10MB</small>
                                        </div>
                                        <input type="file" name="file" required accept=".pdf,.docx" />
                                    </div>

                                    <MagneticButton type="submit" disabled={loading} className="btn submit-btn">
                                        {loading ? 'Processing...' : 'Submit Abstract Now'}
                                    </MagneticButton>
                                </form>
                            </div>
                        </div>
                    </section>

                    {/* 3. Horizontal Timeline */}
                    <section className="timeline-section">
                        <div className="container">
                            <div className="section-header">
                                <Calendar className="section-icon" />
                                <h2>Important Dates</h2>
                            </div>

                            <div className="timeline-track">
                                <div className="timeline-line"></div>
                                <div className="timeline-grid">
                                    {importantDates.length > 0 ? (
                                        importantDates.map((item, i) => {
                                            const itemDate = new Date(item.date);
                                            const now = new Date();
                                            const isPast = itemDate < now;
                                            const isAbstract = item.event.toLowerCase().includes('abstract');

                                            let status = 'UPCOMING';
                                            if (isPast) {
                                                status = 'CLOSED';
                                            } else if (isAbstract) {
                                                status = 'OPEN NOW';
                                            } else if (item.note) {
                                                status = item.note;
                                            }

                                            return (
                                                <div key={i} className={`timeline-node ${!isPast && isAbstract ? 'active' : ''}`}>
                                                    <div className="node-dot"></div>
                                                    <div className="node-content">
                                                        <span className={`node-status ${isPast ? 'passed' : ''}`} style={{ color: !isPast && isAbstract ? '#25D366' : 'inherit' }}>
                                                            {status}
                                                        </span>
                                                        <h3 className="node-date">
                                                            {hasMounted ? itemDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
                                                        </h3>
                                                        <p className="node-title">{item.event}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        [
                                            { date: "March 15, 2026", title: "Abstract Submission", status: "Open Now", active: true },
                                            { date: "April 05, 2026", title: "Review Notification", status: "Upcoming", active: false },
                                            { date: "April 20, 2026", title: "Camera Ready", status: "Deadline", active: false },
                                            { date: "May 22, 2026", title: "Conference", status: "Event", active: false },
                                        ].map((item, i) => (
                                            <div key={i} className={`timeline-node ${item.active ? 'active' : ''}`}>
                                                <div className="node-dot"></div>
                                                <div className="node-content">
                                                    <span className="node-status">{item.status}</span>
                                                    <h3 className="node-date">{item.date}</h3>
                                                    <p className="node-title">{item.title}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Research Tracks */}
                    <section className="tracks-section">
                        <div className="container">
                            <div className="section-header center">
                                <h2>Research Tracks</h2>
                                <p className="section-desc">We invite high-quality submissions across major areas of AI & Robotics.</p>
                            </div>

                            <div className="tracks-grid">
                                {[
                                    { title: "Generative AI", icon: <Brain />, topics: ["LLMs & Transformers", "Diffusion Models", "Creative AI"] },
                                    { title: "Autonomous Robotics", icon: <Bot />, topics: ["Human-Robot Interaction", "Swarm Robotics", "SLAM"] },
                                    { title: "Computer Vision", icon: <AlertCircle />, topics: ["Object Detection", "3D Reconstruction", "NeRFs"] },
                                    { title: "Machine Learning", icon: <Network />, topics: ["Deep Learning", "Self-Supervised Learning", "Optimization"] },
                                    { title: "Edge AI & IoT", icon: <Cpu />, topics: ["TinyML", "Distributed AI", "Smart Sensors"] },
                                    { title: "AI Ethics", icon: <ShieldCheck />, topics: ["Fairness & Bias", "Explainable AI (XAI)", "AI Policy"] },
                                ].map((track, i) => (
                                    <div key={i} className="glass-card track-card">
                                        <div className="track-icon">
                                            {React.cloneElement(track.icon as React.ReactElement, { size: 24 })}
                                        </div>
                                        <h3>{track.title}</h3>
                                        <ul>
                                            {track.topics.map((t, j) => (
                                                <li key={j}>{t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5. Guidelines & Downloads */}
                    <section className="guidelines-section" id="downloads">
                        <div className="container">
                            <div className="split-layout">
                                <div className="content-side">
                                    <div className="section-header">
                                        <FileText className="section-icon" />
                                        <h2>Submission Guidelines</h2>
                                    </div>
                                    <div className="guidelines-text">
                                        <p>All submissions must be original, unpublished work not currently under review elsewhere.</p>
                                        <ul className="rule-list">
                                            <li><strong>Paper Length:</strong> Maximum 8 pages (excluding references).</li>
                                            <li><strong>Format:</strong> Must follow the official {settings.shortName} template (Two-column format).</li>
                                            <li><strong>Anonymity:</strong> Double-blind review process. Remove all author names.</li>
                                            <li><strong>File Type:</strong> PDF only for initial submission.</li>
                                        </ul>
                                    </div>
                                </div>

                                <aside className="sidebar-side">
                                    <div className="glass-card template-card">
                                        <h3>Author Templates</h3>
                                        <p>Use these templates to ensure your paper meets formatting requirements.</p>
                                        <div className="button-stack">
                                            {templates.length > 0 ? (
                                                templates.map((template) => (
                                                    <a
                                                        key={template.id}
                                                        href={template.fileUrl}
                                                        download
                                                        className="template-btn"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <div className="template-info">
                                                            <span className={`tag ${template.title.toLowerCase().includes('latex') || template.title.toLowerCase().includes('tex') ? 'tex' : 'doc'}`}>
                                                                {template.title.toLowerCase().includes('latex') || template.title.toLowerCase().includes('tex') ? 'TEX' : 'DOC'}
                                                            </span>
                                                            {template.title}
                                                        </div>
                                                        <Download size={16} />
                                                    </a>
                                                ))
                                            ) : (
                                                <div className="no-templates">
                                                    <AlertCircle size={20} />
                                                    <p>Templates will be available soon. Please contact <a href={`mailto:${settings.social?.email || 'support@wars26.com'}`}>{settings.social?.email || 'support@wars26.com'}</a> for assistance.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </section>

                    {/* 6. FAQ Section */}
                    <section className="faq-section">
                        <div className="container">
                            <h2 className="faq-heading">Frequently Asked Questions</h2>
                            <div className="faq-list">
                                {[
                                    { q: "Can I update my paper after submission?", a: "Yes, you can update your submission details and upload a new version until the deadline." },
                                    { q: "Do you accept student papers?", a: "Absolutely. We encourage submissions from students. There will be a Best Student Paper award." },
                                    { q: "Will the proceedings be indexed?", a: `Yes, all accepted papers will be published in the ${settings.shortName} Conference Proceedings and indexed in IEEE Xplore.` }
                                ].map((faq, i) => (
                                    <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
                                        <button onClick={() => toggleFaq(i)} className="faq-question">
                                            {faq.q}
                                            {activeFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        <div className="faq-answer">
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <style jsx>{`
                .page-wrapper { opacity: 0; transition: opacity 0.8s ease; }
                .page-wrapper.mounted { opacity: 1; }

                /* Animations */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 15px rgba(91, 77, 255, 0.2); }
                    50% { box-shadow: 0 0 30px rgba(91, 77, 255, 0.6); }
                    100% { box-shadow: 0 0 15px rgba(91, 77, 255, 0.2); }
                }

                @keyframes breathe {
                    0% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.6; }
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                /* 1. Hero Styles */
                .hero-section {
                    position: relative;
                    padding: 160px 0 240px;
                    text-align: center;
                    overflow: hidden;
                    background: #0D0B1E;
                    color: white;
                    transition: background 0.3s ease, color 0.3s ease;
                }
                :global([data-theme="light"]) .hero-section {
                    background: linear-gradient(180deg, #FFFFFF 0%, #F5F8FF 100%);
                    color: var(--foreground);
                    /* Remove border/shadow to prevent line crashing */
                    border-top: none;
                    box-shadow: none;
                }

                .hero-bg {
                    position: absolute; inset: 0;
                    background: linear-gradient(to bottom, rgba(13, 11, 30, 0.8), #0D0B1E), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000");
                    background-size: cover; background-position: center;
                    opacity: 0.6; z-index: 0;
                    /* Use breathe animation instead of shadow pulse which is invisible on bg */
                    animation: breathe 15s infinite ease-in-out; 
                }
                :global([data-theme="light"]) .hero-bg {
                    opacity: 0.05;
                    filter: saturate(0); 
                    animation: none; /* No movement in light mode for cleaner look */
                }

                .hero-content { 
                    position: relative; z-index: 10; 
                    opacity: 0;
                    animation: fadeInUp 1s ease-out forwards;
                }
                .hero-badge {
                    display: inline-block; padding: 6px 16px; border-radius: 20px;
                    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);
                    color: #5B4DFF;
                    font-size: 0.85rem; letter-spacing: 1px; font-weight: 600;
                    margin-bottom: 24px;
                    backdrop-filter: blur(4px);
                }
                :global([data-theme="light"]) .hero-badge {
                    background: rgba(91, 77, 255, 0.1);
                    border-color: rgba(91, 77, 255, 0.2);
                }

                .hero-title { 
                    font-size: 4rem; font-weight: 800; margin-bottom: 20px; line-height: 1.1; 
                    text-shadow: 0 0 40px rgba(91, 77, 255, 0.3);
                    color: inherit;
                }
                :global([data-theme="light"]) .hero-title {
                    text-shadow: none;
                    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle { font-size: 1.25rem; opacity: 0.8; max-width: 700px; margin: 0 auto 40px; color: inherit; }
                
                .countdown-grid { display: flex; justify-content: center; gap: 40px; color: inherit; }
                .countdown-val { 
                    font-size: 3rem; font-weight: 700; display: block; line-height: 1; 
                    font-variant-numeric: tabular-nums;
                    text-shadow: 0 0 20px rgba(91, 77, 255, 0.3);
                }
                :global([data-theme="light"]) .countdown-val {
                    text-shadow: none;
                    color: var(--primary);
                }
                .countdown-label { font-size: 0.75rem; letter-spacing: 2px; opacity: 0.6; margin-top: 8px; display: block; }

                /* 2. Form Styles */
                .form-section {
                    position: relative; z-index: 20;
                    margin-top: -180px;
                    margin-bottom: 80px;
                    opacity: 0;
                    animation: fadeInUp 1s ease-out 0.3s forwards;
                }
                .submission-card {
                    max-width: 800px; margin: 0 auto;
                    background: rgba(13, 11, 30, 0.8);
                    backdrop-filter: blur(24px); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    box-shadow: 0 20px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05);
                    border-radius: 24px;
                    transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.3s ease;
                    color: white;
                }
                /* Light Mode Submission Card */
                :global([data-theme="light"]) .submission-card {
                    background: rgba(255, 255, 255, 0.75) !important;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    color: var(--text-primary);
                }

                .submission-card:hover {
                    box-shadow: 0 30px 100px rgba(91, 77, 255, 0.15), inset 0 0 0 1px rgba(255,255,255,0.1);
                }
                :global([data-theme="light"]) .submission-card:hover {
                    box-shadow: 0 25px 60px rgba(91, 77, 255, 0.1);
                }

                .form-header { text-align: center; margin-bottom: 40px; }
                .form-header h2 { font-size: 2rem; margin-bottom: 10px; }
                .form-header p { opacity: 0.7; }
                .highlight { color: var(--primary); font-weight: bold; text-shadow: 0 0 10px rgba(91, 77, 255, 0.5); }
                :global([data-theme="light"]) .highlight { text-shadow: none; }
                
                .guidance-alert {
                    background: rgba(91, 77, 255, 0.08); border: 1px solid rgba(91, 77, 255, 0.2);
                    border-radius: 12px; padding: 16px; margin-bottom: 24px;
                    display: flex; gap: 12px; align-items: flex-start;
                    font-size: 0.9rem; color: #E0E0E0;
                }
                :global([data-theme="light"]) .guidance-alert {
                    background: rgba(91, 77, 255, 0.05);
                    border-color: rgba(91, 77, 255, 0.2);
                    color: var(--text-secondary);
                }

                .guidance-icon { color: var(--primary); flex-shrink: 0; margin-top: 2px; }
                .guidance-text { line-height: 1.5; }
                .link-btn {
                    background: none; border: none; padding: 0; margin: 0;
                    color: #5B4DFF; font-weight: 600; cursor: pointer;
                    text-decoration: underline; margin-left: 6px;
                }
                .link-btn:hover { color: white; }
                :global([data-theme="light"]) .link-btn:hover { color: var(--primary-hover); }

                .submission-form { display: flex; flex-direction: column; gap: 24px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .input-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; opacity: 0.9; color: inherit; }
                
                .input-group input {
                    width: 100%; padding: 14px 16px; border-radius: 12px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    color: white; outline: none; transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                :global([data-theme="light"]) .input-group input {
                    background: rgba(255,255,255,0.5);
                    border-color: rgba(0,0,0,0.1);
                    color: var(--text-primary);
                }
                .input-group input:focus { 
                    border-color: #5B4DFF; 
                    background: rgba(255,255,255,0.08); 
                    box-shadow: 0 0 0 4px rgba(91, 77, 255, 0.1);
                }
                :global([data-theme="light"]) .input-group input:focus {
                    background: white;
                }

                .input-group input::placeholder { color: rgba(255, 255, 255, 0.4); }
                :global([data-theme="light"]) .input-group input::placeholder { color: rgba(0, 0, 0, 0.4); }

                .upload-box {
                    position: relative; height: 120px; border: 2px dashed rgba(255,255,255,0.2);
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    transition: 0.3s; background: rgba(255,255,255,0.02);
                    overflow: hidden; cursor: pointer;
                }
                :global([data-theme="light"]) .upload-box {
                    border-color: rgba(0,0,0,0.1);
                    background: rgba(0,0,0,0.02);
                }
                .upload-box:hover { 
                    border-color: var(--primary); 
                    background: rgba(91, 77, 255, 0.08); 
                }
                .upload-content { 
                    text-align: center; pointer-events: none; transition: 0.3s;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                }
                .upload-box:hover .upload-content { transform: scale(1.05); }
                .upload-icon { color: var(--primary); transition: 0.3s; }
                .upload-content span { display: block; font-weight: 500; }
                .upload-content small { display: block; opacity: 0.6; font-size: 0.85rem; }
                .upload-box input[type="file"] {
                    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
                }
                
                .submit-btn { width: 100%; height: 56px; font-size: 1.1rem; margin-top: 10px; }

                /* No Templates Message */
                .no-templates {
                    text-align: center; padding: 20px;
                    background: rgba(255, 193, 7, 0.05); border: 1px solid rgba(255, 193, 7, 0.2);
                    border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #ffc107;
                }
                .no-templates p { margin: 0; line-height: 1.5; font-size: 0.9rem; }
                .no-templates a { color: var(--primary); text-decoration: underline; }

                /* 3. Timeline Styles */
                .timeline-section { padding: 80px 0; }
                .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
                .section-header.center { justify-content: center; flex-direction: column; text-align: center; }
                .section-icon { color: var(--primary); }
                .section-header h2 { font-size: 2rem; }
                
                .timeline-track { position: relative; padding: 40px 0; }
                .timeline-line {
                    position: absolute; top: 50%; left: 0; right: 0; height: 2px;
                    background: linear-gradient(to right, transparent, var(--primary), transparent);
                    opacity: 0.3; z-index: 0;
                    box-shadow: 0 0 10px var(--primary);
                }
                .timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; z-index: 10; }
                .timeline-node { 
                    text-align: center; opacity: 0; 
                    animation: fadeInUp 0.5s ease-out forwards; 
                }
                /* Stagger timeline items */
                .timeline-node:nth-child(1) { animation-delay: 0.2s; }
                .timeline-node:nth-child(2) { animation-delay: 0.4s; }
                .timeline-node:nth-child(3) { animation-delay: 0.6s; }
                .timeline-node:nth-child(4) { animation-delay: 0.8s; }

                .timeline-node:hover .node-dot { transform: scale(1.3); background: white; border-color: var(--primary); }
                
                .node-dot {
                    width: 16px; height: 16px; background: #0D0B1E; border: 2px solid rgba(255,255,255,0.5);
                    border-radius: 50%; margin: 0 auto 20px; box-shadow: 0 0 0 4px #0D0B1E;
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                :global([data-theme="light"]) .node-dot {
                    background: #FFFFFF;
                    border-color: rgba(91, 77, 255, 0.5);
                    box-shadow: 0 0 0 4px #FFFFFF;
                }

                .timeline-node.active .node-dot { 
                    background: var(--primary); border-color: var(--primary); 
                    box-shadow: 0 0 20px var(--primary); 
                    animation: pulseGlow 3s infinite;
                }
                .node-status { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; color: var(--primary); font-weight: bold; }
                .node-status.passed { text-decoration: line-through; opacity: 0.5; }
                .node-date { font-size: 1.25rem; font-weight: bold; margin-bottom: 4px; }
                
                /* FAQ Light Mode Fix */
                .faq-section { padding: 80px 0; background: #0A0818; color: white; transition: background 0.3s ease, color 0.3s ease; }
                :global([data-theme="light"]) .faq-section {
                    background: #FFFFFF;
                    color: var(--text-primary);
                }
                .faq-heading { text-align: center; font-size: 2rem; margin-bottom: 40px; }
                .faq-list { max-width: 800px; margin: 0 auto; display: grid; gap: 16px; }
                .faq-item { 
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; 
                    background: rgba(255,255,255,0.02); overflow: hidden; 
                    transition: background 0.3s ease, border-color 0.3s ease;
                }
                :global([data-theme="light"]) .faq-item {
                    border-color: rgba(0,0,0,0.1);
                    background: #F9FAFB;
                }
                .faq-question {
                    width: 100%; padding: 20px; display: flex; justify-content: space-between; align-items: center;
                    background: transparent; border: none; color: inherit; font-size: 1.1rem; font-weight: 500; cursor: pointer;
                }
                
                .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
                .faq-item.active .faq-answer { max-height: 200px; }
                .faq-answer p { padding: 0 20px 20px; opacity: 0.7; line-height: 1.6; }
                
                /* 4. Tracks Styles */
                .tracks-section { padding: 60px 0; background: rgba(255,255,255,0.02); }
                :global([data-theme="light"]) .tracks-section {
                    background: #F5F5FF;
                    color: var(--text-primary);
                }

                .section-desc { opacity: 0.6; font-size: 1.1rem; max-width: 600px; margin: 10px auto 0; }
                .tracks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 50px; }
                
                .track-card {
                    padding: 30px; transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
                    border: 1px solid rgba(255,255,255,0.05);
                    background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
                    opacity: 0; animation: fadeInUp 0.6s ease-out forwards;
                    display: flex; flex-direction: column;
                }
                :global([data-theme="light"]) .track-card {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    color: var(--text-primary);
                }

                /* Stagger Grid Items */
                .track-card:nth-child(1) { animation-delay: 0.2s; }
                .track-card:nth-child(2) { animation-delay: 0.3s; }
                .track-card:nth-child(3) { animation-delay: 0.4s; }
                .track-card:nth-child(4) { animation-delay: 0.5s; }
                .track-card:nth-child(5) { animation-delay: 0.6s; }
                .track-card:nth-child(6) { animation-delay: 0.7s; }

                .track-card:hover { 
                    transform: translateY(-8px); 
                    border-color: var(--primary); 
                    box-shadow: 0 15px 40px rgba(91, 77, 255, 0.2); 
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                }
                :global([data-theme="light"]) .track-card:hover { 
                    background: white;
                    box-shadow: 0 20px 40px rgba(91, 77, 255, 0.15);
                }

                .track-icon { 
                    width: 48px; height: 48px; background: rgba(255,255,255,0.05); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; 
                    margin-bottom: 20px; color: var(--primary); 
                    transition: 0.4s ease;
                }
                :global([data-theme="light"]) .track-icon {
                    background: rgba(91, 77, 255, 0.1);
                }
                .track-card:hover .track-icon { 
                    background: var(--primary); color: white; transform: rotate(10deg); 
                }

                .track-card h3 { font-size: 1.25rem; margin-bottom: 16px; }
                .track-card ul { list-style: none; padding: 0; }
                .track-card li { font-size: 0.9rem; opacity: 0.6; margin-bottom: 8px; padding-left: 12px; position: relative; }
                .track-card li::before { content: "•"; position: absolute; left: 0; color: var(--primary); }

                /* 5. Guidelines Styles */
                .guidelines-section { padding: 80px 0; }
                :global([data-theme="light"]) .guidelines-section {
                    background: white;
                    color: var(--text-primary);
                }

                .split-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 60px; }
                .guidelines-text p { font-size: 1.1rem; opacity: 0.8; margin-bottom: 24px; }
                .rule-list { list-style: none; padding: 0; display: grid; gap: 16px; }
                .rule-list li { 
                    padding: 16px; background: rgba(255,255,255,0.03); 
                    border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
                    transition: 0.3s;
                }
                :global([data-theme="light"]) .rule-list li {
                    background: #F9FAFB;
                    border-color: rgba(0,0,0,0.1);
                    color: var(--text-primary);
                }

                .rule-list li:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }
                .rule-list strong { color: var(--primary); margin-right: 8px; }

                .template-card { padding: 30px; }
                .template-card h3 { font-size: 1.2rem; margin-bottom: 10px; }
                .template-card p { opacity: 0.6; font-size: 0.9rem; margin-bottom: 24px; }
                .button-stack { display: flex; flex-direction: column; gap: 12px; }
                .template-btn {
                    display: flex; align-items: center; justify-content: space-between;
                    width: 100%; padding: 12px 16px; border-radius: 8px;
                    background: transparent; border: 1px solid rgba(255,255,255,0.1);
                    color: white; cursor: pointer; transition: 0.2s;
                }
                :global([data-theme="light"]) .template-btn {
                    border-color: rgba(0,0,0,0.2);
                    color: var(--text-primary);
                }

                .template-btn:hover { border-color: var(--primary); background: rgba(91, 77, 255, 0.05); transform: translateX(5px); }
                :global([data-theme="light"]) .template-btn:hover {
                    background: rgba(91, 77, 255, 0.05);
                    border-color: var(--primary);
                }

                .template-info { display: flex; align-items: center; gap: 10px; font-weight: 500; }
                .tag { font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
                .tag.tex { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .tag.doc { background: rgba(37, 99, 235, 0.2); color: #93c5fd; }

                /* Responsive */
                @media (max-width: 900px) {
                    .form-row, .split-layout, .tracks-grid, .timeline-grid, .countdown-grid { grid-template-columns: 1fr; }
                    .form-section { margin-top: 40px; }
                    .countdown-grid { gap: 20px; }
                    .timeline-line { display: none; }
                    .timeline-node { display: flex; gap: 16px; text-align: left; padding: 10px; }
                    .node-dot { margin: 0; }
                }
            `}</style>
                </div>
            </motion.div>
        </>
    );
}
