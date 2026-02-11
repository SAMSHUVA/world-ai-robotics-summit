"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy, Award as AwardIcon, Medal, Star, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import AwardsModal from "./AwardsModal";

interface AwardsGridProps {
    awards: any[];
    settings: any;
}

export default function AwardsGrid({ awards, settings }: AwardsGridProps) {
    const handleNominateClick = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById('real-nomination-btn')?.click();
    };

    return (
        <section className="container section-margin">
            <Reveal animation="reveal-fade">
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Recognition of Excellence</span>
                    <h2 style={{ fontSize: '3rem', marginTop: '10px', marginBottom: '20px', fontWeight: 800 }}>{settings.awardsTitle}</h2>
                    <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>{settings.awardsDescription}</p>
                </div>
            </Reveal>

            <div className="awards-grid-premium">
                {awards.length > 0 ? (
                    awards.map((award: any, i: number) => {
                        const Icon = [Trophy, AwardIcon, Medal, Star][i % 4];
                        return (
                            <Reveal key={award.id} animation="reveal" index={i} stagger={100} threshold={0.1}>
                                <div className="award-card-premium">
                                    <div className="award-glow"></div>
                                    <div className="award-icon-box">
                                        <Icon size={30} />
                                    </div>
                                    <div className="award-category">{award.category}</div>
                                    <h3 className="award-title-premium">{award.title}</h3>
                                    <p className="award-description">{award.description}</p>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Link
                                            href="#nominate"
                                            onClick={handleNominateClick}
                                            style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            Learn More <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })
                ) : (
                    <>
                        {[
                            { title: 'Best Paper Award', category: 'Research', desc: 'Recognizing outstanding contribution to the field of Agricultural AI and Robotics.', icon: Trophy },
                            { title: 'Young Researcher', category: 'Innovation', desc: 'Encouraging promising researchers under 35 who demonstrate exceptional creativity.', icon: Medal },
                            { title: 'Industry Excellence', category: 'Impact', desc: 'Awarded to projects with the highest potential for real-world field adoption.', icon: AwardIcon }
                        ].map((award, i) => (
                            <Reveal key={i} animation="reveal" index={i} stagger={100} threshold={0.1}>
                                <div className="award-card-premium">
                                    <div className="award-glow" style={{ background: i === 0 ? 'radial-gradient(circle, rgba(255,189,46,0.1) 0%, transparent 70%)' : '' }}></div>
                                    <div className="award-icon-box" style={{ color: i === 0 ? '#ffbd2e' : i === 1 ? '#adb5bd' : '#cd7f32' }}>
                                        <award.icon size={30} />
                                    </div>
                                    <div className="award-category">{award.category}</div>
                                    <h3 className="award-title-premium">{award.title}</h3>
                                    <p className="award-description">{award.desc}</p>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Link
                                            href="#nominate"
                                            onClick={handleNominateClick}
                                            style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            Learn More <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </>
                )}
            </div>

            <Reveal animation="reveal" delay={400} threshold={0.1}>
                <div id="nominate" style={{ marginTop: '60px', textAlign: 'center' }}>
                    <div style={{ display: 'none' }}><AwardsModal /></div>
                    <button
                        id="nomination-trigger"
                        onClick={handleNominateClick}
                        className="btn btn-primary-glow"
                        style={{ padding: '18px 45px', fontSize: '1.2rem', borderRadius: '50px' }}
                    >
                        Submit A Nomination
                    </button>
                    <p style={{ marginTop: '15px', opacity: 0.5, fontSize: '0.9rem' }}>Deadline for nominations: July 15, 2025</p>
                </div>
            </Reveal>
        </section>
    );
}
