
'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Successful login
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <WavyBackground
                backgroundFill="#0D0B1E"
                colors={["#5B4DFF", "#00D9FF", "#FF3B8A", "#5B4DFF", "#00D9FF"]}
                waveOpacity={0.3}
                speed="fast"
            >
                {/* Floating Particles Integrated */}
                <div className="particles-container">
                    <div className="particle p-1" />
                    <div className="particle p-2" />
                    <div className="particle p-3" />
                    <div className="particle p-4" />
                    <div className="particle p-5" />
                </div>

                <div className="glow-spot glow-purple" />
                <div className="glow-spot glow-blue" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="auth-card-wrapper"
                >
                    <div className="auth-glass-card">
                        <div className="logo-section">
                            <div className="futuristic-logo" style={{ marginBottom: '2rem' }}>
                                <img src="/Iaisr%20Logo.webp" alt="IAISR Logo" style={{ height: '100px', width: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }} />
                            </div>
                            <h2 className="auth-title">Admin Space</h2>
                        </div>

                        {error && (
                            <div className="toast-container toast-error">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="modern-input"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="modern-input"
                                    placeholder="Password"
                                    style={{ paddingRight: '45px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                <input type="checkbox" id="remember" style={{ marginRight: '8px', accentColor: '#5B4DFF' }} />
                                <label htmlFor="remember" style={{ cursor: 'pointer' }}>Remember Me</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="glow-btn"
                            >
                                {loading ? (
                                    <>
                                        <svg className="spin-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ height: '20px', width: '20px', animation: 'spin 1s linear infinite' }}>
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connecting...
                                    </>
                                ) : (
                                    'LOGIN'
                                )}
                            </button>

                            <div className="bottom-links">
                                <Link
                                    href="/admin/forgot-password"
                                    className="glass-link"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </WavyBackground>
        </div>
    );
}
