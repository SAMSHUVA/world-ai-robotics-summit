"use client";
import React from 'react';
import { FileText, ArrowRight, Bell } from 'lucide-react';

const LatestBlogs: React.FC = () => {
    return (
        <section className="latest-blogs-section">
            <div className="container">
                <div className="section-header">
                    <div className="header-left">
                        <span className="section-label">LATEST FROM THE SUMMIT</span>
                        <h2 className="section-title">Insights & <span className="gradient-text">Featured Posts</span></h2>
                    </div>
                </div>

                <div className="coming-soon-container glass-card">
                    <div className="coming-soon-content">
                        <div className="icon-wrapper">
                            <FileText size={40} className="floating-icon" />
                        </div>
                        <h3 className="coming-soon-title">Knowledge Base <span className="highlight-text">Coming Soon for AgTech 2026</span></h3>
                        <p className="coming-soon-text">
                            We're curating exclusive insights, session summaries, and expert interviews from the AgTech Transformation Summit 2026.
                            Stay tuned for groundbreaking updates.
                        </p>
                        <div className="coming-soon-footer">
                            <span className="launch-tag">
                                <Bell size={16} /> Notification System Launching Shortly
                            </span>
                            <a href="/blog" className="explore-btn">
                                Visit Blog <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .latest-blogs-section {
                    padding: 100px 0;
                    background: var(--bg-secondary);
                    position: relative;
                    overflow: hidden;
                }

                .section-header {
                    margin-bottom: 50px;
                }

                .section-label {
                    display: inline-block;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.85rem;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: 2.8rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                }

                .gradient-text {
                    background: linear-gradient(135deg, var(--primary) 0%, #4facfe 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .coming-soon-container {
                    padding: 80px 40px;
                    border-radius: 30px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    position: relative;
                }

                :global([data-theme="light"]) .coming-soon-container {
                    background: rgba(255, 255, 255, 0.6);
                    border-color: rgba(0, 0, 0, 0.05);
                }

                .coming-soon-content {
                    max-width: 600px;
                }

                .icon-wrapper {
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: center;
                }

                .floating-icon {
                    color: var(--primary);
                    filter: drop-shadow(0 0 15px rgba(var(--primary-rgb), 0.3));
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .coming-soon-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 20px;
                }

                .highlight-text {
                    color: var(--primary);
                }

                .coming-soon-text {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--text-secondary);
                    margin-bottom: 40px;
                    opacity: 0.9;
                }

                .coming-soon-footer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .launch-tag {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.1);
                    padding: 8px 16px;
                    border-radius: 30px;
                }

                .explore-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1rem;
                    padding: 14px 32px;
                    background: var(--gradient-main);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
                }

                .explore-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(var(--primary-rgb), 0.3);
                }

                @media (max-width: 768px) {
                    .section-title {
                        font-size: 2.2rem;
                    }
                    .coming-soon-container {
                        padding: 60px 24px;
                    }
                    .coming-soon-title {
                        font-size: 1.6rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default LatestBlogs;
