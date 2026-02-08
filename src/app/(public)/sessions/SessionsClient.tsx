'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SessionsClientProps {
    conferenceDate?: string;
}

export default function SessionsClient({ conferenceDate }: SessionsClientProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Generate 3 days starting from conferenceDate
    const getDates = () => {
        const start = conferenceDate ? new Date(conferenceDate) : new Date('2026-05-22');
        const days = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    };

    const dates = getDates();

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hasMounted ? 1 : 0, y: hasMounted ? 0 : 20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="container" style={{ padding: '40px 20px', paddingTop: 'clamp(160px, 15vw, 200px)' }}>
                    <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                        <h1 className="neural-drift" style={{ fontSize: '3rem', marginBottom: '16px', '--delay': '0s' } as React.CSSProperties}>WARS '26 Schedule</h1>
                        <p className="neural-drift" style={{ opacity: 0.6, '--delay': '0.1s' } as React.CSSProperties}>7th World AI & Robotics Summit | Singapore, Marina Bay Sands</p>
                    </header>

                    {/* Tabs Placeholder */}
                    <div className="neural-drift" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', '--delay': '0.2s' } as React.CSSProperties}>
                        {dates.map((d, i) => (
                            <button key={d} className="btn" style={{ background: i === 0 ? 'var(--primary)' : 'transparent', border: '1px solid var(--glass-border)' }}>
                                {d}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        {[
                            { time: "09:00 AM", title: "Opening Keynote: The Future of Embodied AI", speaker: "Dr. Kenji Tanaka", room: "Grand Ballroom", track: "Keynote" },
                            { time: "10:30 AM", title: "Large World Models: Beyond Text", speaker: "Dr. Sarah Miller", room: "Sands Hall A", track: "Generative AI" },
                            { time: "10:30 AM", title: "Collaborative Robots in Surgical Suites", speaker: "Panel Discussion", room: "Sands Hall B", track: "Human-Robotics" },
                            { time: "01:00 PM", title: "Lunch Break & Tech Expo", speaker: "", room: "Exhibition Hall", track: "Social" },
                            { time: "02:30 PM", title: "Workshop: Fine-Tuning Agents for Enterprise", speaker: "Alex Rivera", room: "Innovation Lab", track: "Workshop" },
                        ].map((session, idx) => (
                            <div key={idx} className="glass-card session-row">
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{session.time}</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>{session.track}</div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{session.title}</h3>
                                    {session.speaker && <div style={{ opacity: 0.7 }}>{session.speaker}</div>}
                                </div>
                                <div style={{ textAlign: 'right', opacity: 0.6, fontSize: '0.9rem' }}>
                                    📍 {session.room}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
        </>
    );
}

