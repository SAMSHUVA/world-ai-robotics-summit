
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Minimum 6 characters required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                throw error;
            }

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Update failed');
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
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="auth-card-wrapper"
                >
                    <div className="auth-glass-card">
                        <div className="auth-header">
                            <h1 className="auth-title" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>New Credentials</h1>
                            <p className="auth-subtitle">
                                Set a high-security password
                            </p>
                        </div>

                        {error && (
                            <div className="toast-container toast-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleUpdatePassword}>
                            <div className="input-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="modern-input"
                                    placeholder="New Password"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="modern-input"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="glow-btn"
                            >
                                {loading ? 'UPDATING...' : 'SAVE NEW PASSWORD'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </WavyBackground>
        </div>
    );
}
