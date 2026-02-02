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

    const fetchData = async () => {
        try {
            const [s, c, p, r, i, res, leads] = await Promise.all([
                fetch('/api/speakers').then(res => res.json()),
                fetch('/api/committee').then(res => res.json()),
                fetch('/api/paper/submit').then(res => res.json()),
                fetch('/api/register').then(res => res.json()),
                fetch('/api/inquiries').then(res => res.json()),
                fetch('/api/resources').then(res => res.json()),
                fetch('/api/leads').then(res => res.json())
            ]);
            setSpeakers(Array.isArray(s) ? s : []);
            setCommittee(Array.isArray(c) ? c : []);
            setPapers(Array.isArray(p) ? p : []);
            setRegistrations(Array.isArray(r) ? r : []);
            setInquiries(Array.isArray(i) ? i : []);
            setResources(Array.isArray(res) ? res : []);
            setResourceLeads(Array.isArray(leads) ? leads : []);
        } catch (e) {
            console.error("Failed to fetch admin data", e);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, setForm: any, prevForm: any) => {
        if (!e.target.files?.[0]) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setForm({ ...prevForm, [fieldName]: data.url });
            }
        } catch (error) {
            setStatus('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    // Generic Submit Handler (Create or Update)
    const handleSubmit = async (e: React.FormEvent, type: 'speaker' | 'committee' | 'resource') => {
        e.preventDefault();
        setStatus('Saving...');
        setLoading(true);

        const url = type === 'speaker'
            ? (editSpeakerId ? `/api/speakers/${editSpeakerId}` : '/api/speakers')
            : type === 'committee'
                ? (editCommitteeId ? `/api/committee/${editCommitteeId}` : '/api/committee')
                : '/api/resources';

        const method = (type !== 'resource' && (editSpeakerId || editCommitteeId)) ? 'PUT' : 'POST';
        const body = type === 'speaker' ? speakerForm : type === 'committee' ? committeeForm : resourceForm;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setStatus('Saved Successfully!');
                fetchData();
                // Reset Form
                if (type === 'speaker') {
                    setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' });
                    setEditSpeakerId(null);
                } else if (type === 'committee') {
                    setCommitteeForm({ name: '', role: '', photoUrl: '' });
                    setEditCommitteeId(null);
                } else {
                    setResourceForm({ title: '', fileUrl: '', category: 'Template' });
                }
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }
        } catch (err: any) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = async (id: number, currentVisible: number) => {
        try {
            await fetch('/api/resources', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isVisible: !currentVisible })
            });
            fetchData();
        } catch (err) {
            alert('Failed to update visibility');
        }
    };

    const handleDelete = async (id: number, type: 'speaker' | 'committee' | 'resource') => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const url = type === 'speaker' ? `/api/speakers/${id}` : type === 'committee' ? `/api/committee/${id}` : `/api/resources?id=${id}`;
        try {
            await fetch(url, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            alert('Failed to delete');
        }
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
                {['overview', 'speakers', 'committee', 'papers', 'attendees', 'inquiries', 'resources', 'resource leads'].map(tab => (
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

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <StatCard title="Speakers" count={speakers.length} />
                    <StatCard title="Committee" count={committee.length} />
                    <StatCard title="Papers" count={papers.length} />
                    <StatCard title="Attendees" count={registrations.length} />
                    <StatCard title="Inquiries" count={inquiries.length} />
                    <StatCard title="Resources" count={resources.length} />
                    <StatCard title="Resource Downloads" count={resourceLeads.length} />
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
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Photo</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'photoUrl', setSpeakerForm, speakerForm)} style={{ ...inputStyle, width: 'auto' }} />
                                    {loading && <span style={{ alignSelf: 'center' }}>Uploading...</span>}
                                </div>
                                {speakerForm.photoUrl && <img src={speakerForm.photoUrl} alt="Preview" style={{ height: '50px', marginTop: '10px', borderRadius: '4px' }} />}
                            </div>

                            <button className="btn" disabled={loading}>{editSpeakerId ? 'Update Speaker' : 'Add Speaker'}</button>
                            {editSpeakerId && <button type="button" onClick={() => { setEditSpeakerId(null); setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' }); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Speaker List</h3>
                        <ul style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {speakers.map((s: any) => (
                                <li key={s.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {s.photoUrl && <img src={s.photoUrl} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                                        <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit(s, 'speaker')} style={{ background: 'var(--primary)', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(s.id, 'speaker')} style={{ background: '#d32f2f', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Del</button>
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
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Photo</label>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'photoUrl', setCommitteeForm, committeeForm)} style={{ ...inputStyle, width: 'auto' }} />
                            </div>
                            <button className="btn" disabled={loading}>{editCommitteeId ? 'Update Member' : 'Add Member'}</button>
                            {editCommitteeId && <button type="button" onClick={() => { setEditCommitteeId(null); setCommitteeForm({ name: '', role: '', photoUrl: '' }); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                        </form>
                    </div>
                    {/* ... committee list similar to speakers ... */}
                </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Add Resource</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'resource')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Resource Title (e.g. LaTeX Template)" required value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} style={inputStyle} />
                            <select value={resourceForm.category} onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })} style={inputStyle}>
                                <option>Template</option>
                                <option>Brochure</option>
                                <option>Guidelines</option>
                            </select>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Upload File</label>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'fileUrl', setResourceForm, resourceForm)} style={{ ...inputStyle, width: 'auto' }} />
                                {resourceForm.fileUrl && <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--accent)' }}>File uploaded ✅</div>}
                            </div>
                            <button className="btn" disabled={loading}>Add Resource</button>
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Resource List</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                                    <th style={{ textAlign: 'center', padding: '10px' }}>Show in Frontend</th>
                                    <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(resources) && resources.map((res: any) => (
                                    <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>{res.title}</td>
                                        <td style={{ textAlign: 'center', padding: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={!!res.isVisible}
                                                onChange={() => toggleVisibility(res.id, res.isVisible)}
                                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>
                                            <button onClick={() => handleDelete(res.id, 'resource')} style={{ background: '#d32f2f', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* RESOURCE LEADS TAB */}
            {activeTab === 'resource leads' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Resource Download Leads</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Contact</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Downloaded Material</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(resourceLeads) && resourceLeads.map((lead: any) => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{lead.name}</td>
                                    <td style={{ padding: '10px' }}>
                                        <div>📧 {lead.email}</div>
                                        <div>📞 {lead.phone}</div>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{lead.resource}</span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PAPERS TAB */}
            {activeTab === 'papers' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Submitted Papers</h3>
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
                                    <td style={{ padding: '10px' }}><a href={p.fileUrl} target="_blank" style={{ color: 'var(--accent)' }}>View File</a></td>
                                    <td style={{ padding: '10px' }}>{p.authorName}</td>
                                    <td style={{ padding: '10px' }}>{p.country}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ATTENDEES TAB */}
            {activeTab === 'attendees' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Registered Attendees</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Ticket</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Feedback / Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((r: any) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{r.firstName} {r.lastName}</td>
                                    <td style={{ padding: '10px' }}>{r.email}</td>
                                    <td style={{ padding: '10px' }}>{r.ticketType}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            backgroundColor: r.paymentStatus === 'COMPLETED' ? '#10b981' : r.paymentStatus === 'ABANDONED' ? '#ef4444' : '#f59e0b',
                                            color: 'white'
                                        }}>
                                            {r.paymentStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', fontSize: '0.8rem', opacity: 0.8 }}>
                                        {r.paymentFeedback ? <div>💬 {r.paymentFeedback}</div> : null}
                                        <div style={{ fontSize: '0.7rem' }}>🆔 {r.razorpayOrderId || 'N/A'}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Lead Inquiries</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Contact</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(inquiries) && inquiries.map((inq: any) => (
                                <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{inq.fullName}</td>
                                    <td style={{ padding: '10px' }}>{inq.email}</td>
                                    <td style={{ padding: '10px' }}>
                                        <a href={`mailto:${inq.email}?subject=Conference Update`} className="btn" style={{ fontSize: '0.7rem', padding: '5px 10px' }}>Email</a>
                                    </td>
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
