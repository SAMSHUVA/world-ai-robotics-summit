
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
            setError('Password must be at least 6 characters');
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

            // Success - Redirect to dashboard
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            {/* Animated Particles & Glows */}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="auth-card-wrapper"
            >
                <div className="auth-glass-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Set New Password</h1>
                        <p className="auth-subtitle">
                            Create a secure password for your account
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Updating...' : 'Set New Password'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
