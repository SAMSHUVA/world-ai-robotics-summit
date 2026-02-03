import React from 'react';

const ImportantDates = () => {
    return (
        <section className="container section-margin">
            <div className="dates-redesign-grid">
                {/* Left Column: Info & Theme */}
                <div className="dates-left-col">
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

                    <h2 className="dates-main-heading">Redefining Scientific Exchange</h2>

                    <p className="dates-main-desc">
                        The World AI & Robotics Summit 2026 aims to be a premier platform for presenting and discussing new developments in autonomous systems and cognitive computing. This year, we emphasize an immersive experience, connecting global innovators.
                    </p>

                    <div className="dates-theme-box">
                        <span className="theme-bulb-icon">💡</span>
                        <div className="theme-content">
                            <h4 className="theme-box-title">Theme 2026</h4>
                            <h3 className="theme-box-heading">Advances in Quantum Communication & Large Scale Systems</h3>
                            <p className="theme-box-desc">Exploring the intersection of quantum resilience and decentralized networks.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Deadlines Card */}
                <div className="dates-right-col">
                    {/* Removed glass-card class to remove outer box style as requested */}
                    <div className="deadlines-card">
                        <div className="dc-header">
                            <h3>Upcoming Deadlines</h3>
                            <a href="/call-for-papers" className="dc-view-all">VIEW ALL</a>
                        </div>

                        <div className="deadline-list">
                            <div className="deadline-item active">
                                <div className="di-row">
                                    <span className="di-name">Abstract Submission</span>
                                    <span className="di-status open">OPEN</span>
                                </div>
                                <div className="di-date-highlight">March 15, 2026</div>
                                <div className="di-progress-bar"></div>
                            </div>

                            <div className="deadline-item">
                                <div className="di-row">
                                    <span className="di-name">Early Bird Deadline</span>
                                    <span className="di-status">APR 05</span>
                                </div>
                            </div>

                            <div className="deadline-item">
                                <div className="di-row">
                                    <span className="di-name">Standard Registration</span>
                                    <span className="di-status">APR 20</span>
                                </div>
                            </div>

                            <div className="deadline-item">
                                <div className="di-row">
                                    <span className="di-name">Late Registration</span>
                                    <span className="di-status">MAY 15</span>
                                </div>
                            </div>

                            <div className="deadline-item">
                                <div className="di-row">
                                    <span className="di-name">Conference Dates</span>
                                    <span className="di-status">MAY 22</span>
                                </div>
                            </div>
                        </div>

                        {/* Removed Download Button as requested */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImportantDates;
