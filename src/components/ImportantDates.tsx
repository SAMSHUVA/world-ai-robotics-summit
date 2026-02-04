'use client';

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
                                    { name: "Abstract Submission", status: "March 15, 2026", date: new Date("2026-03-15"), isPrimary: true },
                                    { name: "Early Bird Deadline", status: "APR 05", date: new Date("2026-04-05") },
                                    { name: "Standard Registration", status: "APR 20", date: new Date("2026-04-20") },
                                    { name: "Late Registration", status: "MAY 15", date: new Date("2026-05-15") },
                                    { name: "Conference Dates", status: "MAY 22", date: new Date("2026-05-22") }
                                ].map((item, idx) => {
                                    const now = new Date("2026-02-04");
                                    const totalWindow = 120 * 24 * 60 * 60 * 1000;
                                    const timeRem = item.date.getTime() - now.getTime();
                                    const progress = Math.max(0, Math.min(100, (timeRem / totalWindow) * 100));

                                    // Color Theory: Green (Safe), Yellow (Attention), Red (Urgent)
                                    const getThemeColor = () => {
                                        if (timeRem < 0) return '#333';
                                        if (progress > 50) return '#27c93f';
                                        if (progress > 25) return '#ffbd2e';
                                        return '#ff4b4b';
                                    };

                                    const themeColor = getThemeColor();
                                    const isUrgent = progress <= 25 && timeRem > 0;

                                    return (
                                        <Reveal key={idx} animation="reveal-left" index={idx} stagger={100} delay={600}>
                                            <div className={`deadline-item-wrapper ${item.isPrimary ? 'primary-deadline' : ''} ${isUrgent ? 'pulse-urgent' : ''}`}>
                                                <div className="deadline-item-interactive">
                                                    <div className="di-row">
                                                        <span className="di-name" style={{ color: isUrgent ? '#ff4b4b' : 'inherit' }}>{item.name}</span>
                                                        <span className={`di-status ${timeRem < 0 ? 'passed' : ''}`} style={{ color: themeColor }}>{item.status}</span>
                                                    </div>

                                                    <div className="di-progress-container" style={{ borderColor: isUrgent ? 'rgba(255, 75, 75, 0.2)' : 'transparent' }}>
                                                        <div
                                                            className="di-progress-bar-fill"
                                                            style={{
                                                                width: `${progress}%`,
                                                                background: `linear-gradient(90deg, ${themeColor} 0%, ${isUrgent ? '#ff1f1f' : themeColor} 100%)`,
                                                                boxShadow: `0 0 12px ${themeColor}66`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>

                            <style jsx>{`
                                .deadline-item-wrapper {
                                    padding: 15px 0;
                                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                                    cursor: pointer;
                                    position: relative;
                                }

                                .pulse-urgent {
                                    animation: urgency-pulse 2s infinite ease-in-out;
                                }

                                @keyframes urgency-pulse {
                                    0% { background: transparent; }
                                    50% { background: rgba(255, 75, 75, 0.05); }
                                    100% { background: transparent; }
                                }

                                .deadline-item-interactive:hover {
                                    transform: translateX(10px);
                                }

                                .deadline-item-wrapper:hover {
                                    background: rgba(255, 255, 255, 0.03);
                                    border-bottom-color: rgba(255, 255, 255, 0.1);
                                }

                                .primary-deadline {
                                    padding: 24px 20px;
                                    background: rgba(255, 255, 255, 0.02);
                                    border-radius: 12px;
                                    margin-bottom: 10px;
                                }

                                .primary-deadline .di-name {
                                    font-size: 0.7rem;
                                    text-transform: uppercase;
                                    letter-spacing: 2.5px;
                                    margin-bottom: 8px;
                                    opacity: 0.6;
                                }

                                .primary-deadline .di-status {
                                    font-size: 1.8rem;
                                    font-weight: 800;
                                    display: block;
                                }

                                .di-row {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    margin-bottom: 12px;
                                }

                                .di-name {
                                    font-weight: 500;
                                    font-size: 1rem;
                                }

                                .di-status {
                                    font-size: 0.9rem;
                                    font-weight: 600;
                                    opacity: 0.8;
                                }

                                .di-progress-container {
                                    height: 4px;
                                    background: rgba(255, 255, 255, 0.05);
                                    border-radius: 2px;
                                    overflow: hidden;
                                    width: 100%;
                                    max-width: 250px;
                                }

                                .di-progress-bar-fill {
                                    height: 100%;
                                    transition: width 1s ease-in-out;
                                    border-radius: 2px;
                                }

                                .deadline-item-wrapper:hover .di-progress-bar-fill {
                                    box-shadow: 0 0 15px currentColor;
                                    filter: brightness(1.2);
                                }

                                .passed { opacity: 0.3; text-decoration: line-through; }
                            `}</style>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ImportantDates;
