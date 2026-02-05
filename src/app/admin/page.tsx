"use client";

// Cache bust: 2026-02-03-v3
import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white'
};

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 };

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
    const [exitFeedback, setExitFeedback] = useState<any[]>([]);
    const [exitStats, setExitStats] = useState<any>(null);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [awards, setAwards] = useState<any[]>([]);
    const [nominations, setNominations] = useState<any[]>([]);
    const [speakerApps, setSpeakerApps] = useState<any[]>([]);

    const [selectedApp, setSelectedApp] = useState<any>(null);

    // Forms
    const [speakerForm, setSpeakerForm] = useState({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' });
    const [committeeForm, setCommitteeForm] = useState({ name: '', role: '', photoUrl: '' });
    const [resourceForm, setResourceForm] = useState({ title: '', fileUrl: '', category: 'Template' });
    const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 10, maxUses: 1, validUntil: new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0] });
    const [sponsorForm, setSponsorForm] = useState({ name: '', logoUrl: '', website: '', tier: 'SILVER' });
    const [awardForm, setAwardForm] = useState({ title: '', category: 'Best Paper Award', description: '' });

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
            console.log("AdminDashboard: Fetching data...");
            const [s, c, p, r, i, res, leads, m, sub, exit, coup, spon, awd, nom, sap] = await Promise.all([
                fetch('/api/speakers').then(res => res.json()),
                fetch('/api/committee').then(res => res.json()),
                fetch('/api/paper/submit').then(res => res.json()),
                fetch('/api/register').then(res => res.json()),
                fetch('/api/inquiries').then(res => res.json()),
                fetch('/api/resources').then(res => res.json()),
                fetch('/api/leads').then(res => res.json()),
                fetch('/api/contact').then(res => res.json()),
                fetch('/api/newsletter').then(res => res.json()),
                fetch('/api/exit-feedback').then(res => res.json()),
                fetch('/api/coupons').then(res => res.json()),
                fetch('/api/sponsors').then(res => res.json().catch(() => [])),
                fetch('/api/awards').then(res => res.json().catch(() => [])),
                fetch('/api/awards/nominations').then(res => res.json().catch(() => [])),
                fetch('/api/speakers/apply').then(res => res.json().catch(() => []))
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
            setExitFeedback(exit.feedbacks || []);
            setExitStats(exit.stats || null);
            setCoupons(coup.coupons || []);
            setSponsors(Array.isArray(spon) ? spon : []);
            setAwards(Array.isArray(awd) ? awd : []);
            setNominations(Array.isArray(nom) ? nom : []);
            setSpeakerApps(Array.isArray(sap) ? sap : []);
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

    const updateAppStatus = async (id: number, newStatus: string) => {
        setLoading(true);
        setStatus(`Updating to ${newStatus}...`);
        try {
            const res = await fetch(`/api/speakers/apply?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            setStatus(`Status updated to ${newStatus}`);
            setSelectedApp((prev: any) => prev ? { ...prev, status: newStatus } : null);
            await fetchData();
            setTimeout(() => setStatus(''), 2000);
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

    const handleSubmit = async (e: React.FormEvent, type: 'speaker' | 'committee' | 'resource' | 'sponsor' | 'award') => {
        e.preventDefault();
        setStatus('Saving...');
        setLoading(true);

        try {
            const formData = new FormData();
            const formElements = (e.target as any).elements;
            const fileInput = formElements.file;

            if (fileInput?.files[0]) {
                formData.append('file', fileInput.files[0]);
            }

            if (type === 'resource') {
                formData.append('title', resourceForm.title);
                formData.append('category', resourceForm.category);

                const res = await fetch('/api/resources', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    setStatus('Resource Uploaded Successfully!');
                    fetchData();
                    setResourceForm({ title: '', fileUrl: '', category: 'Template' });
                } else { throw new Error('Failed to save resource'); }
            } else if (type === 'sponsor' || type === 'award') {
                const url = type === 'sponsor' ? '/api/sponsors' : '/api/awards';
                if (type === 'sponsor') {
                    formData.append('name', sponsorForm.name);
                    formData.append('tier', sponsorForm.tier);
                    formData.append('website', sponsorForm.website);
                    formData.append('logoUrl', sponsorForm.logoUrl);
                } else {
                    formData.append('title', awardForm.title);
                    formData.append('category', awardForm.category);
                    formData.append('description', awardForm.description);
                }

                const res = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    setStatus('Saved Successfully!');
                    fetchData();
                    if (type === 'sponsor') setSponsorForm({ name: '', logoUrl: '', website: '', tier: 'SILVER' });
                    else setAwardForm({ title: '', category: 'Best Paper Award', description: '' });
                } else { throw new Error('Failed to save'); }
            } else {
                const url = type === 'speaker' ? '/api/speakers' : '/api/committee';
                const method = (type === 'speaker' ? editSpeakerId : editCommitteeId) ? 'PUT' : 'POST';

                if (type === 'speaker') {
                    if (editSpeakerId) formData.append('id', editSpeakerId.toString());
                    formData.append('name', speakerForm.name);
                    formData.append('role', speakerForm.role);
                    formData.append('affiliation', speakerForm.affiliation);
                    formData.append('bio', speakerForm.bio);
                    formData.append('photoUrl', speakerForm.photoUrl);
                    formData.append('type', speakerForm.type);
                } else {
                    if (editCommitteeId) formData.append('id', editCommitteeId.toString());
                    formData.append('name', committeeForm.name);
                    formData.append('role', committeeForm.role);
                    formData.append('photoUrl', committeeForm.photoUrl);
                }

                const res = await fetch(url, {
                    method,
                    body: formData // Use FormData for Speaker/Committee too
                });

                if (res.ok) {
                    setStatus('Saved Successfully!');
                    fetchData();
                    if (type === 'speaker') {
                        setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' });
                        setEditSpeakerId(null);
                    } else if (type === 'committee') {
                        setCommitteeForm({ name: '', role: '', photoUrl: '' });
                        setEditCommitteeId(null);
                    } else if (type === 'sponsor') {
                        setSponsorForm({ name: '', logoUrl: '', website: '', tier: 'SILVER' });
                    } else if (type === 'award') {
                        setAwardForm({ title: '', category: 'Best Paper Award', description: '' });
                    }
                } else { throw new Error('Failed to save'); }
            }
        } catch (err: any) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCouponSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Creating Coupon...');
        setLoading(true);
        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(couponForm),
            });
            if (res.ok) {
                setStatus('Coupon created!');
                setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: 10, maxUses: 1, validUntil: new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0] });
                fetchData();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create coupon');
            }
        } catch (error: any) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, type: 'speaker' | 'committee' | 'resource' | 'sponsor' | 'award' | 'nomination' | 'speaker-apply') => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        setStatus('Deleting...');
        setLoading(true);

        const url = type === 'speaker-apply' ? `/api/speakers/apply?id=${id}` : `/api/${type === 'committee' ? 'committee' : type === 'sponsor' ? 'sponsors' : type === 'award' ? 'awards' : type === 'nomination' ? 'awards/nominations' : type + 's'}?id=${id}`;
        try {
            const res = await fetch(url, { method: 'DELETE' });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Delete failed');
            }

            setStatus('Deleted successfully!');
            await fetchData();
            setTimeout(() => setStatus(''), 2000);
        } catch (err: any) {
            console.error('Delete error:', err);
            setStatus('Error: ' + (err.message || 'Delete failed'));
            setTimeout(() => setStatus(''), 3000);
        } finally {
            setLoading(false);
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

    const handleCouponAction = async (id: number, action: 'delete' | 'toggle', isActive?: boolean) => {
        if (action === 'delete' && !confirm('Are you sure?')) return;

        setStatus(action === 'delete' ? 'Deleting coupon...' : 'Updating coupon...');
        setLoading(true);
        try {
            const res = await fetch('/api/coupons', {
                method: action === 'delete' ? 'DELETE' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: action === 'delete' ? null : JSON.stringify({ id, isActive }),
            });

            if (action === 'delete' && action === 'delete') {
                // DELETE uses searchParams
                await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
            }

            if (res.ok) {
                setStatus('Success!');
                fetchData();
            }
        } catch (err) {
            setStatus('Error');
        } finally {
            setLoading(false);
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

    const handleDragEnd = async (event: DragEndEvent, type: 'speaker' | 'committee') => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const items = type === 'speaker' ? speakers : committee;
        const setItems = type === 'speaker' ? setSpeakers : setCommittee;

        const oldIndex = items.findIndex((i: any) => i.id === active.id);
        const newIndex = items.findIndex((i: any) => i.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        // Sync with backend
        const orders = newItems.map((item: any, index: number) => ({
            id: item.id,
            displayOrder: index
        }));

        setStatus('Updating order...');
        try {
            const res = await fetch(`/api/${type === 'speaker' ? 'speakers' : 'committee'}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders })
            });

            if (!res.ok) {
                throw new Error('Failed to update order');
            }

            setStatus('Order updated successfully!');
            setTimeout(() => setStatus(''), 2000);
        } catch (err: any) {
            console.error('Failed to sync order:', err);
            setStatus('Error: Failed to save order');
            setTimeout(() => setStatus(''), 3000);
            // Revert the UI change
            await fetchData();
        }
    };

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <div style={{ padding: '120px 20px 40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['overview', 'speakers', 'committee', 'speaker applications', 'papers', 'attendees', 'sponsors', 'awards', 'award nominations', 'exit feedback', 'coupons', 'inquiries', 'messages', 'subscribers', 'resources', 'resource leads'].map(tab => (
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '20px' }}>
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

            {selectedApp && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div className="glass-card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Application Details</h2>
                                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Submitted on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Applicant Information</h4>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Full Name</label>
                                        <div style={{ fontWeight: '600' }}>{selectedApp.fullName}</div>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Email</label>
                                        <div>{selectedApp.email}</div>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Organization / Role</label>
                                        <div>{selectedApp.currentPosition} at <span style={{ color: 'var(--primary)' }}>{selectedApp.organization}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {selectedApp.linkedinUrl && <a href={selectedApp.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#0077b5', fontSize: '0.85rem' }}>LinkedIn ↗</a>}
                                        {selectedApp.websiteUrl && <a href={selectedApp.websiteUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Website ↗</a>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Session Proposal</h4>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Title</label>
                                        <div style={{ fontWeight: '600' }}>{selectedApp.sessionTitle}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Type</label>
                                            <div style={{ fontSize: '0.9rem' }}>{selectedApp.sessionType}</div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '5px' }}>Duration</label>
                                            <div style={{ fontSize: '0.9rem' }}>{selectedApp.durationPreference} mins</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Additional Details</h4>
                            <div style={{ display: 'grid', gap: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '8px' }}>Professional Biography</label>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9 }}>
                                        {selectedApp.bio || "No bio provided"}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5, marginBottom: '8px' }}>Session Abstract / Description</label>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9 }}>
                                        {selectedApp.sessionDescription}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ opacity: 0.6 }}>Current Status:</span>
                                <span style={{
                                    color: selectedApp.status === 'PENDING' ? '#ff9800' : selectedApp.status === 'APPROVED' ? '#00ff88' : '#d32f2f',
                                    fontWeight: 'bold'
                                }}>{selectedApp.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => updateAppStatus(selectedApp.id, 'APPROVED')}
                                    className="btn"
                                    style={{ background: '#00ff88', color: '#000', fontWeight: 'bold' }}
                                    disabled={loading || selectedApp.status === 'APPROVED'}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateAppStatus(selectedApp.id, 'REJECTED')}
                                    className="btn"
                                    style={{ background: '#d32f2f' }}
                                    disabled={loading || selectedApp.status === 'REJECTED'}
                                >
                                    Reject
                                </button>
                                <a href={`mailto:${selectedApp.email}?subject=WARS '26 Speaker Application Update&body=Dear ${selectedApp.fullName},`} className="btn">Reply via Email</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <StatCard title="Speakers" count={speakers.length} />
                    <StatCard title="Committee" count={committee.length} />
                    <StatCard title="Papers" count={papers.length} />
                    <StatCard title="Attendees" count={registrations.length} />
                    <StatCard title="Sponsors" count={sponsors.length} />
                    <StatCard title="Awards" count={awards.length} />
                    <StatCard title="Nominations" count={nominations.length} />
                    <StatCard title="Speaker Apps" count={speakerApps.length} />
                    <StatCard title="Inquiries" count={inquiries.length} />
                    <StatCard title="Messages" count={messages.length} />
                    <StatCard title="Subscribers" count={subscribers.length} />
                    <StatCard title="Resources" count={resources.length} />
                    <StatCard title="Resource Leads" count={resourceLeads.length} />
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
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Speaker Photo (Direct Upload)</label>
                                <input type="file" name="file" style={inputStyle} accept="image/*" />
                                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '5px' }}>Optional: Or paste a URL below if already hosted</div>
                                <input type="text" placeholder="Photo URL" value={speakerForm.photoUrl} onChange={e => setSpeakerForm({ ...speakerForm, photoUrl: e.target.value })} style={{ ...inputStyle, marginTop: '5px' }} />
                            </div>
                            <button className="btn" disabled={loading}>{loading ? 'Saving...' : (editSpeakerId ? 'Update Speaker' : 'Add Speaker')}</button>
                            {editSpeakerId && <button type="button" onClick={() => { setEditSpeakerId(null); setSpeakerForm({ name: '', role: '', affiliation: '', bio: '', photoUrl: '', type: 'KEYNOTE' }); }} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>}
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Speaker List</h3>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'speaker')} modifiers={[restrictToVerticalAxis]}>
                            <SortableContext items={speakers} strategy={verticalListSortingStrategy}>
                                <ul style={{ maxHeight: '600px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
                                    {speakers.map((s: any) => (
                                        <SortableItem key={s.id} id={s.id}>
                                            <SpeakerListItem speaker={s} onEdit={startEdit} onDelete={handleDelete} />
                                        </SortableItem>
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
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
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Photo (Direct Upload)</label>
                                <input type="file" name="file" style={inputStyle} accept="image/*" />
                                <input type="text" placeholder="Or Photo URL" value={committeeForm.photoUrl} onChange={e => setCommitteeForm({ ...committeeForm, photoUrl: e.target.value })} style={{ ...inputStyle, marginTop: '5px' }} />
                            </div>
                            <button className="btn" disabled={loading}>{loading ? 'Saving...' : (editCommitteeId ? 'Update Member' : 'Add Member')}</button>
                            {editCommitteeId && <button type="button" onClick={() => { setEditCommitteeId(null); setCommitteeForm({ name: '', role: '', photoUrl: '' }); }} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>}
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Committee List</h3>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'committee')} modifiers={[restrictToVerticalAxis]}>
                            <SortableContext items={committee} strategy={verticalListSortingStrategy}>
                                <ul style={{ maxHeight: '600px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
                                    {committee.map((m: any) => (
                                        <SortableItem key={m.id} id={m.id}>
                                            <CommitteeListItem member={m} onEdit={startEdit} onDelete={handleDelete} />
                                        </SortableItem>
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
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
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Mode</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Coupon</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((r: any) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{r.firstName} {r.lastName}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{r.email}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>{r.ticketType}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ fontSize: '0.8rem', padding: '2px 6px', background: r.attendanceMode === 'VIRTUAL' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(91, 77, 255, 0.1)', borderRadius: '4px' }}>
                                                {r.attendanceMode}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ color: r.paymentStatus === 'COMPLETED' ? '#00ff88' : '#ff9800' }}>
                                                {r.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {r.couponCode ? (
                                                <div style={{ fontSize: '0.8rem' }}>
                                                    <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>{r.couponCode}</code>
                                                    <div style={{ opacity: 0.6 }}>-{r.discountApplied}%</div>
                                                </div>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* EXIT FEEDBACK TAB */}
            {activeTab === 'exit feedback' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <StatCard title="Total Dropouts" count={exitStats?.total || 0} />
                        <StatCard title="Price High" count={exitStats?.priceHigh || 0} />
                        <StatCard title="Tech Issue" count={exitStats?.technicalIssue || 0} />
                        <StatCard title="Coupon Conv." count={exitStats?.couponsAccepted || 0} />
                    </div>

                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Abandonment Logs</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>Reason</th>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>Coupon</th>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>Ticket Attempt</th>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>Notes</th>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exitFeedback.map((f: any) => (
                                        <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '10px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{f.abandonReason}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{f.email || 'Anonymous'}</div>
                                            </td>
                                            <td style={{ padding: '10px' }}>
                                                {f.wasOfferedCoupon ? (
                                                    <span style={{ color: f.acceptedCoupon ? '#00ff88' : '#ff9800' }}>
                                                        {f.acceptedCoupon ? '✓ Accepted' : '✗ Declined'}
                                                    </span>
                                                ) : 'N/A'}
                                            </td>
                                            <td style={{ padding: '10px' }}>{f.ticketType || '-'}</td>
                                            <td style={{ padding: '10px', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.additionalNotes || '-'}</td>
                                            <td style={{ padding: '10px', fontSize: '0.8rem' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Create New Coupon</h3>
                        <form onSubmit={handleCouponSubmit} style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Coupon Code</label>
                                <input type="text" placeholder="e.g. FLASH20" required value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} style={inputStyle} />
                            </div>
                            <div className="grid-2" style={{ gap: '10px' }}>
                                <div>
                                    <label style={labelStyle}>Type</label>
                                    <select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })} style={inputStyle}>
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Value</label>
                                    <input type="number" required value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: parseInt(e.target.value) })} style={inputStyle} />
                                </div>
                            </div>
                            <div className="grid-2" style={{ gap: '10px' }}>
                                <div>
                                    <label style={labelStyle}>Max Uses</label>
                                    <input type="number" required value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Valid Until</label>
                                    <input type="date" required value={couponForm.validUntil} onChange={e => setCouponForm({ ...couponForm, validUntil: e.target.value })} style={inputStyle} />
                                </div>
                            </div>
                            <button className="btn" disabled={loading} style={{ marginTop: '10px' }}>{loading ? 'Creating...' : 'Create Coupon'}</button>
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Active Coupons</h3>
                        <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                            {coupons.length === 0 ? (
                                <p style={{ opacity: 0.5, textAlign: 'center', padding: '40px' }}>No coupons created yet</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {coupons.map((c: any) => (
                                        <li key={c.id} style={{
                                            padding: '20px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            marginBottom: '10px',
                                            border: '1px solid var(--glass-border)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{c.code}</span>
                                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: c.isActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 77, 77, 0.1)', color: c.isActive ? '#00ff88' : '#ff4d4d', borderRadius: '4px' }}>
                                                        {c.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '5px' }}>
                                                    {c.discountValue}{c.discountType === 'PERCENTAGE' ? '%' : ' Fixed'} Off • {c.usedCount}/{c.maxUses} used
                                                </div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Expires: {new Date(c.validUntil).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleCouponAction(c.id, 'toggle', !c.isActive)} className="btn btn-mini" style={{ padding: '8px', fontSize: '0.7rem' }}>
                                                    {c.isActive ? 'Disable' : 'Enable'}
                                                </button>
                                                <button onClick={() => handleCouponAction(c.id, 'delete')} className="btn btn-mini" style={{ padding: '8px', fontSize: '0.7rem', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d' }}>
                                                    Del
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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

            {/* SUBSCRIBERS TAB */}
            {activeTab === 'subscribers' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Newsletter Subscribers</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
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

            {/* SPONSORS TAB */}
            {activeTab === 'sponsors' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Add Sponsor</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'sponsor')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Sponsor Name" required value={sponsorForm.name} onChange={e => setSponsorForm({ ...sponsorForm, name: e.target.value })} style={inputStyle} />
                            <select value={sponsorForm.tier} onChange={e => setSponsorForm({ ...sponsorForm, tier: e.target.value })} style={inputStyle}>
                                <option value="PLATINUM">Platinum</option>
                                <option value="GOLD">Gold</option>
                                <option value="SILVER">Silver</option>
                            </select>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Logo (Direct Upload)</label>
                                <input type="file" name="file" style={inputStyle} accept="image/*" />
                                <input type="text" placeholder="Or Logo URL" value={sponsorForm.logoUrl} onChange={e => setSponsorForm({ ...sponsorForm, logoUrl: e.target.value })} style={{ ...inputStyle, marginTop: '5px' }} />
                            </div>
                            <input type="text" placeholder="Website URL" value={sponsorForm.website} onChange={e => setSponsorForm({ ...sponsorForm, website: e.target.value })} style={inputStyle} />
                            <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Sponsor'}</button>
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Current Sponsors</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {sponsors.map((s: any) => (
                                <li key={s.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {s.logoUrl && <img src={s.logoUrl} style={{ width: 40, height: 40, objectFit: 'contain' }} />}
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.tier}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(s.id, 'sponsor')} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* AWARDS TAB */}
            {activeTab === 'awards' && (
                <div className="grid-2">
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Add Award</h3>
                        <form onSubmit={(e) => handleSubmit(e, 'award')} style={{ display: 'grid', gap: '16px' }}>
                            <input type="text" placeholder="Award Title" required value={awardForm.title} onChange={e => setAwardForm({ ...awardForm, title: e.target.value })} style={inputStyle} />
                            <select value={awardForm.category} onChange={e => setAwardForm({ ...awardForm, category: e.target.value })} style={inputStyle}>
                                <option>Best Paper Award</option>
                                <option>Young Researcher Award</option>
                                <option>Innovation Excellence</option>
                                <option>Lifetime Achievement</option>
                            </select>
                            <textarea placeholder="Description" value={awardForm.description} onChange={e => setAwardForm({ ...awardForm, description: e.target.value })} style={inputStyle} rows={3}></textarea>
                            <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Award'}</button>
                        </form>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px' }}>Current Awards</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {awards.map((a: any) => (
                                <li key={a.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{a.title}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{a.category}</div>
                                    </div>
                                    <button onClick={() => handleDelete(a.id, 'award')} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* AWARD NOMINATIONS TAB */}
            {activeTab === 'award nominations' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Submitted Nominations</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Nominee/Affiliation</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Justification</th>
                                    <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nominations.map((n: any) => (
                                    <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{n.nomineeName}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{n.affiliation}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>{n.category}</td>
                                        <td style={{ padding: '10px', fontSize: '0.85rem', maxWidth: '300px' }}>{n.justification || '-'}</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>
                                            <button onClick={() => handleDelete(n.id, 'nomination')} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.7rem' }}>Del</button>
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

            {/* SPEAKER APPLICATIONS TAB */}
            {activeTab === 'speaker applications' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>Speaker Applications (Become a Speaker)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Applicant</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Talk Proposal</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                    <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {speakerApps.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', opacity: 0.5 }}>No applications yet</td></tr>
                                ) : (
                                    speakerApps.map((app: any) => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{app.fullName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{app.organization}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{app.email}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: '600' }}>{app.sessionTitle}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{app.sessionType} • {app.durationPreference} mins</div>
                                                <div style={{ fontSize: '0.85rem', marginTop: '5px', maxWidth: '400px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{app.sessionDescription}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    background: app.status === 'PENDING' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                                                    color: app.status === 'PENDING' ? '#ff9800' : '#00ff88',
                                                    border: `1px solid ${app.status === 'PENDING' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(0, 255, 136, 0.2)'}`
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '15px' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => setSelectedApp(app)} className="btn" style={{ padding: '5px 12px', fontSize: '0.75rem', background: 'rgba(91, 77, 255, 0.2)', border: '1px solid #5B4DFF' }}>View</button>
                                                    <a href={`mailto:${app.email}?subject=WARS '26 Speaker Application Update&body=Dear ${app.fullName},`} className="btn" style={{ padding: '5px 12px', fontSize: '0.75rem' }}>Reply</a>
                                                    <button onClick={() => handleDelete(app.id, 'speaker-apply')} className="btn" style={{ background: '#d32f2f', padding: '5px 12px', fontSize: '0.75rem' }}>Del</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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



function SortableItem({ id, children }: { id: number, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        position: 'relative' as any,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        dragHandleListeners: listeners,
                        dragHandleAttributes: attributes
                    });
                }
                return child;
            })}
        </div>
    );
}

function SpeakerListItem({ speaker, onEdit, onDelete, dragHandleListeners, dragHandleAttributes }: any) {
    return (
        <li style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', marginBottom: '5px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span {...dragHandleListeners} {...dragHandleAttributes} style={{ opacity: 0.3, cursor: 'grab', padding: '5px' }}>::</span>
                {speaker.photoUrl && <img src={speaker.photoUrl} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                <div style={{ fontWeight: 'bold' }}>{speaker.name}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(speaker, 'speaker'); }} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(speaker.id, 'speaker'); }} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
            </div>
        </li>
    );
}

function CommitteeListItem({ member, onEdit, onDelete, dragHandleListeners, dragHandleAttributes }: any) {
    return (
        <li style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', marginBottom: '5px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span {...dragHandleListeners} {...dragHandleAttributes} style={{ opacity: 0.3, cursor: 'grab', padding: '5px' }}>::</span>
                {member.photoUrl && <img src={member.photoUrl} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                <div style={{ fontWeight: 'bold' }}>{member.name} ({member.role})</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(member, 'committee'); }} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(member.id, 'committee'); }} className="btn" style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '0.8rem' }}>Del</button>
            </div>
        </li>
    );
}
