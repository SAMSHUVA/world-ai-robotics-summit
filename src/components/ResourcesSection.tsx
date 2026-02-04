"use client";
import { useState, useEffect, useRef } from 'react';
import ResourceDownloadModal from './ResourceDownloadModal';
import Reveal from './Reveal';

export default function ResourcesSection() {
    const [resources, setResources] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('All');
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [downloadingResource, setDownloadingResource] = useState<any>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabs = ['All', 'Template', 'Brochure', 'Guidelines'];
    const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const textRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

    useEffect(() => {
        fetch('/api/resources')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setResources(data.filter(r => r.isVisible === 1 || r.isVisible === true));
                }
            })
            .catch(err => console.error('Failed to fetch resources', err));
    }, []);

    // Update indicator position/width based on active or hovered tab
    // Update indicator position/width based on active or hovered tab
    useEffect(() => {
        const targetTab = hoveredTab || activeTab;
        const tabEl = tabRefs.current[targetTab];
        const textEl = textRefs.current[targetTab];

        if (tabEl && textEl) {
            // Refined calculation: Measure text width directly
            const textWidth = textEl.offsetWidth;
            const padding = 0; // Exact text width for underline
            const indicatorWidth = textWidth + padding;

            // Center the pill within the flexible tab container
            const centerOffset = tabEl.offsetLeft + (tabEl.offsetWidth / 2) - (indicatorWidth / 2);

            setIndicatorStyle({
                width: `${indicatorWidth}px`,
                transform: `translateX(${centerOffset}px)`,
                opacity: hoveredTab ? 0.7 : 1,
            });
        }
    }, [activeTab, hoveredTab]);

    const filteredResources = activeTab === 'All'
        ? resources
        : resources.filter(r => r.category === activeTab);

    return (
        <section className="container resources-section" style={{ position: 'relative', marginTop: '100px' }}>
            <Reveal animation="reveal-fade">
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Resources & <span className="title-gradient">Downloads</span></h2>
                    <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        Access the latest templates, schedules, and promotional materials for the conference.
                    </p>
                </div>
            </Reveal>

            <Reveal animation="reveal" delay={200}>
                <div className="resources-tabs-container">
                    <div className="resources-tabs" onMouseLeave={() => setHoveredTab(null)}>
                        {/* Sliding Indicator */}
                        <div className="tab-indicator" style={indicatorStyle}></div>

                        {tabs.map(tab => (
                            <div
                                key={tab}
                                ref={el => { tabRefs.current[tab] = el; }}
                                className={`resource-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                                onMouseEnter={() => setHoveredTab(tab)}
                                style={{ zIndex: 2 }}
                            >
                                <span ref={el => { textRefs.current[tab] = el; }} style={{ position: 'relative', zIndex: 3 }}>
                                    {tab}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>

            <div className="resources-grid" key={activeTab}>
                {filteredResources.map((res, i) => (
                    <Reveal key={res.id || i} animation="reveal" index={i % 3} stagger={100} delay={100}>
                        <div className="resource-card">
                            <div className="resource-card-inner">
                                <div className="resource-header">
                                    <div className="resource-icon-box">{res.category === 'Template' ? '📝' : res.category === 'Brochure' ? '📄' : '📣'}</div>
                                    <span className="resource-tag">{res.category}</span>
                                </div>
                                <div className="resource-content">
                                    <h4>{res.title}</h4>
                                    <p>Download the official {res.title} for the conference.</p>
                                </div>
                                <div className="resource-footer">
                                    <span className="resource-meta">v1.2 • PDF</span>
                                    <button
                                        className="download-btn-premium"
                                        onClick={() => setDownloadingResource(res)}
                                        aria-label="Download"
                                    >
                                        <span className="download-icon">↓</span>
                                    </button>
                                </div>
                            </div>
                            {/* Border Glow Highlight */}
                            <div className="card-border-glow"></div>
                        </div>
                    </Reveal>
                ))}

                {filteredResources.length === 0 && (
                    <Reveal animation="reveal-fade">
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', opacity: 0.5, background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📂</div>
                            No resources available in this category yet.
                        </div>
                    </Reveal>
                )}
            </div>

            <style jsx>{`
                .resources-tabs-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 50px;
                    width: 100%;
                    overflow: hidden;
                }

                .resources-tabs {
                    display: flex;
                    background: transparent;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0;
                    position: relative;
                    min-width: 320px;
                }

                .tab-indicator {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    height: 3px;
                    background: var(--primary, #5B4DFF);
                    border-radius: 3px 3px 0 0;
                    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 -2px 10px rgba(91, 77, 255, 0.5);
                    pointer-events: none;
                    z-index: 5;
                }

                .resource-tab {
                    flex: 1;
                    padding: 12px 20px;
                    text-align: center;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    transition: color 0.3s ease;
                    white-space: nowrap;
                    z-index: 2;
                }

                .resource-tab.active {
                    color: white;
                }

                .resources-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                }

                .resources-grid :global(.reveal) {
                    display: flex;
                    flex-direction: column;
                }

                .resource-card {
                    position: relative;
                    border-radius: 24px;
                    padding: 1px;
                    background: rgba(255, 255, 255, 0.05);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                }

                .resource-card-inner {
                    position: relative;
                    z-index: 2;
                    background: #0d0b1e;
                    border-radius: 23px;
                    padding: 30px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .resource-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    background: var(--primary, #5B4DFF);
                }

                .card-border-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(91, 77, 255, 0.4) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .resource-card:hover .card-border-glow {
                    opacity: 1;
                }

                .resource-icon-box {
                    font-size: 1.5rem;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    transition: transform 0.3s ease;
                }

                .resource-card:hover .resource-icon-box {
                    transform: scale(1.1) rotate(5deg);
                }

                .resource-content h4 {
                    font-size: 1.25rem;
                    margin-bottom: 12px;
                    color: white;
                }

                .resource-content p {
                    font-size: 0.9rem;
                    opacity: 0.6;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }

                .resource-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .resource-meta {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.4;
                    font-weight: 700;
                }

                .download-btn-premium {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .resource-card:hover .download-btn-premium {
                    background: var(--primary, #5B4DFF);
                    box-shadow: 0 0 20px rgba(91, 77, 255, 0.5);
                    transform: rotate(360deg);
                }

                @media (max-width: 992px) {
                    .resources-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .resources-section {
                        padding-top: 150px !important; /* Increased gap to prevent overlap with terminal */
                        margin-top: 0 !important;
                    }
                    
                    /* Hide sliding indicator on mobile - use background instead */
                    .tab-indicator {
                        display: none !important;
                    }
                    
                    .resource-tab.active {
                        background: rgba(91, 77, 255, 0.2);
                        border-radius: 8px;
                        color: white;
                    }
                    
                    .resources-grid {
                        grid-template-columns: 1fr;
                    }
                    .resources-tabs {
                        max-width: 100%;
                    }
                    .resource-tab {
                        padding: 10px 12px;
                        font-size: 0.8rem;
                    }
                    .resources-tabs-container {
                        margin-bottom: 30px;
                        overflow-x: auto;
                        justify-content: flex-start;
                        padding: 10px 0;
                    }
                    .resources-tabs {
                        width: max-content;
                        min-width: 100%;
                    }
                }
            `}</style>

            {downloadingResource && (
                <ResourceDownloadModal
                    resource={downloadingResource}
                    onClose={() => setDownloadingResource(null)}
                />
            )}
        </section>
    );
}
