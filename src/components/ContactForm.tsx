"use client";
import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true, message: 'Sending...', type: 'info' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setStatus({ loading: false, message: '', type: '' });
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error: any) {
            setStatus({ loading: false, message: error.message, type: 'error' });
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Message Sent!</h3>
                <p style={{ opacity: 0.7, marginBottom: '20px' }}>Thank you for reaching out. Our team will get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-mini">Send Another Message</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            {status.message && (
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: status.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${status.type === 'error' ? 'red' : 'var(--glass-border)'}`
                }}>
                    {status.message}
                </div>
            )}
            <div className="form-grid-2">
                <div>
                    <label htmlFor="contactName" className="sr-only" style={{ display: 'none' }}>Your Name</label>
                    <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        autoComplete="name"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="sr-only" style={{ display: 'none' }}>Your Email</label>
                    <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        autoComplete="email"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="contactSubject" className="sr-only" style={{ display: 'none' }}>Subject</label>
                <input
                    id="contactSubject"
                    name="contactSubject"
                    type="text"
                    autoComplete="off"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="contactMessage" className="sr-only" style={{ display: 'none' }}>Message</label>
                <textarea
                    id="contactMessage"
                    name="contactMessage"
                    autoComplete="off"
                    placeholder="Message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                ></textarea>
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }} disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}

const inputStyle = {
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white'
};
