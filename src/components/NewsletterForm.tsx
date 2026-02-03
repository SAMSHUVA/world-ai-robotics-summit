"use client";
import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true, message: 'Subscribing...', type: 'info' });

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setSubmitted(true);
                setEmail('');
                setStatus({ loading: false, message: '', type: '' });
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to subscribe');
            }
        } catch (error: any) {
            setStatus({ loading: false, message: error.message, type: 'error' });
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Successfully Subscribed!</h3>
                <p style={{ opacity: 0.7 }}>You will now receive the latest updates from IAISR.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-mini" style={{ marginTop: '10px' }}>Subscribe Another Email</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
            {status.message && (
                <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: status.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${status.type === 'error' ? 'red' : 'var(--glass-border)'}`
                }}>
                    {status.message}
                </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <button type="submit" className="btn" disabled={status.loading}>
                    {status.loading ? '...' : 'Subscribe'}
                </button>
            </div>
        </form>
    );
}
