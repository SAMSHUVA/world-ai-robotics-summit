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

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('Uploading File...');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', resourceForm.title || file.name);
        formData.append('category', resourceForm.category);

        try {
            // We'll reuse or create a generic upload API or use Supabase directly if client-side keys allow
            // For security, it's better to use a server-side route. 
            // I'll create/use /api/admin/upload later, but for now, let's wire the UI.
            setStatus('Ready to save. Please clicked "Add Resource"');
            // Mocking the URL for now or if we have a direct upload route
            // For now, I'll update the form to use FormData in handleSubmit
        } catch (err) {
            setStatus('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, type: 'speaker' | 'committee' | 'resource') => {
        e.preventDefault();
        setStatus('Saving...');
        setLoading(true);

        try {
            if (type === 'resource') {
                const formData = new FormData();
                const fileInput = (e.target as any).elements.file;
                if (fileInput?.files[0]) {
                    formData.append('file', fileInput.files[0]);
                }
                formData.append('title', resourceForm.title);
                formData.append('category', resourceForm.category);

                const res = await fetch('/api/resources', {
                    method: 'POST',
                    body: formData // Send as FormData to handle files
                });

                if (res.ok) {
                    setStatus('Resource Uploaded Successfully!');
                    fetchData();
                    setResourceForm({ title: '', fileUrl: '', category: 'Template' });
                } else {
                    const error = await res.json();
                    throw new Error(error.error || 'Failed to save');
                }
            } else {
                const url = type === 'speaker' ? '/api/speakers' : '/api/committee';
                const method = (editSpeakerId || editCommitteeId) ? 'PUT' : 'POST';
                const body = type === 'speaker' ? { ...speakerForm, id: editSpeakerId } : { ...committeeForm, id: editCommitteeId };

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (res.ok) {
                    setStatus('Saved Successfully!');
                    fetchData();
                    if (type === 'speaker') { setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' }); setEditSpeakerId(null); }
                    else if (type === 'committee') { setCommitteeForm({ name: '', role: '', photoUrl: '' }); setEditCommitteeId(null); }
                } else { throw new Error('Failed to save'); }
            }
        } catch (err: any) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, type: 'speaker' | 'committee' | 'resource') => {
        if (!confirm('Are you sure?')) return;
        const url = type === 'resource' ? `/api/resources?id=${id}` : `/api/${type}s?id=${id}`;
        try {
            await fetch(url, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const toggleVisibility = async (id: number, isVisible: boolean) => {
        try {
            await fetch('/api/resources', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isVisible })
            });
            fetchData();
        } catch (err) { alert('Update failed'); }
    };

    const startEdit = (item: any, type: 'speaker' | 'committee') => {
        if (type === 'speaker') {
            setSpeakerForm(item);
            setEditSpeakerId(item.id);
        } else {
            setCommitteeForm(item);
            setEditCommitteeId(item.id);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

            {/* SPEAKERS TAB */}
            {activeTab === 'speakers' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>{editSpeakerId ? 'Edit Speaker' : 'Add Speaker'}</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'speaker')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Name" required value={speakerForm.name} onChange={e => setSpeakerForm({ ...speakerForm, name: e.target.value })} style={inputStyle} />
                            <input type="text" placeholder="Role" value={speakerForm.role} onChange={e => setSpeakerForm({ ...speakerForm, role: e.target.value })} style={inputStyle} />
                            <input type="text" placeholder="Affiliation" value={speakerForm.affiliation} onChange={e => setSpeakerForm({ ...speakerForm, affiliation: e.target.value })} style={inputStyle} />
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Photo URL</label>
                                <input type="text" placeholder="Paste URL or upload" value={speakerForm.photoUrl} onChange={e => setSpeakerForm({ ...speakerForm, photoUrl: e.target.value })} style={inputStyle} />
                            </div>
                            <button className="btn" disabled={loading}>{editSpeakerId ? 'Update Speaker' : 'Add Speaker'}</button>
                            {editSpeakerId && <button type="button" onClick={() => { setEditSpeakerId(null); setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' }); }} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>}
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Speaker List</h3>
                        <ul style={{ maxHeight: '600px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
                            {speakers.map((s: any) => (
                                <li key={s.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {s.photoUrl && <img src={s.photoUrl} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                                        <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit(s, 'speaker')} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(s.id, 'speaker')} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* COMMITTEE TAB */}
            {activeTab === 'committee' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>{editCommitteeId ? 'Edit Member' : 'Add Member'}</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'committee')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Name" required value={committeeForm.name} onChange={e => setCommitteeForm({ ...committeeForm, name: e.target.value })} style={inputStyle} />
                            <input type="text" placeholder="Role" required value={committeeForm.role} onChange={e => setCommitteeForm({ ...committeeForm, role: e.target.value })} style={inputStyle} />
                            <input type="text" placeholder="Photo URL" value={committeeForm.photoUrl} onChange={e => setCommitteeForm({ ...committeeForm, photoUrl: e.target.value })} style={inputStyle} />
                            <button className="btn" disabled={loading}>{editCommitteeId ? 'Update Member' : 'Add Member'}</button>
                            {editCommitteeId && <button type="button" onClick={() => { setEditCommitteeId(null); setCommitteeForm({ name: '', role: '', photoUrl: '' }); }} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>}
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Committee List</h3>
                        <ul style={{ maxHeight: '600px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
                            {committee.map((m: any) => (
                                <li key={m.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 'bold' }}>{m.name} ({m.role})</div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit(m, 'committee')} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(m.id, 'committee')} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* PAPERS TAB */}
            {activeTab === 'papers' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Submitted Papers</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Title/File</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Author</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Country</th>
                                </tr>
                            </thead>
                            <tbody>
                                {papers.map((p: any) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}><a href={p.fileUrl} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View File</a></td>
                                        <td style={{ padding: '10px' }}>{p.authorName}</td>
                                        <td style={{ padding: '10px' }}>{p.country}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ATTENDEES TAB */}
            {activeTab === 'attendees' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Registered Attendees</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Name/Email</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Ticket</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((r: any) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div>{r.firstName} {r.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{r.email}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>{r.ticketType}</td>
                                        <td style={{ padding: '10px' }}>{r.paymentStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Lead Inquiries</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Contact</th>
                                    <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((inq: any) => (
                                    <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>{inq.fullName}</td>
                                        <td style={{ padding: '10px' }}>{inq.email}</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>
                                            <a href={`mailto:${inq.email}`} className="btn" style={{ fontSize: '0.7rem', padding: '5px 10px' }}>Email</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Add Resource</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'resource')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Resource Title" required value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} style={inputStyle} />
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Upload File (PDF/Doc/Image)</label>
                                <input type="file" name="file" required style={inputStyle} />
                            </div>
                            <select value={resourceForm.category} onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })} style={inputStyle}>
                                <option value="Template">Template</option>
                                <option value="Brochure">Brochure</option>
                                <option value="Guidelines">Guidelines</option>
                            </select>
                            <button className="btn" disabled={loading}>{loading ? 'Uploading...' : 'Add Resource'}</button>
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Current Resources</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {resources.map((res: any) => (
                                <li key={res.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{res.title}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{res.category}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => toggleVisibility(res.id, !res.isVisible)} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem', background: res.isVisible ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>{res.isVisible ? 'Hide' : 'Show'}</button>
                                        <button onClick={() => handleDelete(res.id, 'resource' as any)} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* RESOURCE LEADS TAB */}
            {activeTab === 'resource leads' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Resource Download Leads</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Country</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resourceLeads.map((l: any) => (
                                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>{l.name || 'Anonymous'}</td>
                                        <td style={{ padding: '10px' }}>{l.email}</td>
                                        <td style={{ padding: '10px' }}>{l.country || '-'}</td>
                                        <td style={{ padding: '10px', fontSize: '0.8rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
