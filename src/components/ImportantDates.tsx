import React from 'react';
import Reveal from './Reveal';

const ImportantDates = () => {
    return (
        <section className="container section-margin">
            <div className="dates-redesign-grid">
                {/* Left Column: Info & Theme */}
                <div className="dates-left-col">
                    <Reveal animation="reveal-left" delay={100}>
                        <div className="dates-meta-row">
                            <div className="dm-item">
                                <span className="dm-value text-gradient">May 22-24</span>
                                <span className="dm-label">Conference Dates</span>
                            </div>
                            <div className="dm-divider"></div>
                            <div className="dm-item">
                                <span className="dm-value text-gradient">Hybrid</span>
                                <span className="dm-label">Event Format</span>
                            </div>
                            <div className="dm-divider"></div>
                            <div className="dm-item">
                                <span className="dm-value text-gradient">Singapore</span>
                                <span className="dm-label">Venue Location</span>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={300}>
                        <h2 className="dates-main-heading">Redefining Scientific Exchange</h2>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={500}>
                        <p className="dates-main-desc">
                            The World AI & Robotics Summit 2026 aims to be a premier platform for presenting and discussing new developments in autonomous systems and cognitive computing. This year, we emphasize an immersive experience, connecting global innovators.
                        </p>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={700}>
                        <div className="dates-theme-box">
                            <span className="theme-bulb-icon">💡</span>
                            <div className="theme-content">
                                <h4 className="theme-box-title">Theme 2026</h4>
                                <h3 className="theme-box-heading">Advances in Quantum Communication & Large Scale Systems</h3>
                                <p className="theme-box-desc">Exploring the intersection of quantum resilience and decentralized networks.</p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Column: Deadlines Card */}
                <div className="dates-right-col">
                    <Reveal animation="reveal" delay={400}>
                        <div className="deadlines-card">
                            <div className="dc-header">
                                <h3>Upcoming Deadlines</h3>
                                <a href="/call-for-papers" className="dc-view-all">VIEW ALL</a>
                            </div>

                            <div className="deadline-list">
                                {[
                                    { name: "Abstract Submission", status: "OPEN", date: "March 15, 2026", active: true },
                                    { name: "Early Bird Deadline", status: "APR 05" },
                                    { name: "Standard Registration", status: "APR 20" },
                                    { name: "Late Registration", status: "MAY 15" },
                                    { name: "Conference Dates", status: "MAY 22" }
                                ].map((item, idx) => (
                                    <Reveal key={idx} animation="reveal-left" index={idx} stagger={100} delay={600}>
                                        <div className={`deadline-item ${item.active ? 'active' : ''}`}>
                                            <div className="di-row">
                                                <span className="di-name">{item.name}</span>
                                                <span className="di-status ${item.active ? 'open' : ''}">{item.status}</span>
                                            </div>
                                            {item.date && <div className="di-date-highlight">{item.date}</div>}
                                            {item.active && <div className="di-progress-bar"></div>}
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ImportantDates;
