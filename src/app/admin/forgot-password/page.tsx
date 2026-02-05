
'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <WavyBackground waveOpacity={0.2} speed="fast">
                <div className="particles-container">
                    <div className="particle p-1" />
                    <div className="particle p-2" />
                    <div className="particle p-3" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="auth-card-wrapper"
                >
                    <div className="auth-glass-card">
                        <div className="auth-header">
                            <h1 className="auth-title" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Security Recovery</h1>
                            <p className="auth-subtitle">
                                Enter your administrative email
                            </p>
                        </div>

                        {success ? (
                            <div className="success-message">
                                <div className="success-icon-bg">
                                    <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 style={{ color: 'white', fontWeight: 500, marginBottom: '0.5rem' }}>Link Sent</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    Check your inbox for recovery instructions.
                                </p>

                                <Link href="/admin/login" className="glow-btn" style={{ textDecoration: 'none' }}>
                                    Return to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleReset}>
                                {error && (
                                    <div className="toast-container toast-error">
                                        {error}
                                    </div>
                                )}

                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="modern-input"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="glow-btn"
                                >
                                    {loading ? 'Sending...' : 'Send Recovery Link'}
                                </button>

                                <div className="bottom-links">
                                    <Link href="/admin/login" className="glass-link">
                                        ← Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </WavyBackground>
        </div>
    );
}
