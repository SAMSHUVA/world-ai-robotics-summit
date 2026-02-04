'use client';

import React from 'react';
import Reveal from './Reveal';
import StatCounter from './StatCounter';

const IAISRSection: React.FC = () => {
    return (
        <section className="iaisr-section section-margin">
            <Reveal animation="reveal-fade" threshold={0.2}>
                <div className="container">
                    <div className="iaisr-container-premium">
                        {/* Logo Column with Vision Aura */}
                        <div className="iaisr-logo-col">
                            <div className="vision-aura-wrapper">
                                <div className="vision-aura"></div>
                                <div className="vision-aura-inner"></div>
                                <img src="/logo.png" alt="IAISR Logo" className="iaisr-logo-main" />
                            </div>
                        </div>

                        {/* Text Content Column */}
                        <div className="iaisr-content-col">
                            <Reveal animation="reveal-left" delay={200}>
                                <h2 className="iaisr-title-premium">Organized by <span className="title-gradient">IAISR</span></h2>
                            </Reveal>

                            <Reveal animation="reveal-left" delay={400}>
                                <h3 className="iaisr-subtitle-premium">International Association for Innovation and Scientific Research</h3>
                            </Reveal>

                            <Reveal animation="reveal-left" delay={600}>
                                <p className="iaisr-desc-premium">
                                    Bridging global research and future innovation. IAISR is dedicated to fostering a world-class community of scholars and industry leaders to drive scientific progress and sustainable development.
                                </p>
                            </Reveal>

                            <div className="iaisr-stats-premium">
                                {[
                                    { label: 'Countries', value: 50, suffix: '+' },
                                    { label: 'Members', value: 10, suffix: 'k+' },
                                    { label: 'Events', value: 200, suffix: '+' }
                                ].map((stat, i) => (
                                    <Reveal key={i} animation="reveal" delay={800 + (i * 100)}>
                                        <div className="iaisr-stat-card">
                                            <div className="stat-value">
                                                <StatCounter end={stat.value} suffix={stat.suffix} />
                                            </div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            <style jsx>{`
                .iaisr-section {
                    overflow: hidden;
                }

                .iaisr-container-premium {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 60px;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.02);
                    padding: 80px 60px;
                    border-radius: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .iaisr-logo-col {
                    display: flex;
                    justify-content: center;
                    position: relative;
                }

                .vision-aura-wrapper {
                    position: relative;
                    width: 280px;
                    height: 280px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .vision-aura {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px dashed rgba(91, 77, 255, 0.3);
                    border-radius: 50%;
                    animation: rotate-slow 20s linear infinite;
                }

                .vision-aura-inner {
                    position: absolute;
                    width: 80%;
                    height: 80%;
                    border: 1px solid rgba(255, 59, 138, 0.2);
                    border-radius: 50%;
                    animation: rotate-slow 15s linear infinite reverse;
                    filter: blur(2px);
                }

                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .iaisr-logo-main {
                    width: 180px;
                    height: auto;
                    z-index: 2;
                    filter: drop-shadow(0 0 30px rgba(91, 77, 255, 0.4));
                }

                .iaisr-title-premium {
                    font-size: 2.8rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                }

                .iaisr-subtitle-premium {
                    font-size: 1.1rem;
                    color: var(--primary);
                    font-weight: 600;
                    margin-bottom: 24px;
                    opacity: 0.9;
                }

                .iaisr-desc-premium {
                    font-size: 1rem;
                    line-height: 1.8;
                    opacity: 0.7;
                    margin-bottom: 40px;
                    max-width: 600px;
                }

                .iaisr-stats-premium {
                    display: flex;
                    gap: 24px;
                }

                .iaisr-stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 20px 30px;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    flex: 1;
                }

                .iaisr-stat-card:hover {
                    background: rgba(91, 77, 255, 0.08);
                    border-color: rgba(91, 77, 255, 0.3);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: white;
                }

                .stat-label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    opacity: 0.5;
                    font-weight: 600;
                }

                @media (max-width: 992px) {
                    .iaisr-container-premium {
                        grid-template-columns: 1fr;
                        padding: 60px 20px;
                        text-align: center;
                    }
                    .iaisr-title-premium {
                        font-size: 2.2rem;
                    }
                    .iaisr-desc-premium {
                        margin: 0 auto 40px;
                    }
                    .iaisr-stats-premium {
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 16px;
                    }
                    .iaisr-stat-card {
                        min-width: 140px;
                        padding: 15px 20px;
                    }
                    .vision-aura-wrapper {
                        margin: 0 auto;
                        width: 220px;
                        height: 220px;
                        max-width: 100%;
                    }
                    .iaisr-logo-main {
                        width: 140px;
                    }
                }

                @media (max-width: 480px) {
                    .iaisr-title-premium {
                        font-size: 1.8rem;
                    }
                    .vision-aura-wrapper {
                        width: 180px;
                        height: 180px;
                    }
                    .iaisr-logo-main {
                        width: 110px;
                    }
                    .iaisr-stat-card {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
};

export default IAISRSection;
