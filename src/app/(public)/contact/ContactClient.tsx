"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactClientProps {
    settings: {
        name: string;
        year: string;
        fullName: string;
        location: string;
        venue: string;
        social: {
            whatsapp: string;
            email: string;
        };
    };
}

export default function ContactClient({ settings }: ContactClientProps) {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });
            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            label: "Visit Us",
            value: settings.venue,
            subValue: settings.location,
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.venue + ' ' + settings.location)}`
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
            label: "Email Support",
            value: settings.social.email,
            subValue: "Online response within 2h",
            link: `mailto:${settings.social.email}`
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.983 9.983 0 004.78 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2v0zm0 18.288h-.003a8.316 8.316 0 01-4.235-1.156l-.304-.18-3.15.745.84-3.068-.198-.315a8.286 8.286 0 01-1.267-4.42c.002-4.572 3.722-8.292 8.3-8.295a8.24 8.24 0 015.856 2.435 8.26 8.26 0 012.43 5.862c-.002 4.576-3.724 8.295-8.27 8.295v.002zm4.538-6.205c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.808-.788.974-.145.166-.29.187-.539.062-.249-.125-1.051-.387-2.003-1.235-.74-.66-1.24-1.473-1.385-1.722-.146-.249-.016-.384.109-.508.112-.112.249-.29.373-.436.125-.145.166-.249.25-.415.082-.166.04-.311-.022-.436-.062-.124-.56-1.348-.767-1.846-.202-.486-.407-.42-.56-.428h-.477c-.166 0-.436.063-.664.312-.228.248-.871.85-.871 2.073 0 1.223.891 2.404 1.016 2.57.124.166 1.753 2.677 4.248 3.753.593.256 1.056.409 1.42.525.603.192 1.151.164 1.587.1.477-.07 1.473-.601 1.68-.1.183.207-.58.353-.601.415-.228.083-.394.125-.56-.125z" />
                </svg>
            ),
            label: "WhatsApp Chat",
            value: "Live Community Support",
            subValue: "Instant assistance",
            link: settings.social.whatsapp.startsWith('http') ? settings.social.whatsapp : `https://wa.me/${settings.social.whatsapp.replace(/\D/g, '')}`
        }
    ];

    return (
        <section className="contact-premium-wrapper">
            <style jsx global>{`
                .contact-premium-wrapper {
                    padding: 120px 20px 80px;
                    min-height: 100vh;
                    background: radial-gradient(circle at 0% 0%, rgba(91, 77, 255, 0.05) 0%, transparent 50%),
                                radial-gradient(circle at 100% 100%, rgba(91, 77, 255, 0.03) 0%, transparent 50%);
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 80px;
                    max-width: 1200px;
                    margin: 0 auto;
                    align-items: start;
                }

                .contact-header h1 {
                    font-size: 4rem;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    margin-bottom: 24px;
                    background: linear-gradient(180deg, var(--text-primary) 30%, rgba(var(--text-primary-rgb), 0.7) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .contact-header p {
                    font-size: 1.2rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    max-width: 480px;
                    margin-bottom: 48px;
                }

                .contact-method-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 24px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    margin-bottom: 16px;
                }

                .contact-method-card:hover {
                    transform: translateX(10px);
                    background: rgba(var(--primary-rgb), 0.05);
                    border-color: var(--primary);
                }

                .method-icon {
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary);
                    color: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 16px rgba(var(--primary-rgb), 0.2);
                }

                .method-info h4 {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--primary);
                    margin-bottom: 4px;
                    font-weight: 700;
                }

                .method-info .value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .method-info .sub-value {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    opacity: 0.7;
                }

                .contact-form-container {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    padding: 48px;
                    border-radius: 40px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                }

                .contact-form-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%);
                    pointer-events: none;
                }

                .form-group {
                    margin-bottom: 24px;
                    position: relative;
                }

                .form-label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 10px;
                    padding-left: 4px;
                }

                .form-input, .form-textarea, .form-select {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--glass-border);
                    padding: 16px 20px;
                    border-radius: 16px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    background: rgba(255,255,255,0.07);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
                    outline: none;
                }

                .btn-submit {
                    width: 100%;
                    padding: 18px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.4s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.3);
                    filter: brightness(1.1);
                }

                .success-message {
                    text-align: center;
                    padding: 40px 0;
                }

                .success-icon {
                    width: 80px;
                    height: 80px;
                    background: #22c55e;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    font-size: 2rem;
                }

                @media (max-width: 992px) {
                    .contact-grid {
                        display: flex;
                        flex-direction: column-reverse;
                        gap: 40px;
                    }
                    .contact-header h1 {
                        font-size: 3rem;
                    }
                    .contact-premium-wrapper {
                        padding-top: 65px;
                    }
                }
            `}</style>

            <div className="contact-grid">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="contact-left"
                >
                    <header className="contact-header">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Have questions about registration or paper submission? Our team at {settings.name} is here to help you.
                        </motion.p>
                    </header>

                    <nav className="contact-methods">
                        {contactMethods.map((method, index) => (
                            <motion.a
                                key={method.label}
                                href={method.link}
                                target={method.link.startsWith('http') ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="contact-method-card"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <div className="method-icon">{method.icon}</div>
                                <div className="method-info">
                                    <h4>{method.label}</h4>
                                    <div className="value">{method.value}</div>
                                    <div className="sub-value">{method.subValue}</div>
                                </div>
                            </motion.a>
                        ))}
                    </nav>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="contact-form-container"
                >
                    {!submitted ? (
                        <form onSubmit={handleSubmit}>
                            <h2 style={{ marginBottom: '32px', fontSize: '1.8rem', fontWeight: '700' }}>Send us a Message</h2>

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={formState.name}
                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="form-input"
                                    placeholder="john@example.com"
                                    value={formState.email}
                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <select
                                    className="form-select"
                                    value={formState.subject}
                                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                >
                                    <option>General Inquiry</option>
                                    <option>Registration Support</option>
                                    <option>Paper Submission</option>
                                    <option>Technical Issue</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your Message</label>
                                <textarea
                                    rows={5}
                                    required
                                    className="form-textarea"
                                    placeholder="How can we help you today?"
                                    value={formState.message}
                                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Send Message
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="success-message"
                        >
                            <div className="success-icon">✓</div>
                            <h3>Message Sent!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                                Thank you for reaching out. We've received your inquiry and will get back to you within 2-4 hours.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="btn"
                                style={{ marginTop: '32px', background: 'transparent', border: '1px solid var(--glass-border)' }}
                            >
                                Send another message
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
