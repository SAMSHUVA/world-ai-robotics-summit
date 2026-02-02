"use client";
import { useState } from 'react';

export default function HeroInquiryForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whatsappNumber: '',
        country: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ fullName: '', email: '', whatsappNumber: '', country: '' });
            } else {
                const data = await res.json();
                setStatus(data.error || 'Failed to submit. Please try again.');
            }
        } catch (error) {
            setStatus('Error: Connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                    ✅
                </div>
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>Thank You!</h3>
                    <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                        Your inquiry for IAISR has been received. Our team will contact you shortly with the latest conference updates.
                    </p>
                </div>
                <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-mini"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                >
                    Submit Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
                <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>WhatsApp Number</label>
                <input
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Country</label>
                <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{ ...inputStyle, background: '#0D0B1E' }}
                >
                    <option value="" disabled>Select Country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <button
                type="submit"
                className="btn"
                disabled={loading}
                style={{ width: '100%', marginTop: '10px' }}
            >
                {loading ? 'Submitting...' : 'Inquire Now'}
            </button>
            {status && <p style={{ fontSize: '0.85rem', textAlign: 'center', opacity: 0.9, marginTop: '10px', color: status.includes('Thank') ? '#4CAF50' : '#FF5252' }}>{status}</p>}
        </form>
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
