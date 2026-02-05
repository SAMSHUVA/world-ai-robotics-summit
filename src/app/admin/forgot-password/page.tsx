
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`, // Explicitly point to callback
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
            {/* Animated Background Elements */}
            <div className="admin-bg-blob-1" style={{ right: '-10%', left: 'auto', top: '-10%' }} />
            <div className="admin-bg-blob-2" style={{ left: '-5%', right: 'auto', bottom: '-10%' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="auth-card-wrapper"
            >
                <div className="auth-glass-card">
                    <div className="auth-header">
                        <h1 className="auth-title" style={{ fontSize: '1.5rem' }}>Reset Password</h1>
                        <p className="auth-subtitle">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {success ? (
                        <div className="success-message">
                            <div className="success-icon-bg">
                                <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 style={{ color: 'white', fontWeight: 500, marginBottom: '0.5rem' }}>Check your email</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                We've sent a password reset link to <br />
                                <span style={{ color: 'white' }}>{email}</span>
                            </p>

                            <Link href="/admin/login" className="submit-btn" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset}>
                            {error && (
                                <div className="auth-error">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="admin@wars26.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-btn"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <Link href="/admin/login" className="return-link">
                                ← Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
