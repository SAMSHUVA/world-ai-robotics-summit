"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    UsersRound,
    FileText,
    ShieldCheck,
    Award,
    Package,
    Ticket,
    Megaphone,
    LogOut,
    MessageSquare,
    Mail,
    TrendingUp,
    Plus,
    ChevronRight,
    Search,
    Bell,
    Settings,
    HelpCircle,
    UserPlus,
    RefreshCw,
    Database,
    Zap,
    Globe,
    Activity,
    FolderOpen,
    DownloadCloud,
    DollarSign,
    Calendar,
    Star,
    CheckCircle2,
    Trash2,
    Edit3,
    ArrowUpRight,
    Eye,
    GripVertical
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Admin Styles
import './admin.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Modals & States
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [prefillData, setPrefillData] = useState<any>(null);
    const [userEmail, setUserEmail] = useState('');

    // Data Lists
    const [speakers, setSpeakers] = useState<any[]>([]);
    const [committee, setCommittee] = useState<any[]>([]);
    const [papers, setPapers] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [awards, setAwards] = useState<any[]>([]);
    const [speakerApps, setSpeakerApps] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [resourceLeads, setResourceLeads] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [nominations, setNominations] = useState<any[]>([]);
    const [exitFeedback, setExitFeedback] = useState<any[]>([]);
    const [dynamicDates, setDynamicDates] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [ticketPrices, setTicketPrices] = useState<any[]>([]);

    // Paper Management
    const [selectedPaper, setSelectedPaper] = useState<any>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedSpeakerApp, setSelectedSpeakerApp] = useState<any>(null);
    const [showSpeakerAppModal, setShowSpeakerAppModal] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [decisionComments, setDecisionComments] = useState('');

    useEffect(() => {
        // Initial fetch: Overview stats + Active Tab
        fetchData('overview');
        if (activeTab !== 'overview') fetchData(activeTab);

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
        };
        getUser();
    }, []);

    // Fetch data specifically for the active tab when it changes
    useEffect(() => {
        if (activeTab !== 'overview') {
            fetchData(activeTab);
        }
    }, [activeTab]);

    const fetchData = async (specificTab?: string) => {
        setLoading(true);
        const tab = specificTab || activeTab;

        try {
            // Map tabs to their respective API endpoints
            const endpointMap: Record<string, string> = {
                speakers: '/api/speakers',
                committee: '/api/committee',
                papers: '/api/paper/submit',
                registrations: '/api/register',
                inquiries: '/api/inquiries',
                resources: '/api/resources',
                sponsors: '/api/sponsors',
                awards: '/api/awards',
                'speaker applications': '/api/speakers/apply',
                messages: '/api/contact',
                subscribers: '/api/newsletter',
                'resource leads': '/api/leads',
                coupons: '/api/coupons',
                nominations: '/api/awards/nominations',
                'exit feedback': '/api/exit-feedback',
                'important dates': '/api/dates',
                testimonials: '/api/testimonials',
                'live testimonials': '/api/testimonials',
                pricing: '/api/prices'
            };

            if (tab === 'overview') {
                // Fetch basic counts for cards
                const [s, c, p, r, rl] = await Promise.all([
                    fetch('/api/speakers').then(res => res.json()),
                    fetch('/api/committee').then(res => res.json()),
                    fetch('/api/paper/submit').then(res => res.json()),
                    fetch('/api/register').then(res => res.json()),
                    fetch('/api/leads').then(res => res.json().catch(() => []))
                ]);
                setSpeakers(Array.isArray(s) ? s : []);
                setCommittee(Array.isArray(c) ? c : []);
                setPapers(Array.isArray(p) ? p : []);
                setRegistrations(Array.isArray(r) ? r : []);
                setResourceLeads(Array.isArray(rl) ? rl : []);
            } else if (endpointMap[tab]) {
                const res = await fetch(endpointMap[tab]);
                const data = await res.json();

                // Update specific state
                switch (tab) {
                    case 'speakers': setSpeakers(Array.isArray(data) ? data : []); break;
                    case 'committee': setCommittee(Array.isArray(data) ? data : []); break;
                    case 'papers': setPapers(Array.isArray(data) ? data : []); break;
                    case 'registrations': setRegistrations(Array.isArray(data) ? data : []); break;
                    case 'inquiries': setInquiries(Array.isArray(data) ? data : []); break;
                    case 'resources': setResources(Array.isArray(data) ? data : []); break;
                    case 'sponsors': setSponsors(Array.isArray(data) ? data : []); break;
                    case 'awards': setAwards(Array.isArray(data) ? data : []); break;
                    case 'speaker applications': setSpeakerApps(Array.isArray(data) ? data : []); break;
                    case 'messages': setMessages(Array.isArray(data) ? data : []); break;
                    case 'subscribers': setSubscribers(Array.isArray(data) ? data : []); break;
                    case 'resource leads': setResourceLeads(Array.isArray(data) ? data : []); break;
                    case 'coupons': setCoupons(data.coupons || []); break;
                    case 'nominations': setNominations(Array.isArray(data) ? data : []); break;
                    case 'exit feedback': setExitFeedback(data.feedbacks || []); break;
                    case 'important dates': setDynamicDates(Array.isArray(data) ? data : []); break;
                    case 'testimonials':
                    case 'live testimonials': setTestimonials(Array.isArray(data) ? data : []); break;
                    case 'pricing': setTicketPrices(Array.isArray(data) ? data : []); break;
                }
            }
        } catch (e) {
            console.error(`Failed to fetch ${tab} data`, e);
        } finally {
            setLoading(false);
        }
    };

    const handleConvertPaper = (paper: any) => {
        setPrefillData({
            firstName: paper.authorName?.split(' ')[0] || '',
            lastName: paper.authorName?.split(' ').slice(1).join(' ') || '',
            email: paper.email || ''
        });
        setActiveTab('registrations');
        setShowAddForm(true);
    };

    const handleUpdatePaperStatus = async (id: number, status: string, comments?: string) => {
        if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
        setLoading(true);
        try {
            const res = await fetch('/api/paper/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, comments })
            });
            if (res.ok) {
                // Granular update: Only fetch papers
                fetchData('papers');
                setShowReviewModal(false);
                setDecisionComments('');
            }
        } catch (e) {
            console.error("Failed to update paper status", e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSpeakerAppStatus = async (id: number, status: string) => {
        if (!confirm(`Are you sure you want to change status to ${status}? This will trigger ${status === 'ACCEPTED' ? 'an onboarding' : 'a status'} email to the applicant.`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/speakers/apply?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                // Granular update: Only fetch apps
                fetchData('speaker applications');
                setShowSpeakerAppModal(false);
            }
        } catch (e) {
            console.error("Failed to update status", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (paperId: number) => {
        setReviewLoading(true);
        try {
            const res = await fetch(`/api/paper/review?paperId=${paperId}`);
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to fetch reviews", e);
            setReviews([]);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const reviewData = {
            paperId: selectedPaper.id,
            reviewerName: formData.get('reviewerName'),
            score: formData.get('score'),
            comments: formData.get('comments')
        };

        try {
            const res = await fetch('/api/paper/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            if (res.ok) {
                fetchReviews(selectedPaper.id);
                setDecisionComments(reviewData.comments as string);
                (e.target as HTMLFormElement).reset();
            } else {
                const err = await res.json();
                alert('Failed to save review: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error("Failed to submit review", e);
            alert('Network error while submitting review');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const handleReorder = async (tab: string, newOrder: any[]) => {
        // Update local state immediately for smooth UI
        if (tab === 'speakers') setSpeakers(newOrder);
        else if (tab === 'committee') setCommittee(newOrder);

        const endpointMap: any = {
            speakers: 'speakers',
            committee: 'committee'
        };
        const endpoint = endpointMap[tab];
        if (!endpoint) return;

        const orders = newOrder.map((item, index) => ({
            id: item.id,
            displayOrder: index
        }));

        try {
            await fetch(`/api/${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders })
            });
        } catch (error) {
            console.error('Failed to save order:', error);
        }
    };

    const handleDelete = async (module: string, id: number) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        setLoading(true);
        const endpointMap: any = {
            registrations: 'register',
            papers: 'paper/submit',
            speakers: 'speakers',
            committee: 'committee',
            resources: 'resources',
            'resource leads': 'leads',
            'important dates': 'dates',
            'live testimonials': 'testimonials',
            'speaker applications': 'speakers/apply',
            sponsors: 'sponsors',
            awards: 'awards',
            'exit feedback': 'exit-feedback',
            coupons: 'coupons',
            messages: 'contact',
            subscribers: 'newsletter',
        };
        const endpoint = endpointMap[module] || module;

        try {
            const queryParamModules = ['resources', 'committee', 'speakers', 'coupons', 'paper/submit', 'register', 'dates', 'testimonials', 'awards', 'sponsors', 'speakers/apply', 'newsletter', 'exit-feedback', 'contact'];
            const url = queryParamModules.includes(endpoint) ? `/api/${endpoint}?id=${id}` : `/api/${endpoint}/${id}`;
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) {
                // Granular update: Only fetch the module that was just modified
                fetchData(module);
            } else {
                alert('Delete failed');
            }
        } catch (e) {
            console.error(`Failed to delete ${module}`, e);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        let dataToExport: any[] = [];
        let moduleName = activeTab;

        switch (activeTab) {
            case 'registrations': dataToExport = registrations; break;
            case 'papers': dataToExport = papers; break;
            case 'speakers': dataToExport = speakers; break;
            case 'committee': dataToExport = committee; break;
            case 'inquiries': dataToExport = inquiries; break;
            case 'subscribers': dataToExport = subscribers; break;
            case 'coupons': dataToExport = coupons; break;
            case 'resources': dataToExport = resources; break;
            case 'resource leads': dataToExport = resourceLeads; break;
            case 'awards': dataToExport = awards; break;
            case 'sponsors': dataToExport = sponsors; break;
            case 'speaker applications': dataToExport = speakerApps; break;
            case 'messages': dataToExport = messages; break;
            default: return alert('Export not available for this tab');
        }

        if (dataToExport.length === 0) return alert('No data to export');

        const headers = Object.keys(dataToExport[0]).filter(k => k !== 'id' && k !== 'fileUrl');
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${moduleName.replace(' ', '_')}_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const renderModuleContent = () => {
        let data: any[] = [];
        let columns: { label: string, key: string }[] = [];

        switch (activeTab) {
            case 'registrations':
                data = registrations;
                columns = [
                    { label: 'Name', key: 'firstName' },
                    { label: 'Email', key: 'email' },
                    { label: 'Ticket', key: 'ticketType' },
                    { label: 'Paid', key: 'hasPaid' }
                ];
                break;
            case 'speakers':
                data = speakers;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Designation', key: 'designation' },
                    { label: 'Org', key: 'org' },
                    { label: 'Type', key: 'type' }
                ];
                break;
            case 'papers':
                data = papers;
                columns = [
                    { label: 'Author', key: 'authorName' },
                    { label: 'Title', key: 'title' },
                    { label: 'Country', key: 'country' },
                    { label: 'Track', key: 'track' },
                    { label: 'Status', key: 'status' }
                ];
                break;
            case 'committee':
                data = committee;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Role', key: 'role' },
                    { label: 'Type', key: 'type' }
                ];
                break;
            case 'inquiries':
                data = inquiries;
                columns = [
                    { label: 'Name', key: 'fullName' },
                    { label: 'Email', key: 'email' },
                    { label: 'Phone', key: 'whatsappNumber' },
                    { label: 'Country', key: 'country' }
                ];
                break;
            case 'subscribers':
                data = subscribers;
                columns = [
                    { label: 'Email', key: 'email' },
                    { label: 'Joined', key: 'createdAt' }
                ];
                break;
            case 'coupons':
                data = coupons;
                columns = [
                    { label: 'Code', key: 'code' },
                    { label: 'Discount', key: 'discountValue' },
                    { label: 'Active', key: 'isActive' }
                ];
                break;
            case 'resources':
                data = resources;
                columns = [
                    { label: 'Title', key: 'title' },
                    { label: 'Category', key: 'category' },
                    { label: 'Visible', key: 'isVisible' }
                ];
                break;
            case 'resource leads':
                data = resourceLeads;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Email', key: 'email' },
                    { label: 'Resource', key: 'resource' },
                    { label: 'Date', key: 'createdAt' }
                ];
                break;
            case 'important dates':
                data = dynamicDates;
                columns = [
                    { label: 'Event', key: 'event' },
                    { label: 'Date', key: 'date' },
                    { label: 'Active', key: 'isActive' }
                ];
                break;
            case 'live testimonials':
                data = testimonials;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Message', key: 'message' },
                    { label: 'Rating', key: 'rating' },
                    { label: 'Active', key: 'isActive' }
                ];
                break;
            case 'speaker applications':
                data = speakerApps;
                columns = [
                    { label: 'Name', key: 'fullName' },
                    { label: 'Email', key: 'email' },
                    { label: 'Position', key: 'currentPosition' },
                    { label: 'Org', key: 'organization' },
                    { label: 'Title', key: 'sessionTitle' },
                    { label: 'Status', key: 'status' }
                ];
                break;
            case 'sponsors':
                data = sponsors;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Tier', key: 'tier' },
                    { label: 'Website', key: 'website' }
                ];
                break;
            case 'awards':
                data = awards;
                columns = [
                    { label: 'Title', key: 'title' },
                    { label: 'Category', key: 'category' }
                ];
                break;

            case 'exit feedback':
                data = exitFeedback;
                columns = [
                    { label: 'Email', key: 'email' },
                    { label: 'Reason', key: 'abandonReason' },
                    { label: 'Offered Coupon', key: 'wasOfferedCoupon' }
                ];
                break;
            case 'messages':
                data = messages;
                columns = [
                    { label: 'Name', key: 'name' },
                    { label: 'Email', key: 'email' },
                    { label: 'Subject', key: 'subject' },
                    { label: 'Message', key: 'message' },
                    { label: 'Date', key: 'createdAt' }
                ];
                break;
            default:
                data = [];
        }

        const filtered = data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        const isReorderable = !searchTerm && (activeTab === 'speakers' || activeTab === 'committee');

        return (
            <motion.div key={activeTab} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="chart-card">
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>{activeTab.toUpperCase()}</h2>
                        <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>{filtered.length} entries found {isReorderable && "(Drag to reorder)"}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="search-wrapper-v2">
                            <input
                                type="text"
                                placeholder="Filter results..."
                                className="price-input"
                                style={{ paddingLeft: '45px', width: '250px', margin: 0 }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={16} className="search-icon-v2" />
                        </div>
                        <button className="action-btn-v3" style={{ padding: '0.8rem 1.5rem', background: 'rgba(0, 255, 136, 0.1)', color: '#00FF88', borderColor: 'rgba(0, 255, 136, 0.2)' }} onClick={handleExportExcel}>
                            <DownloadCloud size={18} /> Export Excel
                        </button>
                        {!['overview', 'pricing', 'inquiries', 'subscribers', 'resource leads', 'exit feedback'].includes(activeTab) && (
                            <button className="action-btn-v3" style={{ padding: '0.8rem 1.5rem' }} onClick={() => { setPrefillData(null); setShowAddForm(true); }}>
                                <Plus size={18} /> New Entry
                            </button>
                        )}
                    </div>
                </div>

                <table className="premium-table">
                    <thead>
                        <tr>
                            {isReorderable && <th style={{ width: '50px' }}></th>}
                            {columns.map(col => <th key={col.key}>{col.label}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {isReorderable ? (
                        <Reorder.Group as="tbody" axis="y" values={filtered} onReorder={(newOrder) => handleReorder(activeTab, newOrder)}>
                            {filtered.map((item) => (
                                <Reorder.Item as="tr" key={item.id} value={item} style={{ background: 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ cursor: 'grab', color: 'rgba(255,255,255,0.2)' }}>
                                        <GripVertical size={16} />
                                    </td>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.key === 'hasPaid' || col.key === 'isActive' ? (
                                                <span className={`badge ${item[col.key] ? 'badge-green' : 'badge-purple'}`}>
                                                    {item[col.key] ? 'YES' : 'NO'}
                                                </span>
                                            ) : col.key === 'createdAt' ? (
                                                new Date(item[col.key]).toLocaleDateString()
                                            ) : (
                                                String(item[col.key] || 'N/A')
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* Speakers and Committee only have Edit/Delete in this view */}
                                            <button className="icon-btn-v2" style={{ color: '#5B4DFF' }} onClick={() => { setPrefillData(item); setShowAddForm(true); }}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="icon-btn-v2" style={{ color: '#FF4D4D' }} onClick={() => handleDelete(activeTab, item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    ) : (
                        <tbody>
                            {filtered.map((item, idx) => (
                                <tr key={idx}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.key === 'hasPaid' || col.key === 'isActive' ? (
                                                <span className={`badge ${item[col.key] ? 'badge-green' : 'badge-purple'}`}>
                                                    {item[col.key] ? 'YES' : 'NO'}
                                                </span>
                                            ) : col.key === 'createdAt' ? (
                                                new Date(item[col.key]).toLocaleDateString()
                                            ) : (
                                                String(item[col.key] || 'N/A')
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {activeTab === 'papers' && (
                                                <>
                                                    <button className="icon-btn-v2" style={{ color: '#00FF88' }} title="Convert to Registration" onClick={() => handleConvertPaper(item)}>
                                                        <UserPlus size={16} />
                                                    </button>
                                                    <button className="icon-btn-v2" style={{ color: '#00D9FF' }} title="Review Paper" onClick={() => {
                                                        setSelectedPaper(item);
                                                        fetchReviews(item.id);
                                                        setShowReviewModal(true);
                                                    }}>
                                                        <Eye size={16} />
                                                    </button>
                                                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="icon-btn-v2" style={{ color: '#FFB800' }} title="Download Paper">
                                                        <DownloadCloud size={16} />
                                                    </a>
                                                </>
                                            )}
                                            {activeTab === 'speaker applications' && (
                                                <>
                                                    <button className="icon-btn-v2" style={{ color: '#00D9FF' }} title="View Application Details" onClick={() => {
                                                        setSelectedSpeakerApp(item);
                                                        setShowSpeakerAppModal(true);
                                                    }}>
                                                        <Eye size={16} />
                                                    </button>
                                                    {item.status === 'PENDING' && (
                                                        <button className="icon-btn-v2" style={{ color: '#00FF88' }} title="Accept & Onboard" onClick={() => handleUpdateSpeakerAppStatus(item.id, 'ACCEPTED')}>
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button className="icon-btn-v2" style={{ color: '#5B4DFF' }} onClick={() => { setPrefillData(item); setShowAddForm(true); }}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="icon-btn-v2" style={{ color: '#FF4D4D' }} onClick={() => handleDelete(activeTab, item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: '5rem', textAlign: 'center', opacity: 0.3 }}>
                        No records found in {activeTab}.
                    </div>
                )}
            </motion.div>
        );
    };

    const handleUpdatePrice = async (type: string, price: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/prices', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, price: parseFloat(price) })
            });
            if (res.ok) {
                fetchData('pricing');
            }
        } catch (e) {
            console.error("Failed to update price", e);
        } finally {
            setLoading(false);
        }
    };

    // Revenue Calculations
    const revenueMetrics = useMemo(() => {
        let expected = 0;
        let collected = 0;

        const priceMap = ticketPrices.reduce((acc, p) => ({ ...acc, [p.type]: p.price }), {});

        registrations.forEach(reg => {
            const price = priceMap[reg.ticketType] || 0;
            const discountedPrice = Math.max(0, price - (reg.discountApplied || 0));
            expected += discountedPrice;
            if (reg.hasPaid) {
                collected += discountedPrice;
            }
        });

        return {
            expected: Math.round(expected),
            collected: Math.round(collected),
            percentage: expected > 0 ? Math.round((collected / expected) * 100) : 0
        };
    }, [registrations, ticketPrices]);

    // Live Traffic Simulation
    const [liveTraffic, setLiveTraffic] = useState<{ name: string, value: number }[]>([]);
    useEffect(() => {
        const initialData = Array.from({ length: 20 }, (_, i) => ({
            name: i.toString(),
            value: 40 + Math.random() * 20
        }));
        setLiveTraffic(initialData);

        const interval = setInterval(() => {
            setLiveTraffic(prev => {
                const newValue = Math.max(20, Math.min(100, (prev[prev.length - 1]?.value || 50) + (Math.random() - 0.5) * 15));
                return [...prev.slice(1), { name: Date.now().toString(), value: newValue }];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const chartData = useMemo(() => [
        { name: 'Mon', value: 4 },
        { name: 'Tue', value: 12 },
        { name: 'Wed', value: registrations.length > 5 ? registrations.length - 2 : 8 },
        { name: 'Thu', value: registrations.length > 2 ? registrations.length : 15 },
        { name: 'Fri', value: Math.max(registrations.length + 5, 22) },
        { name: 'Sat', value: 18 },
        { name: 'Sun', value: Math.max(registrations.length + 10, 30) },
    ], [registrations.length]);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'General' },
        { id: 'pricing', label: 'Ticket Pricing', icon: DollarSign, section: 'General' },
        { id: 'registrations', label: 'Enrollment', icon: UserPlus, section: 'Conference' },
        { id: 'speakers', label: 'Speakers', icon: Megaphone, section: 'Conference' },
        { id: 'committee', label: 'Committee', icon: ShieldCheck, section: 'Conference' },
        { id: 'papers', label: 'Papers', icon: FileText, section: 'Submissions' },
        { id: 'speaker applications', label: 'Applicant Review', icon: UsersRound, section: 'Submissions' },
        { id: 'important dates', label: 'Dynamic Dates', icon: Calendar, section: 'Dynamic Content' },
        { id: 'live testimonials', label: 'Testimonials', icon: Star, section: 'Dynamic Content' },
        { id: 'resources', label: 'Resources', icon: FolderOpen, section: 'Assets' },
        { id: 'resource leads', label: 'Resource Leads', icon: Users, section: 'Assets' },
        { id: 'sponsors', label: 'Sponsors', icon: Package, section: 'Business' },
        { id: 'awards', label: 'Awards', icon: Award, section: 'Business' },
        { id: 'coupons', label: 'Coupons', icon: Zap, section: 'Business' },
        { id: 'exit feedback', label: 'Analytics', icon: TrendingUp, section: 'Business' },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, section: 'Communication' },
        { id: 'subscribers', label: 'Newsletter', icon: Mail, section: 'Communication' },
        { id: 'messages', label: 'Contact Msgs', icon: MessageSquare, section: 'Communication' },
    ];

    return (
        <div className="dashboard-wrapper">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                body { background-color: #050510; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
                header.main-header, footer.main-footer { display: none !important; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                ::-webkit-scrollbar-thumb { background: rgba(91,77,255,0.2); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(91,77,255,0.4); }
                .live-dot { width: 8px; height: 8px; background: #00FF88; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 10px #00FF88; animation: pulse-dot 1.5s infinite; }
                @keyframes pulse-dot { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
                .price-input { 
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    color: white; 
                    padding: 12px 20px; 
                    border-radius: 14px; 
                    font-weight: 500; 
                    width: 100%; 
                    text-align: left; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    font-size: 0.95rem;
                }
                .price-input:focus { 
                    border-color: #5B4DFF; 
                    outline: none; 
                    background: rgba(255,255,255,0.08); 
                    box-shadow: 0 0 20px rgba(91,77,255,0.15);
                }
                .input-field-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-label-premium {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding-left: 4px;
                }
                .file-upload-zone {
                    border: 2px dashed rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 16px;
                    text-align: center;
                    background: rgba(255,255,255,0.01);
                    transition: all 0.3s ease;
                }
                .file-upload-zone:hover {
                    border-color: #5B4DFF;
                    background: rgba(91,77,255,0.05);
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }
            `}</style>

            {/* Sidebar */}
            <motion.aside className="sidebar" initial={{ x: -280 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 120 }} style={{ overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
                <div className="sidebar-logo">
                    <div className="logo-icon-v2 small">W</div>
                    <span className="sidebar-logo-text">WARS '26</span>
                </div>
                <div className="nav-group">
                    {['General', 'Conference', 'Submissions', 'Dynamic Content', 'Assets', 'Business', 'Communication'].map((section) => (
                        <div key={section} className="nav-group-section">
                            <span className="nav-section-label" style={{ fontSize: '0.65rem', opacity: 0.3 }}>{section}</span>
                            {navItems.filter(i => i.section === section).map((item) => (
                                <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)} style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                                    <item.icon className="nav-icon-v3" style={{ width: '18px' }} />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="logout-btn-nav" onClick={handleLogout} style={{ marginTop: '2.5rem' }}>
                    <LogOut className="nav-icon-v3" /> Logout
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="main-content">
                <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="header-title">
                        <h1 style={{ letterSpacing: '-0.05em' }}>{activeTab.toUpperCase()}</h1>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="live-dot"></span>
                            <span style={{ color: '#00FF88', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>REVENUE MONITOR ACTIVE</span>
                        </p>
                    </div>
                    <div className="header-actions" style={{ gap: '1rem', display: 'flex', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', lineHeight: '1.2' }}>{userEmail || 'Admin User'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>ACCESS GRANTED</div>
                        </div>
                        <div className="stat-icon-wrapper" style={{ width: '42px', height: '42px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', marginBottom: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>
                                {userEmail ? userEmail[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </motion.header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            {/* Primary Stats - Row 1 */}
                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#00FF88', background: 'rgba(0,255,136,0.1)' }}><DollarSign size={24} /></div>
                                    <div className="stat-label-v2">Revenue Collected</div>
                                    <div className="stat-value-v2" style={{ color: '#00FF88' }}>${revenueMetrics.collected.toLocaleString()}</div>
                                    <div className="stat-trend-v2 trend-up-v2">{revenueMetrics.percentage}% of Goal</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#5B4DFF', background: 'rgba(91,77,255,0.1)' }}><TrendingUp size={24} /></div>
                                    <div className="stat-label-v2">Pipeline Value</div>
                                    <div className="stat-value-v2">${revenueMetrics.expected.toLocaleString()}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>Expected Total</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#00D9FF', background: 'rgba(0,217,255,0.1)' }}><Users size={24} /></div>
                                    <div className="stat-label-v2">Total Participants</div>
                                    <div className="stat-value-v2">{registrations.length}</div>
                                    <div className="stat-trend-v2" style={{ color: '#00D9FF', background: 'rgba(0,217,255,0.1)' }}>{registrations.filter(r => r.hasPaid).length} Paid</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#FFB800', background: 'rgba(255,184,0,0.1)' }}><Ticket size={24} /></div>
                                    <div className="stat-label-v2">Avg. Ticket Price</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.5rem' }}>${Math.round(revenueMetrics.expected / (registrations.length || 1))}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>Real-time Dynamic</div>
                                </motion.div>
                            </div>

                            {/* Primary Stats - Row 2 (New) */}
                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2.5rem' }}>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#FF4DFF', background: 'rgba(255,77,255,0.1)' }}><Megaphone size={24} /></div>
                                    <div className="stat-label-v2">Total Speakers</div>
                                    <div className="stat-value-v2">{speakers.length}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(255,77,255,0.1)', color: '#FF4DFF' }}>Active Presenters</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#7000FF', background: 'rgba(112,0,255,0.1)' }}><ShieldCheck size={24} /></div>
                                    <div className="stat-label-v2">Committee Members</div>
                                    <div className="stat-value-v2">{committee.length}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(112,0,255,0.1)', color: '#7000FF' }}>Review Board</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#FF8800', background: 'rgba(255,136,0,0.1)' }}><FileText size={24} /></div>
                                    <div className="stat-label-v2">Papers Submitted</div>
                                    <div className="stat-value-v2">{papers.length}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(255,136,0,0.1)', color: '#FF8800' }}>Full Manuscripts</div>
                                </motion.div>
                                <motion.div className="stat-card-v2" whileHover={{ y: -5 }}>
                                    <div className="stat-icon-wrapper" style={{ color: '#0088FF', background: 'rgba(0,136,255,0.1)' }}><UserPlus size={24} /></div>
                                    <div className="stat-label-v2">Registrations</div>
                                    <div className="stat-value-v2">{registrations.length}</div>
                                    <div className="stat-trend-v2" style={{ background: 'rgba(0,136,255,0.1)', color: '#0088FF' }}>Live Database</div>
                                </motion.div>
                            </div>

                            <div className="charts-container" style={{ gridTemplateColumns: '2fr 1fr' }}>
                                <motion.div className="chart-card">
                                    <div className="chart-header">
                                        <div className="chart-title">Global Enrollment Performance</div>
                                    </div>
                                    <div style={{ width: '100%', height: '350px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#5B4DFF" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#5B4DFF" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                                <Tooltip contentStyle={{ background: '#0A0A19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                                                <Area type="monotone" dataKey="value" stroke="#5B4DFF" strokeWidth={5} fillOpacity={1} fill="url(#colorMain)" animationDuration={2500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <motion.div className="chart-card" style={{ padding: '1.5rem' }}>
                                        <div className="chart-title" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}><Activity size={16} style={{ marginRight: '8px' }} /> LIVE TRAFFIC</div>
                                        <div style={{ width: '100%', height: '120px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={liveTraffic}>
                                                    <Line type="monotone" dataKey="value" stroke="#00FF88" strokeWidth={3} dot={false} isAnimationActive={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                    <motion.div className="chart-card" style={{ flex: 1, padding: '1.5rem' }}>
                                        <div className="chart-title" style={{ fontSize: '0.9rem' }}>Quick Pricing Sync</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                                            {ticketPrices.slice(0, 3).map(p => (
                                                <div key={p.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.type}</span>
                                                    <span style={{ fontWeight: 800 }}>${p.price}</span>
                                                </div>
                                            ))}
                                            <button className="action-btn-v3" style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '0.7rem' }} onClick={() => setActiveTab('pricing')}>Manage All Prices</button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Restoring Quick Actions */}
                            <div className="quick-actions-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', margin: '2.5rem 0' }}>
                                <motion.button whileHover={{ scale: 1.05 }} className="action-btn-v3" onClick={() => setActiveTab('registrations')}>
                                    <UserPlus size={18} /> Add Attendee
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} className="action-btn-v3" onClick={() => setActiveTab('speakers')}>
                                    <Megaphone size={18} /> Manage Speakers
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} className="action-btn-v3" onClick={() => setActiveTab('papers')}>
                                    <FileText size={18} /> Review Papers
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} className="action-btn-v3" onClick={() => setActiveTab('inquiries')}>
                                    <MessageSquare size={18} /> Support Inquiries
                                </motion.button>
                            </div>

                            {/* Restoring Secondary Stats Grid */}
                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div className="stat-card-v2 mini">
                                    <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>Subscribers</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.2rem' }}>{subscribers.length}</div>
                                </div>
                                <div className="stat-card-v2 mini">
                                    <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>Resources</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.2rem' }}>{resources.length}</div>
                                </div>
                                <div className="stat-card-v2 mini">
                                    <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>Leads</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.2rem' }}>{resourceLeads.length}</div>
                                </div>
                                <div className="stat-card-v2 mini">
                                    <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>Coupons</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.2rem' }}>{coupons.length}</div>
                                </div>
                                <div className="stat-card-v2 mini">
                                    <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>Pending Inquiries</div>
                                    <div className="stat-value-v2" style={{ fontSize: '1.2rem' }}>{inquiries.length}</div>
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <motion.div className="premium-table-container">
                                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ margin: 0 }}>Recent Global Activity</h3>
                                    <div className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={14} /> LIVE MONITORING</div>
                                </div>
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>Detail</th>
                                            <th>Type</th>
                                            <th>Financial Value</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Merged Activity List */}
                                        {[...registrations.slice(0, 3).map(r => ({ ...r, activityType: 'REGISTRATION' })),
                                        ...papers.slice(0, 2).map(p => ({ ...p, activityType: 'PAPER' }))]
                                            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                                            .map((item: any, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div style={{ fontWeight: 700 }}>{item.activityType === 'REGISTRATION' ? `${item.firstName} ${item.lastName}` : (item.authorName || 'Anonymous')}</div>
                                                        <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{item.activityType === 'REGISTRATION' ? item.email : (item.email || 'Paper Submission')}</div>
                                                    </td>
                                                    <td><span className={`badge ${item.activityType === 'REGISTRATION' ? 'badge-purple' : 'badge-green'}`}>{item.activityType}</span></td>
                                                    <td><div style={{ fontWeight: 900 }}>{item.activityType === 'REGISTRATION' ? `$${ticketPrices.find(p => p.type === item.ticketType)?.price || 0}` : 'FREE'}</div></td>
                                                    <td>
                                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{item.status || 'PROCESSED'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'pricing' && (
                        <motion.div key="pricing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="chart-card">
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Dynamic Ticket Pricing</h2>
                                    <p style={{ opacity: 0.5 }}>Changes here reflect instantly in the registration section and revenue calculations.</p>
                                </div>
                                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                    {ticketPrices.map(p => (
                                        <motion.div key={p.id} className="stat-card-v2" whileHover={{ scale: 1.02 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div className="stat-label-v2" style={{ color: '#5B4DFF' }}>{p.type.replace('_', ' ')}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.4, marginBottom: '1.5rem' }}>{p.label}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>$</div>
                                                <input
                                                    type="number"
                                                    className="price-input"
                                                    defaultValue={p.price}
                                                    onBlur={(e) => handleUpdatePrice(p.type, e.target.value)}
                                                />
                                                <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px', margin: 0, background: 'rgba(91,77,255,0.1)', color: '#5B4DFF' }}>
                                                    <RefreshCw size={18} />
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '1.5rem', fontSize: '0.65rem', opacity: 0.3, display: 'flex', justifyContent: 'space-between' }}>
                                                <span>LAST UPDATED</span>
                                                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="chart-card" style={{ marginTop: '3rem', background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,255,136,0) 100%)', border: '1px solid rgba(0,255,136,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div className="stat-icon-wrapper" style={{ margin: 0, background: 'rgba(0,255,136,0.1)', color: '#00FF88' }}><Zap size={24} /></div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>Auto-Sync Active</h3>
                                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>The registration page is now pulling price data from this secure API.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== 'overview' && activeTab !== 'pricing' && renderModuleContent()}
                </AnimatePresence>

                {/* Manual Add Entry Modal */}
                <AnimatePresence>
                    {showAddForm && (
                        <div className="premium-modal-overlay" onClick={() => setShowAddForm(false)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="premium-modal-content"
                                onClick={e => e.stopPropagation()}
                            >
                                <button className="modal-close-btn" onClick={() => setShowAddForm(false)}>✕</button>
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '-0.04em', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {activeTab === 'resources' ? 'Add Resource' : activeTab === 'speakers' ? 'Add Speaker' : activeTab === 'committee' ? 'Add Committee' : `Add ${activeTab.slice(0, -1)}`}
                                    </h2>
                                    <p style={{ opacity: 0.4, fontSize: '0.95rem', fontWeight: 500 }}>Global database entry for {activeTab}.</p>
                                </div>

                                <form style={{ display: 'grid', gap: '1.5rem' }} onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);

                                    const endpointMap: any = {
                                        registrations: 'register',
                                        papers: 'paper/submit',
                                        speakers: 'speakers',
                                        committee: 'committee',
                                        resources: 'resources',
                                        'resource leads': 'leads',
                                        'important dates': 'dates',
                                        'live testimonials': 'testimonials',
                                        'speaker applications': 'speakers/apply',
                                        sponsors: 'sponsors',
                                        awards: 'awards',
                                        coupons: 'coupons',
                                        'exit feedback': 'exit-feedback'
                                    };
                                    const endpoint = endpointMap[activeTab] || activeTab;
                                    const isMultipart = ['resources', 'papers', 'speakers', 'committee', 'live testimonials'].includes(activeTab);

                                    try {
                                        let payload: any;
                                        if (isMultipart) {
                                            payload = formData;
                                        } else {
                                            payload = Object.fromEntries(formData.entries());
                                            // Numeric and Boolean Conversions
                                            if (payload.hasPaid) payload.hasPaid = payload.hasPaid === 'true';
                                            if (payload.isActive) payload.isActive = payload.isActive === 'true';
                                            if (payload.isVisible) payload.isVisible = payload.isVisible === 'true';
                                            if (payload.wasOfferedCoupon) payload.wasOfferedCoupon = payload.wasOfferedCoupon === 'true';
                                            if (payload.order) payload.order = parseInt(payload.order);
                                            if (payload.rating) payload.rating = parseInt(payload.rating);
                                            if (payload.discountValue) payload.discountValue = parseFloat(payload.discountValue);
                                            if (payload.maxUses) payload.maxUses = parseInt(payload.maxUses);
                                            if (payload.duration) payload.duration = parseInt(payload.duration);
                                            if (payload.score) payload.score = parseInt(payload.score);

                                            payload = JSON.stringify(payload);
                                        }

                                        const fetchOptions: any = {
                                            method: prefillData ? 'PATCH' : 'POST',
                                            body: payload
                                        };
                                        if (!isMultipart) fetchOptions.headers = { 'Content-Type': 'application/json' };

                                        const url = prefillData
                                            ? `/api/${endpoint}?id=${prefillData.id}`
                                            : `/api/${endpoint}`;

                                        const res = await fetch(url, fetchOptions);
                                        if (res.ok) {
                                            fetchData(activeTab);
                                            setShowAddForm(false);
                                            setPrefillData(null);
                                        } else {
                                            const errData = await res.json();
                                            alert(`Failed to save: ${errData.error || 'Unknown error'}`);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}>
                                    {activeTab === 'registrations' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">First Name</label>
                                                    <input name="firstName" placeholder="John" className="price-input" required defaultValue={prefillData?.firstName || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Last Name</label>
                                                    <input name="lastName" placeholder="Doe" className="price-input" required defaultValue={prefillData?.lastName || ''} />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Email Address</label>
                                                <input name="email" type="email" placeholder="john.doe@example.com" className="price-input" required defaultValue={prefillData?.email || ''} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Organization</label>
                                                    <input name="org" placeholder="University / Company" className="price-input" defaultValue={prefillData?.org || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Designation / Role</label>
                                                    <input name="role" placeholder="Professor / Student" className="price-input" defaultValue={prefillData?.role || ''} />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Ticket Type Selection</label>
                                                <select name="ticketType" className="price-input" required defaultValue={prefillData?.ticketType}>
                                                    {ticketPrices.map(t => <option key={t.type} value={t.type}>{t.label} — ${t.price}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Attendance Mode</label>
                                                    <select name="attendanceMode" className="price-input" defaultValue={prefillData?.attendanceMode || 'IN_PERSON'}>
                                                        <option value="IN_PERSON">In Person</option>
                                                        <option value="VIRTUAL">Virtual / Remote</option>
                                                    </select>
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Payment Status</label>
                                                    <select name="hasPaid" className="price-input" defaultValue={prefillData ? String(prefillData.hasPaid) : 'false'}>
                                                        <option value="true">PAID (Confirm Full Payment)</option>
                                                        <option value="false">UNPAID (Pending Verification)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'papers' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Author Name</label>
                                                    <input name="authorName" placeholder="Dr. Alan Turing" className="price-input" required defaultValue={prefillData?.authorName || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Author Email</label>
                                                    <input name="email" type="email" placeholder="turing@university.edu" className="price-input" required defaultValue={prefillData?.email || ''} />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Paper Title</label>
                                                <input name="title" placeholder="A Computation of Neural Networks..." className="price-input" required defaultValue={prefillData?.title || ''} />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Manuscript Status</label>
                                                <select name="status" className="price-input" defaultValue={prefillData?.status || 'PENDING'}>
                                                    <option value="PENDING">Pending Initial Verification</option>
                                                    <option value="UNDER_REVIEW">Currently Under Review</option>
                                                    <option value="ACCEPTED">Accepted for Presentation</option>
                                                    <option value="REJECTED">Rejected / Archive</option>
                                                    <option value="NEEDS_REVISION">Revision Requested</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Conference Track</label>
                                                    <input name="track" placeholder="Robotics / AI Ethics" className="price-input" required defaultValue={prefillData?.track || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Organization</label>
                                                    <input name="organization" placeholder="Global Tech Institute" className="price-input" required defaultValue={prefillData?.organization || ''} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">WhatsApp Number</label>
                                                    <input name="whatsappNumber" placeholder="+91 9876543210" className="price-input" defaultValue={prefillData?.whatsappNumber || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Country</label>
                                                    <input name="country" placeholder="United Kingdom" className="price-input" required defaultValue={prefillData?.country || ''} />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Co-Authors / Attributes</label>
                                                <input name="coAuthors" placeholder="John Doe, Jane Smith..." className="price-input" defaultValue={prefillData?.coAttributes || ''} />
                                            </div>
                                            {!prefillData && (
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Full Manuscript (PDF/Doc)</label>
                                                    <div className="file-upload-zone">
                                                        <input name="file" type="file" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }} required />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'important dates' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Event Name</label>
                                                    <input name="event" placeholder="Early Bird Deadline" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Display Date</label>
                                                    <input name="date" placeholder="October 15, 2026" className="price-input" required />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Note (Optional)</label>
                                                    <input name="note" placeholder="Extended by 1 week" className="price-input" />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Sort Order</label>
                                                    <input name="order" type="number" placeholder="0" className="price-input" defaultValue="0" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'live testimonials' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Full Name</label>
                                                    <input name="name" placeholder="Sarah Connor" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Designation / Org</label>
                                                    <input name="designation" placeholder="CEO, SkyNet" className="price-input" />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Message Body</label>
                                                <textarea name="message" placeholder="This conference changed my outlook on..." className="price-input" style={{ height: '100px', textAlign: 'left' }} required />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Rating (1-5)</label>
                                                <input name="rating" type="number" placeholder="5" className="price-input" defaultValue="5" min="1" max="5" />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Profile Photo</label>
                                                <div className="file-upload-zone">
                                                    <input name="file" type="file" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'resources' && (
                                        <>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Resource Title</label>
                                                <input name="title" placeholder="Conference Poster Template" className="price-input" required />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Resource Category</label>
                                                <select name="category" className="price-input" required>
                                                    <option value="Template">Template</option>
                                                    <option value="Guidelines">Guidelines</option>
                                                    <option value="Flyer">Flyer</option>
                                                    <option value="Schedule">Schedule</option>
                                                </select>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Asset File (PDF/Image)</label>
                                                <div className="file-upload-zone">
                                                    <input name="file" type="file" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }} required />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'sponsors' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Sponsor Name</label>
                                                    <input name="name" placeholder="Global Corp" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Sponsorship Tier</label>
                                                    <select name="tier" className="price-input">
                                                        <option value="PLATINUM">Platinum Tier</option>
                                                        <option value="GOLD">Gold Tier</option>
                                                        <option value="SILVER">Silver Tier</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Website URL</label>
                                                <input name="website" placeholder="https://sponsor.com" className="price-input" />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Logo URL (Alternative to File)</label>
                                                <input name="logoUrl" placeholder="Direct image link..." className="price-input" />
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'awards' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Award Title</label>
                                                    <input name="title" placeholder="Best Paper Award" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Award Category</label>
                                                    <input name="category" placeholder="Research / Innovation" className="price-input" required />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Description</label>
                                                <textarea name="description" placeholder="Eligibility and details..." className="price-input" style={{ height: '80px', textAlign: 'left' }} />
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'speakers' && (
                                        <>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Full Name</label>
                                                <input name="name" placeholder="Dr. John Doe" className="price-input" required />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Role / Designation</label>
                                                    <input name="role" placeholder="Associate Professor" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Affiliation</label>
                                                    <input name="affiliation" placeholder="MIT, USA" className="price-input" required />
                                                </div>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Biography</label>
                                                <textarea name="bio" placeholder="Describe the speaker's background..." className="price-input" style={{ height: '120px', textAlign: 'left', lineHeight: '1.6' }} />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Speaker Category</label>
                                                <select name="type" className="price-input" style={{ width: '100%', appearance: 'none' }}>
                                                    <option value="KEYNOTE">Keynote Speaker</option>
                                                    <option value="PLENARY">Plenary Speaker</option>
                                                    <option value="INVITED">Invited Speaker</option>
                                                </select>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Profile Photo</label>
                                                <div className="file-upload-zone">
                                                    <input name="file" type="file" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'committee' && (
                                        <>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Member Name</label>
                                                <input name="name" placeholder="Full Name" className="price-input" required />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Position / Role</label>
                                                <input name="role" placeholder="Committee Chair" className="price-input" required />
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Committee Type</label>
                                                <select name="type" className="price-input" style={{ width: '100%' }}>
                                                    <option value="SCIENTIFIC">Scientific Committee</option>
                                                    <option value="ORGANIZING">Organizing Committee</option>
                                                </select>
                                            </div>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Profile Photo</label>
                                                <div className="file-upload-zone">
                                                    <input name="file" type="file" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'coupons' && (
                                        <>
                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Coupon Code</label>
                                                <input name="code" placeholder="e.g. FLASH20" className="price-input" required />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Type</label>
                                                    <select name="discountType" className="price-input" required>
                                                        <option value="PERCENTAGE">Percentage (%)</option>
                                                        <option value="FIXED">Fixed Amount ($)</option>
                                                    </select>
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Value</label>
                                                    <input name="discountValue" type="number" placeholder="10" className="price-input" required />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Max Uses</label>
                                                    <input name="maxUses" type="number" placeholder="100" className="price-input" required />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Valid Until</label>
                                                    <input name="validUntil" type="date" className="price-input" required />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'speaker applications' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Applicant Name</label>
                                                    <input name="fullName" placeholder="Ada Lovelace" className="price-input" required defaultValue={prefillData?.fullName || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Contact Email</label>
                                                    <input name="email" type="email" placeholder="ada@analytical.com" className="price-input" required defaultValue={prefillData?.email || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">WhatsApp Number</label>
                                                    <input name="whatsappNumber" placeholder="+65 8XXX-XXXX" className="price-input" required defaultValue={prefillData?.whatsappNumber || ''} />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Current Position (Role)</label>
                                                    <input name="role" placeholder="Senior Research Scientist" className="price-input" required defaultValue={prefillData?.currentPosition || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Organization</label>
                                                    <input name="company" placeholder="Analytical Engine Inc." className="price-input" required defaultValue={prefillData?.organization || ''} />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">LinkedIn URL (Optional)</label>
                                                    <input name="linkedin" placeholder="https://linkedin.com/in/ada..." className="price-input" defaultValue={prefillData?.linkedinUrl || ''} />
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Website URL (Optional)</label>
                                                    <input name="website" placeholder="https://adalovelace.com" className="price-input" defaultValue={prefillData?.websiteUrl || ''} />
                                                </div>
                                            </div>

                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Speaker Bio</label>
                                                <textarea name="bio" placeholder="Brief biography of the speaker..." className="price-input" style={{ height: '100px', textAlign: 'left' }} required defaultValue={prefillData?.bio || ''} />
                                            </div>

                                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Session Title</label>
                                                <input name="title" placeholder="Future of Computational Engines" className="price-input" required defaultValue={prefillData?.sessionTitle || ''} />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Session Format</label>
                                                    <select name="type" className="price-input" required defaultValue={prefillData?.sessionType || 'Keynote'}>
                                                        <option value="Keynote">Keynote</option>
                                                        <option value="Workshop">Workshop</option>
                                                        <option value="Panel">Panel Discussion</option>
                                                        <option value="Breakout">Breakout Session</option>
                                                    </select>
                                                </div>
                                                <div className="input-field-wrapper">
                                                    <label className="input-label-premium">Duration (Minutes)</label>
                                                    <input name="duration" type="number" placeholder="45" className="price-input" required defaultValue={prefillData?.durationPreference || 45} />
                                                </div>
                                            </div>

                                            <div className="input-field-wrapper">
                                                <label className="input-label-premium">Session Abstract</label>
                                                <textarea name="description" placeholder="Detailed summary of the session..." className="price-input" style={{ height: '120px', textAlign: 'left' }} required defaultValue={prefillData?.sessionDescription || ''} />
                                            </div>
                                        </>
                                    )}
                                    <button type="submit" className="glow-btn" style={{ height: '56px', fontSize: '1.1rem', marginTop: '1.5rem', borderRadius: '16px' }}>
                                        {activeTab === 'resources' ? 'Add Resource' :
                                            activeTab === 'speakers' ? 'Add Speaker' :
                                                activeTab === 'coupons' ? 'Create Coupon' :
                                                    activeTab === 'registrations' ? 'Register Attendee' :
                                                        activeTab === 'papers' ? 'Submit Paper' :
                                                            activeTab === 'important dates' ? 'Save Date' :
                                                                activeTab === 'live testimonials' ? 'Publish Testimonial' :
                                                                    activeTab === 'committee' ? 'Add Member' :
                                                                        activeTab === 'sponsors' ? 'Add Sponsor' :
                                                                            activeTab === 'awards' ? 'Create Award' :
                                                                                activeTab === 'speaker applications' ? 'Create Application' :
                                                                                    'Update Database'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                    {/* Paper Review Modal */}
                    {showReviewModal && selectedPaper && (
                        <div className="premium-modal-overlay" onClick={() => setShowReviewModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="premium-modal-content wide"
                                style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#5B4DFF', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px' }}>PEER REVIEW SYSTEM</div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{selectedPaper.title || 'Untitled Submission'}</h2>
                                    </div>
                                    <button className="icon-btn-v2" onClick={() => setShowReviewModal(false)}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', padding: '2rem', overflowY: 'auto' }}>
                                    {/* Left: Paper Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div className="stat-card-v2 mini" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>AUTHOR DETAILS</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{selectedPaper.authorName}</div>
                                            <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>{selectedPaper.organization}</div>
                                            <div style={{ opacity: 0.8, fontSize: '0.85rem', color: '#1bcc7e' }}>{selectedPaper.country}</div>

                                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                <div style={{ color: '#5B4DFF', fontSize: '0.85rem', fontWeight: 600 }}>📧 {selectedPaper.email}</div>
                                                <div style={{ color: '#25D366', fontSize: '0.85rem', fontWeight: 600 }}>💬 {selectedPaper.whatsappNumber || 'No WhatsApp provided'}</div>
                                            </div>

                                            {selectedPaper.coAttributes && (
                                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div style={{ fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '5px' }}>CO-AUTHORS</div>
                                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{selectedPaper.coAttributes}</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="stat-card-v2 mini" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>SUBMISSION INFO</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ opacity: 0.4 }}>Track:</span>
                                                <span style={{ fontWeight: 600 }}>{selectedPaper.track || 'Unassigned'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ opacity: 0.4 }}>Status:</span>
                                                <span className={`badge ${selectedPaper.status === 'ACCEPTED' ? 'badge-green' :
                                                    selectedPaper.status === 'REJECTED' ? 'badge-red' :
                                                        selectedPaper.status === 'UNDER_REVIEW' ? 'badge-blue' :
                                                            selectedPaper.status === 'NEEDS_REVISION' ? 'badge-yellow' :
                                                                'badge-purple'
                                                    }`}>{selectedPaper.status.replace('_', ' ')}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ opacity: 0.4 }}>Submitted:</span>
                                                <span>{new Date(selectedPaper.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <a href={selectedPaper.fileUrl} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ textDecoration: 'none' }}>
                                            <DownloadCloud size={18} /> Download Full Paper
                                        </a>

                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div className="stat-label-v2" style={{ fontSize: '0.7rem' }}>FINAL DECISION PANEL</div>
                                            <textarea
                                                value={decisionComments}
                                                onChange={(e) => setDecisionComments(e.target.value)}
                                                placeholder="Final feedback for the author (included in email)..."
                                                className="price-input"
                                                style={{ height: '80px', textAlign: 'left', fontSize: '0.85rem' }}
                                            />

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                <button
                                                    className="action-btn-v3"
                                                    style={{ color: '#5B4DFF', borderColor: 'rgba(91,77,255,0.2)' }}
                                                    onClick={() => handleUpdatePaperStatus(selectedPaper.id, 'UNDER_REVIEW')}
                                                >
                                                    START REVIEW
                                                </button>
                                                <button
                                                    className="action-btn-v3"
                                                    style={{ color: '#FFB800', borderColor: 'rgba(255,184,0,0.2)' }}
                                                    onClick={() => handleUpdatePaperStatus(selectedPaper.id, 'NEEDS_REVISION', decisionComments)}
                                                >
                                                    NEED REVISION
                                                </button>
                                                <button
                                                    className="action-btn-v3"
                                                    style={{ color: '#00FF88', borderColor: 'rgba(0,255,136,0.2)' }}
                                                    onClick={() => handleUpdatePaperStatus(selectedPaper.id, 'ACCEPTED', decisionComments)}
                                                >
                                                    ACCEPT
                                                </button>
                                                <button
                                                    className="action-btn-v3"
                                                    style={{ color: '#FF4D4D', borderColor: 'rgba(255,77,77,0.2)' }}
                                                    onClick={() => handleUpdatePaperStatus(selectedPaper.id, 'REJECTED', decisionComments)}
                                                >
                                                    REJECT
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Reviews */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div className="chart-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Add New Review</h3>
                                            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <input name="reviewerName" placeholder="Reviewer Name" className="price-input" required />
                                                    <select name="score" className="price-input" required>
                                                        <option value="">Score (1-10)</option>
                                                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s}/10</option>)}
                                                    </select>
                                                </div>
                                                <textarea name="comments" placeholder="Technical comments and observations..." className="price-input" style={{ height: '100px', textAlign: 'left' }} required />
                                                <button type="submit" className="action-btn-v3" style={{ alignSelf: 'flex-end', padding: '0.8rem 1.5rem' }}>Submit Review</button>
                                            </form>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <h3 style={{ fontSize: '1rem' }}>Review History ({Array.isArray(reviews) ? reviews.length : 0})</h3>
                                            {reviewLoading ? (
                                                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>Loading reviews...</div>
                                            ) : !Array.isArray(reviews) || reviews.length === 0 ? (
                                                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.3, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>No reviews yet</div>
                                            ) : (
                                                reviews.map((rev, i) => (
                                                    <div key={i} className="stat-card-v2 mini" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontWeight: 700 }}>{rev.reviewerName}</span>
                                                            <span style={{ color: '#00FF88', fontWeight: 900 }}>{rev.score}/10</span>
                                                        </div>
                                                        <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.comments}</p>
                                                        <div style={{ marginTop: '8px', fontSize: '0.7rem', opacity: 0.3 }}>{new Date(rev.createdAt).toLocaleString()}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {showSpeakerAppModal && selectedSpeakerApp && (
                        <div className="premium-modal-overlay" onClick={() => setShowSpeakerAppModal(false)}>
                            <motion.div
                                className="premium-modal-content wide"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Application Details</h2>
                                    <button className="icon-btn-v2" onClick={() => setShowSpeakerAppModal(false)}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', color: '#5B4DFF', marginBottom: '1rem', textTransform: 'uppercase' }}>Speaker Profile</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Full Name</div>
                                                <div style={{ fontWeight: 700 }}>{selectedSpeakerApp.fullName}</div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Email</div>
                                                    <div style={{ fontWeight: 700 }}>{selectedSpeakerApp.email}</div>
                                                </div>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>WhatsApp</div>
                                                    {selectedSpeakerApp.whatsappNumber ? (
                                                        <a href={`https://wa.me/${selectedSpeakerApp.whatsappNumber.replace(/\D/g, '')}`} target="_blank" style={{ color: '#00FF88', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>
                                                            💬 {selectedSpeakerApp.whatsappNumber}
                                                        </a>
                                                    ) : (
                                                        <div style={{ fontWeight: 700, opacity: 0.3 }}>N/A</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Role & Org</div>
                                                <div style={{ fontWeight: 700 }}>{selectedSpeakerApp.currentPosition} at {selectedSpeakerApp.organization}</div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>LinkedIn</div>
                                                    <a href={selectedSpeakerApp.linkedinUrl} target="_blank" style={{ color: '#00D9FF', fontSize: '0.85rem' }}>View Profile</a>
                                                </div>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Website</div>
                                                    <a href={selectedSpeakerApp.websiteUrl} target="_blank" style={{ color: '#00D9FF', fontSize: '0.85rem' }}>View Site</a>
                                                </div>
                                            </div>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Bio</div>
                                                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 }}>{selectedSpeakerApp.bio || selectedSpeakerApp.sessionDescription}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1rem', color: '#5B4DFF', marginBottom: '1rem', textTransform: 'uppercase' }}>Session Proposal</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #5B4DFF' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Session Title</div>
                                                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{selectedSpeakerApp.sessionTitle}</div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Type</div>
                                                    <div style={{ fontWeight: 700 }}>{selectedSpeakerApp.sessionType}</div>
                                                </div>
                                                <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Duration</div>
                                                    <div style={{ fontWeight: 700 }}>{selectedSpeakerApp.durationPreference} mins</div>
                                                </div>
                                            </div>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Abstract</div>
                                                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 }}>{selectedSpeakerApp.sessionDescription}</p>
                                            </div>
                                            <div className="stat-card-v2 mini" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase' }}>Status</div>
                                                <div className={`badge ${selectedSpeakerApp.status === 'ACCEPTED' ? 'badge-green' : selectedSpeakerApp.status === 'REJECTED' ? 'badge-red' : 'badge-purple'}`} style={{ marginTop: '5px' }}>
                                                    {selectedSpeakerApp.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                                    {selectedSpeakerApp.status !== 'REJECTED' && (
                                        <button
                                            className="action-btn-v3"
                                            style={{ color: '#FF4D4D', borderColor: 'rgba(255,77,77,0.2)' }}
                                            onClick={() => handleUpdateSpeakerAppStatus(selectedSpeakerApp.id, 'REJECTED')}
                                        >
                                            REJECT APPLICATION
                                        </button>
                                    )}
                                    {selectedSpeakerApp.status !== 'ACCEPTED' && (
                                        <button
                                            className="action-btn-v3"
                                            style={{ color: '#00FF88', borderColor: 'rgba(0,255,136,0.2)', padding: '0.8rem 2.5rem' }}
                                            onClick={() => handleUpdateSpeakerAppStatus(selectedSpeakerApp.id, 'ACCEPTED')}
                                        >
                                            ACCEPT & ONBOARD
                                        </button>
                                    )}
                                    <button className="action-btn-v3" onClick={() => setShowSpeakerAppModal(false)}>CLOSE</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div >
    );
}
