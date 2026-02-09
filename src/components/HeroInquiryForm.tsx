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
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                <input
                    type="text"
                    required
                    placeholder={formFullNamePlaceholder}
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
                    placeholder={formEmailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>WhatsApp Number</label>
                <input
                    type="tel"
                    placeholder={formWhatsappPlaceholder}
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Country</label>
                <input
                    list="countries"
                    placeholder={formCountryPlaceholder}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{ ...inputStyle, background: '#0D0B1E' }}
                />
                <datalist id="countries">
                    <option value="Singapore" />
                    <option value="United States" />
                    <option value="United Kingdom" />
                    <option value="India" />
                    <option value="Japan" />
                    <option value="Germany" />
                    <option value="Australia" />
                    <option value="Canada" />
                    <option value="China" />
                    <option value="France" />
                    <option value="Afghanistan" />
                    <option value="Albania" />
                    <option value="Algeria" />
                    <option value="Andorra" />
                    <option value="Angola" />
                    <option value="Antigua and Barbuda" />
                    <option value="Argentina" />
                    <option value="Armenia" />
                    <option value="Australia" />
                    <option value="Austria" />
                    <option value="Azerbaijan" />
                    <option value="Bahamas" />
                    <option value="Bahrain" />
                    <option value="Bangladesh" />
                    <option value="Barbados" />
                    <option value="Belarus" />
                    <option value="Belgium" />
                    <option value="Belize" />
                    <option value="Benin" />
                    <option value="Bhutan" />
                    <option value="Bolivia" />
                    <option value="Bosnia and Herzegovina" />
                    <option value="Botswana" />
                    <option value="Brazil" />
                    <option value="Brunei" />
                    <option value="Bulgaria" />
                    <option value="Burkina Faso" />
                    <option value="Burundi" />
                    <option value="Cabo Verde" />
                    <option value="Cambodia" />
                    <option value="Cameroon" />
                    <option value="Canada" />
                    <option value="Central African Republic" />
                    <option value="Chad" />
                    <option value="Chile" />
                    <option value="China" />
                    <option value="Colombia" />
                    <option value="Comoros" />
                    <option value="Congo, Democratic Republic of the" />
                    <option value="Congo, Republic of the" />
                    <option value="Costa Rica" />
                    <option value="Croatia" />
                    <option value="Cuba" />
                    <option value="Cyprus" />
                    <option value="Czech Republic" />
                    <option value="Denmark" />
                    <option value="Djibouti" />
                    <option value="Dominica" />
                    <option value="Dominican Republic" />
                    <option value="East Timor" />
                    <option value="Ecuador" />
                    <option value="Egypt" />
                    <option value="El Salvador" />
                    <option value="Equatorial Guinea" />
                    <option value="Eritrea" />
                    <option value="Estonia" />
                    <option value="Eswatini" />
                    <option value="Ethiopia" />
                    <option value="Fiji" />
                    <option value="Finland" />
                    <option value="France" />
                    <option value="Gabon" />
                    <option value="Gambia" />
                    <option value="Georgia" />
                    <option value="Germany" />
                    <option value="Ghana" />
                    <option value="Greece" />
                    <option value="Grenada" />
                    <option value="Guatemala" />
                    <option value="Guinea" />
                    <option value="Guinea-Bissau" />
                    <option value="Guyana" />
                    <option value="Haiti" />
                    <option value="Honduras" />
                    <option value="Hungary" />
                    <option value="Iceland" />
                    <option value="India" />
                    <option value="Indonesia" />
                    <option value="Iran" />
                    <option value="Iraq" />
                    <option value="Ireland" />
                    <option value="Israel" />
                    <option value="Italy" />
                    <option value="Jamaica" />
                    <option value="Japan" />
                    <option value="Jordan" />
                    <option value="Kazakhstan" />
                    <option value="Kenya" />
                    <option value="Kiribati" />
                    <option value="Korea, North" />
                    <option value="Korea, South" />
                    <option value="Kosovo" />
                    <option value="Kuwait" />
                    <option value="Kyrgyzstan" />
                    <option value="Laos" />
                    <option value="Latvia" />
                    <option value="Lebanon" />
                    <option value="Lesotho" />
                    <option value="Liberia" />
                    <option value="Libya" />
                    <option value="Liechtenstein" />
                    <option value="Lithuania" />
                    <option value="Luxembourg" />
                    <option value="Madagascar" />
                    <option value="Malawi" />
                    <option value="Malaysia" />
                    <option value="Maldives" />
                    <option value="Mali" />
                    <option value="Malta" />
                    <option value="Marshall Islands" />
                    <option value="Mauritania" />
                    <option value="Mauritius" />
                    <option value="Mexico" />
                    <option value="Micronesia" />
                    <option value="Moldova" />
                    <option value="Monaco" />
                    <option value="Mongolia" />
                    <option value="Montenegro" />
                    <option value="Morocco" />
                    <option value="Mozambique" />
                    <option value="Myanmar" />
                    <option value="Namibia" />
                    <option value="Nauru" />
                    <option value="Nepal" />
                    <option value="Netherlands" />
                    <option value="New Zealand" />
                    <option value="Nicaragua" />
                    <option value="Niger" />
                    <option value="Nigeria" />
                    <option value="North Macedonia" />
                    <option value="Norway" />
                    <option value="Oman" />
                    <option value="Pakistan" />
                    <option value="Palau" />
                    <option value="Panama" />
                    <option value="Papua New Guinea" />
                    <option value="Paraguay" />
                    <option value="Peru" />
                    <option value="Philippines" />
                    <option value="Poland" />
                    <option value="Portugal" />
                    <option value="Qatar" />
                    <option value="Romania" />
                    <option value="Russia" />
                    <option value="Rwanda" />
                    <option value="Saint Kitts and Nevis" />
                    <option value="Saint Lucia" />
                    <option value="Saint Vincent and the Grenadines" />
                    <option value="Samoa" />
                    <option value="San Marino" />
                    <option value="Sao Tome and Principe" />
                    <option value="Saudi Arabia" />
                    <option value="Senegal" />
                    <option value="Serbia" />
                    <option value="Seychelles" />
                    <option value="Sierra Leone" />
                    <option value="Singapore" />
                    <option value="Slovakia" />
                    <option value="Slovenia" />
                    <option value="Solomon Islands" />
                    <option value="Somalia" />
                    <option value="South Africa" />
                    <option value="Spain" />
                    <option value="Sri Lanka" />
                    <option value="Sudan" />
                    <option value="Suriname" />
                    <option value="Sweden" />
                    <option value="Switzerland" />
                    <option value="Syria" />
                    <option value="Taiwan" />
                    <option value="Tajikistan" />
                    <option value="Tanzania" />
                    <option value="Thailand" />
                    <option value="Togo" />
                    <option value="Tonga" />
                    <option value="Trinidad and Tobago" />
                    <option value="Tunisia" />
                    <option value="Turkey" />
                    <option value="Turkmenistan" />
                    <option value="Tuvalu" />
                    <option value="Uganda" />
                    <option value="Ukraine" />
                    <option value="United Arab Emirates" />
                    <option value="United Kingdom" />
                    <option value="United States" />
                    <option value="Uruguay" />
                    <option value="Uzbekistan" />
                    <option value="Vanuatu" />
                    <option value="Vatican City" />
                    <option value="Venezuela" />
                    <option value="Vietnam" />
                    <option value="Yemen" />
                    <option value="Zambia" />
                    <option value="Zimbabwe" />
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
