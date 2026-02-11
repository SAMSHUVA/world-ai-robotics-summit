"use client";
import { useState, useEffect } from 'react';
import { X, Send, Award, University, User, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AwardsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Best Paper Award',
        nomineeName: '',
        affiliation: '',
        justification: ''
    });

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
        setFormData({ category: 'Best Paper Award', nomineeName: '', affiliation: '', justification: '' });
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
                alert('Success! Your nomination has been submitted.');
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
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(3, 11, 26, 0.85)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(15px)',
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card"
                        style={{
                            width: '100%',
                            maxWidth: '550px',
                            position: 'relative',
                            background: 'rgba(13, 20, 38, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            padding: '40px'
                        }}
                    >
                        <button onClick={closeModal} style={{
                            position: 'absolute', top: '25px', right: '25px',
                            background: 'rgba(255,255,255,0.05)', border: 'none',
                            color: 'white', cursor: 'pointer', width: '35px', height: '35px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
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
                            <div className="input-group-premium">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                    <Award size={14} /> Award Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="price-input"
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                >
                                    <option>Best Paper Award</option>
                                    <option>Young Researcher Award</option>
                                    <option>Innovation Excellence</option>
                                    <option>Lifetime Achievement</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group-premium">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        <User size={14} /> Nominee Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Dr. John Doe"
                                        value={formData.nomineeName}
                                        onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                                        className="price-input"
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                </div>
                                <div className="input-group-premium">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                        <University size={14} /> Affiliation
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="University / Org"
                                        value={formData.affiliation}
                                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                                        className="price-input"
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group-premium">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                                    <AlignLeft size={14} /> Justification
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Why should this person be nominated?"
                                    value={formData.justification}
                                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                    className="price-input"
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', resize: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                ></textarea>
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
