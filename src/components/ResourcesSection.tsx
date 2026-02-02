"use client";
import { useState, useEffect } from 'react';
import ResourceDownloadModal from './ResourceDownloadModal';

export default function ResourcesSection() {
    const [resources, setResources] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('All');
    const [downloadingResource, setDownloadingResource] = useState<any>(null);

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

    const tabs = ['All', 'Template', 'Brochure', 'Guidelines'];

    const filteredResources = activeTab === 'All'
        ? resources
        : resources.filter(r => r.category === activeTab);

    return (
        <section className="container section-margin resources-section">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Resources & Downloads</h2>
                <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                    Access the latest templates, schedules, and promotional materials for the conference.
                </p>
            </div>

            <div className="resources-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab}
                        className={`resource-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="resources-grid">
                {filteredResources.map((res, i) => (
                    <div key={res.id || i} className="resource-card">
                        <div className="resource-header">
                            <div className="resource-icon-box">{res.category === 'Template' ? '📝' : res.category === 'Brochure' ? '📄' : '📣'}</div>
                            <span className="resource-tag">{res.category}</span>
                        </div>
                        <div className="resource-content">
                            <h4>{res.title}</h4>
                            <p>Download the official {res.title} for the conference.</p>
                        </div>
                        <div className="resource-footer">
                            <span className="resource-meta">Available for Download</span>
                            <button
                                className="download-btn-mini"
                                onClick={() => setDownloadingResource(res)}
                            >
                                ↓
                            </button>
                        </div>
                    </div>
                ))}
                {filteredResources.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                        No resources available in this category yet.
                    </div>
                )}
            </div>

            {downloadingResource && (
                <ResourceDownloadModal
                    resource={downloadingResource}
                    onClose={() => setDownloadingResource(null)}
                />
            )}
        </section>
    );
}
