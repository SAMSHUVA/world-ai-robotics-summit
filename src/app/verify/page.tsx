"use client";

import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyPortal() {
    const [id, setId] = useState('');
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (id.trim()) {
            router.push(`/verify/${id.trim()}`);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '20px' }}>
                        <ShieldCheck size={48} color="#3b82f6" />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Certificate Portal</h1>
                    <p style={{ color: '#94a3b8', fontSize: '16px' }}>Verify the authenticity of credentials</p>
                </div>

                <form onSubmit={handleVerify} style={{ background: '#1e293b', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                    <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                        <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Certificate ID</label>
                        <input
                            type="text"
                            placeholder="Enter verification ID..."
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '16px', outline: 'none' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#3b82f6', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Search size={18} /> Verify Credential
                    </button>
                </form>

                <p style={{ marginTop: '40px', fontSize: '12px', color: '#475569' }}>
                    AgTech Transformation Summit &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
