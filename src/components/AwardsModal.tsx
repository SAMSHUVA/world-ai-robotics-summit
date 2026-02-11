"use client";
import { useState, useEffect } from 'react';
import { X, Send, Award, University, User, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AwardsModal({ awards = [] }: { awards?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        nomineeName: '',
        affiliation: '',
        justification: '',
        nominatorName: '',
        nominatorEmail: '',
        nominatorPhone: ''
    });

    useEffect(() => {
        if (awards.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: awards[0].title }));
        }
    }, [awards]);

    useEffect(() => {
        const handleOpen = (e: any) => {
            if (e.detail?.category) {
                setFormData(prev => ({ ...prev, category: e.detail.category }));
            }
            setIsOpen(true);
        };

        window.addEventListener('open-nomination-modal', handleOpen);
        return () => window.removeEventListener('open-nomination-modal', handleOpen);
    }, []);

    const closeModal = () => {
        setIsOpen(false);
        setFormData({
            category: awards[0]?.title || 'Best Paper Award',
            nomineeName: '',
            affiliation: '',
            justification: '',
            nominatorName: '',
            nominatorEmail: '',
            nominatorPhone: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/awards/nominations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Success! Your nomination has been submitted and a confirmation email has been sent to you.');
                closeModal();
            } else {
                throw new Error('Failed to submit nomination');
            }
        } catch (error) {
            alert('Error submitting nomination. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(3, 11, 26, 0.98)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backdropFilter: 'blur(25px)',
                        padding: '40px 20px',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch'
                    }}
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="glass-card"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            position: 'relative',
                            background: 'rgba(13, 20, 38, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            padding: '40px',
                            margin: 'auto 0',
                            zIndex: 100000
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={closeModal} style={{
                            position: 'absolute', top: '25px', right: '25px',
                            background: 'rgba(255,255,255,0.05)', border: 'none',
                            color: 'white', cursor: 'pointer', width: '35px', height: '35px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{
                                width: '60px', height: '60px', background: 'var(--primary)',
                                borderRadius: '16px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 15px',
                                boxShadow: '0 0 20px rgba(31, 203, 143, 0.3)'
                            }}>
                                <Award size={32} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>Award Nomination</h2>
                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Recognize excellence in AI & Robotics research</p>
                        </div>

                        <form style={{ display: 'grid', gap: '20px' }} onSubmit={handleSubmit}>
                            {/* Nominee Section */}
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={16} /> Nominee Details
                                </h3>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <div className="input-group-premium">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Award Category</label>
                                        <select
                                            autoFocus
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="price-input"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                        >
                                            {awards.length > 0 ? (
                                                awards.map((a: any) => (
                                                    <option key={a.id} value={a.title}>{a.title} ({a.category})</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option>Best Paper Award</option>
                                                    <option>Young Researcher Award</option>
                                                    <option>Innovation Excellence</option>
                                                    <option>Lifetime Achievement</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="input-group-premium">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nominee Name"
                                                value={formData.nomineeName}
                                                onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                                                className="price-input"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                            />
                                        </div>
                                        <div className="input-group-premium">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Affiliation / Org"
                                                value={formData.affiliation}
                                                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                                                className="price-input"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group-premium">
                                        <textarea
                                            rows={3}
                                            required
                                            placeholder="Justification for nomination..."
                                            value={formData.justification}
                                            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                            className="price-input"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', resize: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Nominator Section */}
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlignLeft size={16} /> Your Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="input-group-premium">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your Name"
                                            value={formData.nominatorName}
                                            onChange={(e) => setFormData({ ...formData, nominatorName: e.target.value })}
                                            className="price-input"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                        />
                                    </div>
                                    <div className="input-group-premium">
                                        <input
                                            type="email"
                                            required
                                            placeholder="Your Email"
                                            value={formData.nominatorEmail}
                                            onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })}
                                            className="price-input"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                        />
                                    </div>
                                </div>
                                <div className="input-group-premium" style={{ marginTop: '15px' }}>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Your WhatsApp Number (e.g. +91 98765 43210)"
                                        value={formData.nominatorPhone}
                                        onChange={(e) => setFormData({ ...formData, nominatorPhone: e.target.value })}
                                        className="price-input"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary-glow"
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '12px',
                                    marginTop: '10px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '10px', fontSize: '1rem',
                                    background: 'var(--primary)', color: 'white', border: 'none'
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        Submit Nomination <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

