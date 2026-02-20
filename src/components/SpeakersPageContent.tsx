"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SpeakersFAQ from '@/components/SpeakersFAQ';
import SpeakerDetailModal from '@/components/SpeakerDetailModal';
import SpeakerApplicationForm from '@/components/SpeakerApplicationForm';

import { AnimatePresence, motion } from 'framer-motion';

export default function SpeakersPageContent({ initialSpeakers = [], settings }: { initialSpeakers?: any[], settings: any }) {
    const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);
    const [speakers, setSpeakers] = useState<any[]>(initialSpeakers);
    const [isLoading, setIsLoading] = useState(initialSpeakers.length === 0);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        if (initialSpeakers.length > 0) return;

        const fetchSpeakers = async () => {
            try {
                const response = await fetch('/api/speakers');
                const data = await response.json();
                setSpeakers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch speakers:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpeakers();
    }, [initialSpeakers]);

    // Simplified Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Keynote Speaker', 'Session Speaker', 'Panelist'];

    // Filter Logic
    const filteredSpeakers = speakers.filter(s => {
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory || s.type === selectedCategory;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            (s.name || '').toLowerCase().includes(searchLower) ||
            (s.role || '').toLowerCase().includes(searchLower) ||
            (s.affiliation || '').toLowerCase().includes(searchLower) ||
            s.expertise?.some((t: string) => t.toLowerCase().includes(searchLower));

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hasMounted ? 1 : 0, y: hasMounted ? 0 : 20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`hydration-fader ${hasMounted ? 'mounted' : ''}`}
            >
                <div className="container" style={{ padding: 'clamp(160px, 12vw, 180px) 20px 80px' }}>
                    {/* Header Section */}
                    <header style={{ marginBottom: '60px', textAlign: 'center', position: 'relative' }}>

                        <h1 className="neural-drift" style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: '800', '--delay': '0s' } as React.CSSProperties}>{settings.shortName} Speakers</h1>
                        <p className="neural-drift" style={{ opacity: 0.7, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px', '--delay': '0.1s' } as React.CSSProperties}>
                            Leading the conversation on Intelligent Systems in {settings.location}.
                            Join global experts from around the world.
                        </p>

                        {/* Hero CTA Button */}
                        <div className="neural-drift" style={{ marginBottom: '40px', '--delay': '0.2s' } as React.CSSProperties}>
                            <button
                                className="hero-apply-btn"
                                onClick={() => setIsApplicationOpen(true)}
                            >
                                Become a Speaker
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="neural-drift" style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '50px', flexWrap: 'wrap', '--delay': '0.3s' } as React.CSSProperties}>
                            <div className="stat-pill">
                                <span className="stat-num">50+</span>
                                <span className="stat-text">Speakers</span>
                            </div>
                            <div className="stat-pill">
                                <span className="stat-num">30+</span>
                                <span className="stat-text">Sessions</span>
                            </div>
                            <div className="stat-pill">
                                <span className="stat-num">20+</span>
                                <span className="stat-text">Workshops</span>
                            </div>
                        </div>

                        {/* Simplified Search & Category Filter Bar */}
                        <div className="search-filter-bar neural-drift" style={{ '--delay': '0.4s' } as React.CSSProperties}>
                            <div className="search-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search speakers, topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="category-tabs">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* Speakers Grid or Loading State */}
                    {isLoading ? (
                        <div className="speakers-grid">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="speaker-card skeleton-card">
                                    <div className="speaker-image-container skeleton"></div>
                                    <div className="speaker-info">
                                        <div className="skeleton title-skeleton"></div>
                                        <div className="skeleton text-skeleton"></div>
                                        <div className="skeleton text-skeleton short"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredSpeakers.length > 0 ? (
                        <div className="speakers-grid">
                            {filteredSpeakers.map((speaker: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="speaker-card"
                                    onClick={() => setSelectedSpeaker(speaker)}
                                >
                                    <div className="speaker-image-container">
                                        {speaker.photoUrl && !speaker.photoUrl.includes('randomuser') ? (
                                            <Image
                                                src={speaker.photoUrl}
                                                alt={speaker.name}
                                                className="speaker-img"
                                                width={400}
                                                height={400}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="speaker-placeholder-img">
                                                {speaker.photoUrl ? (
                                                    <Image
                                                        src={speaker.photoUrl}
                                                        alt={speaker.name}
                                                        className="speaker-img"
                                                        width={100}
                                                        height={100}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    speaker.name.charAt(0)
                                                )}
                                            </div>
                                        )}

                                        <div className="hover-overlay">
                                            <span className="view-bio-btn">View Biography</span>
                                        </div>

                                        {/* Category Badge */}
                                        {speaker.category && (
                                            <div className="category-badge">{speaker.category}</div>
                                        )}
                                    </div>

                                    <div className="speaker-info">
                                        <h3 className="speaker-name">{speaker.name}</h3>
                                        <div className="speaker-role">{speaker.role}</div>
                                        <div className="speaker-company">{speaker.affiliation}</div>

                                        <div className="speaker-tags">
                                            {speaker.expertise?.slice(0, 2).map((tag: string, i: number) => (
                                                <span key={i} className="mini-tag">{tag}</span>
                                            ))}
                                            {speaker.expertise?.length > 2 && <span className="mini-tag">+{speaker.expertise.length - 2}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No speakers found matching "{searchQuery}"</h3>
                            <p>Try adjusting your search or category filter.</p>
                            <button className="reset-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear Filters</button>
                        </div>
                    )}

                    {/* Application CTA Section */}
                    <div className="application-section">
                        <div className="app-card">
                            <h2>Become a Speaker</h2>
                            <p>Share your expertise with the global AI community. We are looking for visionary talks and technical workshops.</p>
                            <button className="apply-btn" onClick={() => setIsApplicationOpen(true)}>Apply to Speak</button>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <SpeakersFAQ settings={settings} />

                    {/* Application Modal */}
                    <AnimatePresence>
                        {isApplicationOpen && (
                            <div className="modal-overlay" onClick={() => setIsApplicationOpen(false)}>
                                <motion.div
                                    className="modal-content-wrapper"
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <SpeakerApplicationForm onClose={() => setIsApplicationOpen(false)} settings={settings} />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <SpeakerDetailModal
                        isOpen={!!selectedSpeaker}
                        onClose={() => setSelectedSpeaker(null)}
                        speaker={selectedSpeaker}
                        settings={settings}
                    />
                </div>
                <style jsx>{`
                .skeleton {
                    background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                    border-radius: 4px;
                }

                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .skeleton-card {
                    pointer-events: none;
                }

                .title-skeleton {
                    height: 24px;
                    width: 70%;
                    margin-bottom: 10px;
                }

                .text-skeleton {
                    height: 16px;
                    width: 90%;
                    margin-bottom: 6px;
                }

                .text-skeleton.short {
                    width: 50%;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* Search & Filter Bar Styles */
                .search-filter-bar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    margin-bottom: 50px;
                }

                .search-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                }

                .search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 0.5;
                    font-size: 1.2rem;
                    pointer-events: none;
                }
                
                .search-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 16px 20px 16px 54px;
                    border-radius: 40px;
                    color: white;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                    outline: none;
                }
                
                .search-input:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #5B4DFF;
                    box-shadow: 0 0 0 4px rgba(91, 77, 255, 0.1);
                }

                .category-tabs {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .category-tab {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.6);
                    padding: 8px 24px;
                    border-radius: 30px;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                
                .category-tab:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                
                .category-tab.active {
                    background: #5B4DFF;
                    border-color: #5B4DFF;
                    color: white;
                }

                .no-results {
                    text-align: center;
                    padding: 80px 0;
                    opacity: 0.7;
                }

                .reset-btn {
                    margin-top: 16px;
                    background: transparent;
                    color: #5B4DFF;
                    border: none;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .category-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }

                /* Rest of styles unchanged or minimal updates */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .modal-content-wrapper {
                    width: 100%;
                    max-width: 600px;
                }

                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 8px 20px;
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .stat-num {
                    font-weight: 700;
                    color: #5B4DFF;
                    font-size: 1.2rem;
                }
                
                .stat-text {
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    opacity: 0.7;
                }
                
                .speakers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 30px;
                    margin-bottom: 80px;
                }
                
                .speaker-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    cursor: pointer;
                }
                
                .speaker-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(91, 77, 255, 0.3);
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
                }
                
                .speaker-image-container {
                    height: 320px;
                    background: #151325;
                    position: relative;
                    overflow: hidden;
                }
                
                .speaker-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }
                
                .speaker-card:hover .speaker-img {
                    transform: scale(1.05);
                }
                
                .speaker-placeholder-img {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 5rem;
                    color: rgba(255, 255, 255, 0.1);
                    font-weight: 800;
                    background: linear-gradient(135deg, #1A1825 0%, #0F0D15 100%);
                }
                
                .hover-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(91, 77, 255, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .speaker-card:hover .hover-overlay {
                    opacity: 1;
                }
                
                .view-bio-btn {
                    color: white;
                    font-weight: 600;
                    border: 2px solid white;
                    padding: 10px 24px;
                    border-radius: 30px;
                    transform: translateY(20px);
                    transition: transform 0.3s;
                }
                
                .speaker-card:hover .view-bio-btn {
                    transform: translateY(0);
                }
                
                .speaker-info {
                    padding: 24px;
                }
                
                .speaker-name {
                    font-size: 1.5rem;
                    margin-bottom: 6px;
                    color: white;
                }
                
                .speaker-role {
                    color: #A39BFF;
                    font-size: 0.95rem;
                    margin-bottom: 4px;
                    font-weight: 500;
                }
                
                .speaker-company {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.9rem;
                    margin-bottom: 16px;
                }
                
                .speaker-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .mini-tag {
                    font-size: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 4px 10px;
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .application-section {
                    margin-top: 60px;
                    text-align: center;
                }
                
                .app-card {
                    background: linear-gradient(135deg, rgba(91, 77, 255, 0.1) 0%, rgba(91, 77, 255, 0.05) 100%);
                    border: 1px solid rgba(91, 77, 255, 0.2);
                    border-radius: 24px;
                    padding: 60px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .app-card h2 {
                    font-size: 2.5rem;
                    margin-bottom: 16px;
                }
                
                .app-card p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                    margin-bottom: 30px;
                }
                
                .apply-btn {
                    background: white;
                    color: black;
                    padding: 14px 32px;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                @keyframes glowingAura {
                    0% {
                        box-shadow: 0 0 0 0 rgba(91, 77, 255, 0.4);
                        background-position: 0% 50%;
                    }
                    50% {
                        box-shadow: 0 0 20px 10px rgba(91, 77, 255, 0);
                        background-position: 100% 50%;
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(91, 77, 255, 0);
                        background-position: 0% 50%;
                    }
                }

                .hero-apply-btn {
                    background: linear-gradient(270deg, #5B4DFF, #964DFF, #5B4DFF);
                    background-size: 200% 200%;
                    color: white;
                    border: none;
                    padding: 14px 40px;
                    font-size: 1.2rem;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                    animation: glowingAura 3s infinite;
                    letter-spacing: 0.5px;
                }

                .hero-apply-btn:hover {
                    transform: scale(1.05);
                    animation: none; /* Stop pulse on hover to show interaction state */
                    box-shadow: 0 0 30px rgba(91, 77, 255, 0.6);
                    background-position: 100% 50%;
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 100px 20px 40px;
                    }
                    
                    h1 {
                        font-size: 2.5rem !important;
                    }
                    
                    .speakers-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                    
                    .app-card {
                        padding: 30px;
                    }
                    
                    .app-card h2 {
                        font-size: 1.8rem;
                    }
                }

                /* Light Mode Overrides */
                :global([data-theme="light"]) h1 { color: var(--foreground); }
                :global([data-theme="light"]) p { color: var(--text-secondary); }
                
                :global([data-theme="light"]) .search-input {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    color: var(--text-primary);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                :global([data-theme="light"]) .search-input::placeholder { color: rgba(0,0,0,0.4); }
                :global([data-theme="light"]) .search-icon { opacity: 0.3; }

                :global([data-theme="light"]) .category-tab {
                    border-color: rgba(0,0,0,0.1);
                    color: var(--text-secondary);
                }
                :global([data-theme="light"]) .category-tab:hover {
                    background: rgba(0,0,0,0.05);
                    color: var(--primary);
                }
                :global([data-theme="light"]) .category-tab.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }

                :global([data-theme="light"]) .stat-pill {
                    background: white;
                    border-color: rgba(0,0,0,0.1);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                }
                :global([data-theme="light"]) .stat-text { color: var(--text-secondary); }

                :global([data-theme="light"]) .speaker-card {
                    background: white;
                    border-color: rgba(0,0,0,0.05);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                :global([data-theme="light"]) .speaker-name { color: var(--text-primary); }
                :global([data-theme="light"]) .speaker-company { color: var(--text-secondary); }
                :global([data-theme="light"]) .mini-tag {
                    background: rgba(0,0,0,0.05);
                    color: var(--text-secondary);
                }
                :global([data-theme="light"]) .no-results { color: var(--text-primary); }
                :global([data-theme="light"]) .reset-btn { color: var(--primary); }

                :global([data-theme="light"]) .app-card {
                    background: linear-gradient(135deg, rgba(91, 77, 255, 0.05) 0%, rgba(255,255,255,1) 100%);
                    border-color: rgba(91, 77, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }
                :global([data-theme="light"]) .app-card h2 { color: var(--text-primary); }
                :global([data-theme="light"]) .apply-btn {
                    background: var(--primary);
                    color: white;
                }
            `}</style>
            </motion.div>
        </>
    );
}
