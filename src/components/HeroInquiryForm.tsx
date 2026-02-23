"use client";
import { useState } from 'react';

interface HeroInquiryFormProps {
    settings?: {
        formFullNamePlaceholder?: string;
        formEmailPlaceholder?: string;
        formWhatsappPlaceholder?: string;
        formCountryPlaceholder?: string;
        formSubmitButtonText?: string;
    };
}

export default function HeroInquiryForm({ settings = {} }: HeroInquiryFormProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whatsappNumber: '',
        country: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        formFullNamePlaceholder = "John Doe",
        formEmailPlaceholder = "john@example.com",
        formWhatsappPlaceholder = "+1 234 567 890",
        formCountryPlaceholder = "Select or type country",
        formSubmitButtonText = "Inquire Now"
    } = settings;

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
                        Your inquiry has been received. Our team will contact you shortly with the latest conference updates.
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
                <label htmlFor="fullName" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={formFullNamePlaceholder}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={formEmailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="whatsapp" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>WhatsApp Number</label>
                <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    placeholder={formWhatsappPlaceholder}
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="country" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Country</label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="country"
                        name="country"
                        list="countries"
                        autoComplete="country-name"
                        placeholder={formCountryPlaceholder}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        style={{ ...inputStyle, paddingRight: '40px' }}
                    />
                    <svg
                        style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            opacity: 0.6
                        }}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <datalist id="countries">
                    <option value="United States" />
                    <option value="India" />
                    <option value="United Kingdom" />
                    <option value="Canada" />
                    <option value="Australia" />
                    <option value="Germany" />
                    <option value="France" />
                    <option value="Singapore" />
                    <option value="Japan" />
                    <option value="China" />
                    <option value="Brazil" />
                    <option value="Mexico" />
                    <option value="Spain" />
                    <option value="Italy" />
                    <option value="Netherlands" />
                    <option value="South Korea" />
                    <option value="Switzerland" />
                    <option value="Sweden" />
                    <option value="United Arab Emirates" />
                    <option value="Saudi Arabia" />
                    <option value="South Africa" />
                    <option value="Indonesia" />
                    <option value="Malaysia" />
                    <option value="Thailand" />
                    <option value="Philippines" />
                </datalist>
            </div>
            <button
                type="submit"
                className="btn"
                disabled={loading}
                style={{ width: '100%', marginTop: '10px' }}
            >
                {loading ? 'Submitting...' : formSubmitButtonText}
            </button>
            {status && <p style={{ fontSize: '0.85rem', textAlign: 'center', opacity: 0.9, marginTop: '10px', color: status.includes('Thank') ? '#4CAF50' : '#FF5252' }}>{status}</p>}
        </form>
    );
}

const inputStyle = {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
};
