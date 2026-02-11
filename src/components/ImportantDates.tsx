'use client';

import React from 'react';
import Reveal from './Reveal';

interface ImportantDate {
    id: number;
    event: string;
    date: string | Date;
    note?: string | null;
    isActive: boolean;
}

interface ImportantDatesProps {
    dates?: ImportantDate[];
    settings?: {
        datesValue?: string;
        datesLabel?: string;
        eventFormat?: string;
        eventFormatLabel?: string;
        venue?: string;
        venueLabel?: string;
        aboutMainTitle?: string;
        themeHeader?: string;
        themeTitle?: string;
        themeDescription?: string;
        deadlinesTitle?: string;
        viewAllText?: string;
    };
}

const ImportantDates: React.FC<ImportantDatesProps> = ({ dates = [], settings = {} }) => {
    const {
        datesValue = "May 22-24",
        datesLabel = "Conference Dates",
        eventFormat = "Hybrid",
        eventFormatLabel = "Event Format",
        venue = "Singapore",
        venueLabel = "Venue Location",
        aboutMainTitle = "The World AI & Robotics Summit 2026 aims to be a premier platform for presenting and discussing new developments in autonomous systems and cognitive computing.",
        themeHeader = "Theme 2026",
        themeTitle = "Advances in Quantum Communication & Large Scale Systems",
        themeDescription = "Exploring the intersection of quantum resilience and decentralized networks.",
        deadlinesTitle = "Upcoming Deadlines",
        viewAllText = "VIEW ALL"
    } = settings;

    // Fallback if no dates provided (or while loading if client-fetched, but we do server-fetch)
    const displayDates = dates.length > 0 ? dates : [];

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="container section-margin">
            <div className="dates-redesign-grid">
                {/* Left Column: Info & Theme */}
                <div className="dates-left-col">
                    <Reveal animation="reveal-left" delay={100}>
                        <div className="dates-meta-row">
                            <div className="dm-item">
                                <span className="dm-value text-gradient">{datesValue}</span>
                                <span className="dm-label">{datesLabel}</span>
                            </div>
                            <div className="dm-divider"></div>
                            <div className="dm-item">
                                <span className="dm-value text-gradient">{eventFormat}</span>
                                <span className="dm-label">{eventFormatLabel}</span>
                            </div>
                            <div className="dm-divider"></div>
                            <div className="dm-item">
                                <span className="dm-value text-gradient">{venue}</span>
                                <span className="dm-label">{venueLabel}</span>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={300}>
                        <h2 className="dates-main-heading">Redefining Scientific Exchange</h2>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={500}>
                        <p className="dates-main-desc">
                            {aboutMainTitle} This year, we emphasize an immersive experience, connecting global innovators.
                        </p>
                    </Reveal>

                    <Reveal animation="reveal-left" delay={700}>
                        <div className="dates-theme-box">
                            <span className="theme-bulb-icon">💡</span>
                            <div className="theme-content">
                                <h4 className="theme-box-title">{themeHeader}</h4>
                                <h3 className="theme-box-heading">{themeTitle}</h3>
                                <p className="theme-box-desc">{themeDescription}</p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Column: Deadlines Card */}
                <div className="dates-right-col">
                    <Reveal animation="reveal" delay={400}>
                        <div className="deadlines-card">
                            <div className="dc-header">
                                <h3>{deadlinesTitle}</h3>
                                <a href="/call-for-papers" className="dc-view-all">{viewAllText}</a>
                            </div>

                            <div className="deadline-list">
                                {displayDates.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>No dates announced yet.</div>
                                ) : (
                                    displayDates.map((item, idx) => {
                                        const itemDate = new Date(item.date);
                                        const now = mounted ? new Date() : itemDate; // Stable initial value on server

                                        // 120 days window for progress bar calculation
                                        const totalWindow = 120 * 24 * 60 * 60 * 1000;
                                        const timeRem = itemDate.getTime() - now.getTime();
                                        const progress = mounted ? Math.max(0, Math.min(100, (timeRem / totalWindow) * 100)) : 0;

                                        // Color Theory: Green (Safe), Yellow (Attention), Red (Urgent)
                                        const getThemeColor = () => {
                                            if (!mounted) return '#333';
                                            if (timeRem < 0) return '#333';
                                            if (progress > 50) return '#27c93f';
                                            if (progress > 25) return '#ffbd2e';
                                            return '#ff4b4b';
                                        };

                                        const themeColor = getThemeColor();
                                        const isUrgent = mounted && progress <= 25 && timeRem > 0;

                                        // Check if this appears to be a "primary" date (e.g. abstract submission)
                                        const isPrimary = item.event.toLowerCase().includes('abstract') || item.event.toLowerCase().includes('conference');

                                        // Format Date for display (e.g., "MAR 15") - Stable across server/client
                                        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                                        const dateStr = `${months[itemDate.getMonth()]} ${itemDate.getDate()}`;

                                        return (
                                            <Reveal key={item.id} animation="reveal-left" index={idx} stagger={100} delay={600}>
                                                <div className={`deadline-item-wrapper ${isPrimary ? 'primary-deadline' : ''} ${isUrgent ? 'pulse-urgent' : ''}`}>
                                                    <div className="deadline-item-interactive">
                                                        <div className="di-row">
                                                            <span className="di-name" style={{ color: isUrgent ? '#ff4b4b' : 'inherit' }}>{item.event}</span>
                                                            <span className={`di-status ${mounted && timeRem < 0 ? 'passed' : ''}`} style={{ color: themeColor }}>{dateStr}</span>
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
                                    })
                                )}
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
