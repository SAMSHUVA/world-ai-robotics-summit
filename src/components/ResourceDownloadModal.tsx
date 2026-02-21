"use client";
import { useState, useEffect, useRef } from 'react';

interface Resource {
    title: string;
    fileUrl: string;
    description: string;
}

export default function ResourceDownloadModal({ resource, onClose }: { resource: Resource, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the first field when modal opens
    useEffect(() => {
        if (!success && nameInputRef.current) {
            // Short timeout to ensure the transition/animation is complete
            const timer = setTimeout(() => {
                nameInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            resource: resource.title
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setSuccess(true);
                // Trigger download
                const link = document.createElement('a');
                link.href = resource.fileUrl;
                link.download = resource.fileUrl.split('/').pop() || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '16px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' as any
        }}>
            <div className="glass-card" style={{
                width: '100%', maxWidth: '450px', position: 'relative',
                padding: '32px 24px',
                maxHeight: '90vh', overflowY: 'auto',
                margin: 'auto',
                boxSizing: 'border-box' as any,
                background: 'rgba(13, 11, 30, 0.96)', // Much more solid background
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.8)',
                borderRadius: '24px'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white',
                    fontSize: '1.2rem', cursor: 'pointer', width: '32px', height: '32px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10
                }}>×</button>

                {!success ? (
                    <>
                        <h2 style={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700' }}>📥 Download Resource</h2>
                        <p style={{ textAlign: 'center', opacity: 0.9, marginBottom: '30px', fontSize: '0.95rem' }}>
                            Please provide your details to download <strong>{resource.title}</strong>
                        </p>

                        <form style={{ display: 'grid', gap: '20px' }} onSubmit={handleSubmit}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', opacity: 0.9 }}>Full Name</label>
                                <input
                                    ref={nameInputRef}
                                    name="name"
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="John Doe"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', opacity: 0.9 }}>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', opacity: 0.9 }}>Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="+1 234 567 890"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px', height: '52px', fontSize: '1rem' }} disabled={loading}>
                                {loading ? 'Processing...' : 'Start Download'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ marginBottom: '10px' }}>Thank You!</h2>
                        <p style={{ opacity: 0.9 }}>Your download should start automatically in a few seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
