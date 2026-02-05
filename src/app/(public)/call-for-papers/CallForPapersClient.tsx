'use client';

import React, { useState, useEffect } from 'react';

interface CallForPapersClientProps {
    faqSection: React.ReactNode;
}

export default function CallForPapersClient({ faqSection }: CallForPapersClientProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Live Countdown Logic
    useEffect(() => {
        const targetDate = new Date('May 22, 2026 09:00:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                days: days.toString().padStart(2, '0'),
                hours: hours.toString().padStart(2, '0'),
                mins: mins.toString().padStart(2, '0'),
                secs: secs.toString().padStart(2, '0')
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        try {
            const response = await fetch('/api/paper/submit', {
                method: 'POST',
                body: formData,
            });

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

    if (submitted) {
        return (
            <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Submission Received!</h1>
                    <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '32px' }}>
                        Thank you for submitting your research to WARS '26. Our technical committee will review your abstract and notify you by April 5, 2026.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn">Submit Another Paper</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`hydration-fader ${hasMounted ? 'mounted' : ''}`}>
            <main>
                {/* Header Hero with Live Countdown */}
                <header className="papers-hero" style={{
                    background: 'linear-gradient(rgba(13, 11, 30, 0.9), rgba(13, 11, 30, 0.9)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '120px 0 80px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--glass-border)'
                }}>
                    <div className="container">
                        <h1 className="papers-hero-title">Call for Papers: WARS '26 Singapore</h1>
                        <p className="papers-hero-subtitle">
                            Be part of the World AI & Robotics Summit 2026. Submit your latest research in Artificial Intelligence, Machine Learning, and Autonomous Systems.
                        </p>

                        {/* Real-time Countdown Timer */}
                        <div className="timer-container">
                            {[
                                { val: timeLeft.days, label: 'DAYS' },
                                { val: timeLeft.hours, label: 'HOURS' },
                                { val: timeLeft.mins, label: 'MINS' },
                                { val: timeLeft.secs, label: 'SECS' }
                            ].map((item, i) => (
                                <div key={i} className="timer-box">
                                    <div className="timer-val">{item.val}</div>
                                    <div className="timer-label">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        <a href="#submit-form" className="btn btn-primary-glow" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>Submit Abstract Now →</a>
                    </div>
                </header>

                <div className="container" style={{ marginTop: '80px' }}>
                    <div className="papers-layout">
                        {/* Main Content Area */}
                        <article className="papers-main">
                            {/* Bento Style Grid for Topics */}
                            <section id="topics" style={{ marginBottom: '80px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>💠</span>
                                    <h2 style={{ fontSize: '2rem' }}>Research Topics & Tracks</h2>
                                </div>

                                <div className="bento-grid">
                                    {[
                                        { title: 'Generative AI', desc: 'LLMs, Diffusion Models, and Creative AI architectures.', icon: '✨', span: 'col-2' },
                                        { title: 'Robotics', desc: 'HRI, Bio-inspired systems, and Industry 4.0.', icon: '🤖', span: 'row-2' },
                                        { title: 'Machine Learning', desc: 'Deep Learning, SSL, and Data Science.', icon: '📊', span: '' },
                                        { title: 'Computer Vision', desc: 'Object detection and scene understanding.', icon: '👁️', span: '' },
                                        { title: 'AI Ethics', desc: 'Responsible AI and bias mitigation.', icon: '⚖️', span: 'col-2' },
                                        { title: 'Edge AI & IoT', desc: 'Resource-constrained computing.', icon: '📱', span: '' },
                                        { title: 'Big Data Analysis', desc: 'Scalable processing and predictive modelling.', icon: '🗄️', span: '' },
                                        { title: 'Healthcare AI', desc: 'Diagnostic tools and medical robotics.', icon: '🏥', span: 'col-2' },
                                        { title: 'Cybersecurity', desc: 'Adversarial ML and private computing.', icon: '🛡️', span: '' },
                                    ].map((topic, i) => (
                                        <div key={i} className={`bento-card ${topic.span}`}>
                                            <div className="bento-icon">{topic.icon}</div>
                                            <div className="bento-content">
                                                <h3>{topic.title}</h3>
                                                <p>{topic.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Submission Guidelines */}
                            <section id="guidelines" style={{ marginBottom: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>📄</span>
                                    <h2 style={{ fontSize: '2rem' }}>Author Guidelines</h2>
                                </div>
                                <div className="guidelines-stack">
                                    <article className="glass-card guideline-card">
                                        <h4>Originality & Paper Format</h4>
                                        <p>
                                            All submissions must be original and not currently under review by another conference or journal. Papers should be formatted using the official WARS templates (Max 8 pages).
                                        </p>
                                    </article>
                                    <article className="glass-card guideline-card">
                                        <h4>Double-Blind Review Process</h4>
                                        <p>
                                            WARS follows a double-blind peer-review process. Ensure your submission does not contain any identifying information about authors or affiliations.
                                        </p>
                                    </article>
                                </div>
                            </section>

                            {/* Submission Form Section */}
                            <section id="submit-form" className="glass-card submission-form-container">
                                <h2 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Submission Portal</h2>
                                <form className="papers-form" onSubmit={handleSubmit}>
                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label htmlFor="authorName">Author Name</label>
                                            <input type="text" id="authorName" name="authorName" required placeholder="John Doe" className="papers-input" />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="email">Email Address</label>
                                            <input type="email" id="email" name="email" required placeholder="john@university.edu" className="papers-input" />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label htmlFor="country">Country</label>
                                            <input type="text" id="country" name="country" required placeholder="e.g. Singapore" className="papers-input" />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="whatsappNumber">WhatsApp / Phone</label>
                                            <input type="tel" id="whatsappNumber" name="whatsappNumber" required placeholder="+65 XXXX XXXX" className="papers-input" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="organization">Paper Title / Organization</label>
                                        <input type="text" id="organization" name="organization" required placeholder="Enter research title" className="papers-input" />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="paper-file">Upload Abstract (PDF/DOCX)</label>
                                        <div className="file-upload-zone">
                                            <span className="upload-icon">📄</span>
                                            <p>Click or drag your abstract here</p>
                                            <input type="file" id="paper-file" name="file" required accept=".pdf,.docx" style={{ marginTop: '10px', width: '100%', cursor: 'pointer' }} />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="btn submit-btn">
                                        {loading ? 'Processing Submission...' : 'Start Submission →'}
                                    </button>
                                </form>
                            </section>

                            {/* FAQ Section for AEO */}
                            {faqSection}
                        </article>

                        {/* Sidebar Area */}
                        <aside className="papers-sidebar">
                            {/* Deadlines Sidebar */}
                            <section className="glass-card sidebar-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div className="sidebar-header-acc">
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📅 Submission Timeline</h3>
                                </div>
                                <div style={{ padding: '30px 24px' }}>
                                    <div className="timeline">
                                        {[
                                            { label: 'Abstract Submission', date: 'March 15, 2026', status: 'OPEN' },
                                            { label: 'Review Notification', date: 'April 05, 2026', status: 'UPCOMING' },
                                            { label: 'Camera Ready Due', date: 'April 20, 2026', status: 'UPCOMING' },
                                            { label: 'Conference Dates', date: 'May 22-24, 2026', status: 'UPCOMING' }
                                        ].map((d, i) => (
                                            <div key={i} className="timeline-item">
                                                <div className={`timeline-dot ${d.status === 'OPEN' ? 'active' : ''}`}></div>
                                                <div className="timeline-status" style={{ color: d.status === 'OPEN' ? 'var(--primary)' : 'inherit' }}>{d.status}</div>
                                                <div className="timeline-label">{d.label}</div>
                                                <div className="timeline-date">{d.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Support Sidebar */}
                            <section className="glass-card sidebar-card help-card">
                                <div className="help-icon">❓</div>
                                <h3>Need Assistance?</h3>
                                <p>
                                    Our technical committee is here to help with your submission questions.
                                </p>
                                <a href="mailto:support@iaisr.org" className="support-link">support@iaisr.org</a>
                            </section>
                        </aside>
                    </div>
                </div>

                <style jsx>{`
                .papers-hero-title { font-size: 3.5rem; margin-bottom: 20px; line-height: 1.1; }
                .papers-hero-subtitle { opacity: 0.8; maxWidth: 800px; margin: 0 auto 40px; fontSize: 1.2rem; line-height: 1.6; }
                
                .timer-container { display: flex; justify-content: center; gap: 20px; marginBottom: 40px; }
                .timer-box { 
                    width: 100px; padding: 20px 10px; background: rgba(255,255,255,0.05); 
                    border-radius: 12px; border: 1px solid var(--glass-border); backdrop-filter: blur(10px);
                }
                .timer-val { font-size: 2rem; font-weight: bold; color: var(--primary); }
                .timer-label { font-size: 0.7rem; opacity: 0.6; letter-spacing: 1px; }

                .papers-layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 60px; }
                .papers-main { display: flex; flex-direction: column; }
                .papers-sidebar { display: flex; flex-direction: column; gap: 30px; }

                /* Bento Grid Styles */
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: 180px;
                    gap: 20px;
                }
                .bento-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: default;
                    position: relative;
                    overflow: hidden;
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bento-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: scale(1.02);
                    border-color: var(--primary);
                    box-shadow: 0 10px 30px rgba(91, 77, 255, 0.2);
                }
                .bento-card.col-2 { grid-column: span 2; }
                .bento-card.row-2 { grid-row: span 2; }
                .bento-icon { font-size: 2.2rem; margin-bottom: auto; position: absolute; top: 24px; left: 24px; }
                .bento-content h3 { font-size: 1.15rem; margin-bottom: 8px; }
                .bento-content p { font-size: 0.85rem; opacity: 0.6; line-height: 1.4; }

                .guidelines-stack { display: grid; gap: 20px; }
                .guideline-card { border-left: 4px solid var(--primary); padding: 24px; }
                
                .papers-input {
                    width: 100%; padding: 14px; background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border); border-radius: 8px; color: white; margin-top: 8px;
                    transition: all 0.2s ease;
                }
                .papers-input:focus { border-color: var(--primary); background: rgba(255,255,255,0.08); outline: none; }

                .file-upload-zone {
                    border: 2px dashed var(--glass-border); border-radius: 12px; padding: 40px; text-align: center;
                    background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.3s ease;
                    position: relative;
                }
                .file-upload-zone:hover { border-color: var(--primary); background: rgba(91, 77, 255, 0.05); }
                .upload-icon { font-size: 2.5rem; display: block; margin-bottom: 15px; }

                .submit-btn { width: 100%; height: 56px; font-size: 1.1rem; margin-top: 20px; box-shadow: 0 4px 15px rgba(91, 77, 255, 0.3); }

                .sidebar-header-acc { background: var(--primary); padding: 20px; text-align: center; }
                .timeline { display: flex; flex-direction: column; }
                .timeline-item { position: relative; padding-left: 30px; padding-bottom: 30px; border-left: 2px solid var(--glass-border); }
                .timeline-item:last-child { border-left-color: transparent; padding-bottom: 0; }
                .timeline-dot { position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.2); }
                .timeline-dot.active { background: var(--primary); box-shadow: 0 0 10px var(--primary); }
                .timeline-status { font-size: 0.75rem; font-weight: bold; margin-bottom: 4px; }
                .timeline-label { font-weight: 600; margin-bottom: 4px; }
                .timeline-date { font-size: 0.85rem; opacity: 0.6; }

                .help-card { text-align: center; }
                .help-icon { font-size: 2.5rem; margin-bottom: 15px; }
                .support-link { color: var(--primary); font-weight: bold; text-decoration: underline; }

                /* Responsive Fixes */
                @media (max-width: 1024px) {
                    .papers-layout { grid-template-columns: 1fr; gap: 40px; }
                    .papers-sidebar { order: 2; }
                    .papers-main { order: 1; }
                }

                @media (max-width: 768px) {
                    .papers-hero { padding: 80px 0 40px; }
                    .papers-hero-title { font-size: 2rem; }
                    .papers-hero-subtitle { font-size: 1rem; }
                    .timer-container { gap: 10px; overflow-x: auto; padding-bottom: 10px; justify-content: flex-start; }
                    .timer-box { min-width: 80px; padding: 15px 5px; }
                    .timer-val { font-size: 1.5rem; }
                    
                    .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
                    .bento-card.col-2 { grid-column: span 1; }
                    .bento-card.row-2 { grid-row: span 1; }
                    .bento-card { height: 160px; padding: 20px; }
                    .bento-icon { top: 20px; left: 20px; font-size: 1.5rem; }
                    
                    .submission-form-container { padding: 24px; }
                }
            `}</style>
            </main>
        </div>
    );
}
