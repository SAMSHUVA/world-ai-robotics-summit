"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Data Lists
    const [speakers, setSpeakers] = useState<any[]>([]);
    const [committee, setCommittee] = useState<any[]>([]);
    const [papers, setPapers] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [resourceLeads, setResourceLeads] = useState<any[]>([]);

    // Forms
    const [speakerForm, setSpeakerForm] = useState({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' });
    const [committeeForm, setCommitteeForm] = useState({ name: '', role: '', photoUrl: '' });
    const [resourceForm, setResourceForm] = useState({ title: '', fileUrl: '', category: 'Template' });

    // Edit State
    const [editSpeakerId, setEditSpeakerId] = useState<number | null>(null);
    const [editCommitteeId, setEditCommitteeId] = useState<number | null>(null);

    // Fetch Data on Load
    useEffect(() => {
        fetchData();
    }, []);

    const [messages, setMessages] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [replyForm, setReplyForm] = useState({ to: '', subject: 'Inquiry Follow-up: IAISR', message: '' });
    const [showReplyModal, setShowReplyModal] = useState(false);

    const fetchData = async () => {
        try {
            const [s, c, p, r, i, res, leads, m, sub] = await Promise.all([
                fetch('/api/speakers').then(res => res.json()),
                fetch('/api/committee').then(res => res.json()),
                fetch('/api/paper/submit').then(res => res.json()),
                fetch('/api/register').then(res => res.json()),
                fetch('/api/inquiries').then(res => res.json()),
                fetch('/api/resources').then(res => res.json()),
                fetch('/api/leads').then(res => res.json()),
                fetch('/api/contact').then(res => res.json()),
                fetch('/api/newsletter').then(res => res.json())
            ]);
            setSpeakers(Array.isArray(s) ? s : []);
            setCommittee(Array.isArray(c) ? c : []);
            setPapers(Array.isArray(p) ? p : []);
            setRegistrations(Array.isArray(r) ? r : []);
            setInquiries(Array.isArray(i) ? i : []);
            setResources(Array.isArray(res) ? res : []);
            setResourceLeads(Array.isArray(leads) ? leads : []);
            setMessages(Array.isArray(m) ? m : []);
            setSubscribers(Array.isArray(sub) ? sub : []);
        } catch (e) {
            console.error("Failed to fetch admin data", e);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending Email...');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(replyForm)
            });
            if (res.ok) {
                setStatus('Email sent successfully!');
                setShowReplyModal(false);
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error: any) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '120px 20px 40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['overview', 'speakers', 'committee', 'papers', 'attendees', 'inquiries', 'messages', 'subscribers', 'resources', 'resource leads'].map(tab => (
                    <button
                        key={tab}
                        className="btn"
                        style={{
                            background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            textTransform: 'capitalize'
                        }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {status && <div style={{ padding: '15px', background: 'rgba(0, 255, 0, 0.1)', border: '1px solid green', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{status}</div>}

            {showReplyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                        <h3 style={{ marginBottom: '20px' }}>Reply to {replyForm.to}</h3>
                        <form onSubmit={handleReplySubmit} style={{ display: 'grid', gap: '15px' }}>
                            <input type="text" placeholder="Subject" required value={replyForm.subject} onChange={e => setReplyForm({ ...replyForm, subject: e.target.value })} style={inputStyle} />
                            <textarea placeholder="Message" required rows={6} value={replyForm.message} onChange={e => setReplyForm({ ...replyForm, message: e.target.value })} style={inputStyle}></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send Reply'}</button>
                                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowReplyModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <StatCard title="Speakers" count={speakers.length} />
                    <StatCard title="Committee" count={committee.length} />
                    <StatCard title="Papers" count={papers.length} />
                    <StatCard title="Attendees" count={registrations.length} />
                    <StatCard title="Inquiries" count={inquiries.length} />
                    <StatCard title="Messages" count={messages.length} />
                    <StatCard title="Subscribers" count={subscribers.length} />
                    <StatCard title="Resources" count={resources.length} />
                </div>
            )}

            {/* ... other existing tabs ... */}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Contact Form Messages</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Name/Email</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Subject/Message</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                                    <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((m: any) => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{m.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{m.email}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: '600' }}>{m.subject}</div>
                                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{m.message}</div>
                                        </td>
                                        <td style={{ padding: '10px', fontSize: '0.8rem' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>
                                            <button onClick={() => { setReplyForm({ ...replyForm, to: m.email }); setShowReplyModal(true); }} className="btn" style={{ fontSize: '0.7rem', padding: '5px 10px' }}>Reply</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {activeTab === 'subscribers' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Newsletter Subscribers</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Date Subscribed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((s: any) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{s.email}</td>
                                    <td style={{ padding: '10px' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, count }: { title: string, count: number }) {
    return (
        <div className="glass-card" style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '10px' }}>{count}</div>
            <div style={{ opacity: 0.8 }}>{title}</div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white'
};
