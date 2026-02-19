"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, AlertTriangle, Loader2, Award, User, Calendar, ShieldCheck, Home } from 'lucide-react';
import Link from 'next/link';

export default function VerifyCertificate({ params }: { params: { id: string } }) {
    const [status, setStatus] = useState<'loading' | 'verified' | 'invalid'>('loading');
    const [certData, setCertData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const supabase = createClient();

    useEffect(() => {
        const verify = async () => {
            console.log('Verifying certificate ID:', params.id);
            try {
                if (!params.id) {
                    setErrorMsg('No ID provided');
                    setStatus('invalid');
                    return;
                }

                const cleanId = params.id.replace('VERIFY-', '');
                console.log('Cleaned ID:', cleanId);

                const { data, error } = await supabase
                    .from('generated_certificates')
                    .select('*, certificate_templates(name)')
                    .eq('id', cleanId)
                    .single();

                if (error) {
                    console.error('Supabase fetch error:', error);
                    setErrorMsg(error.message);
                    setStatus('invalid');
                } else if (!data) {
                    console.warn('No record found for ID:', cleanId);
                    setErrorMsg('Credential not found in records.');
                    setStatus('invalid');
                } else {
                    console.log('Record verified:', data.recipient_name);
                    setCertData(data);
                    setStatus('verified');
                }
            } catch (err: any) {
                console.error('Verification exception:', err);
                setErrorMsg(err.message || 'An unexpected error occurred during verification.');
                setStatus('invalid');
            }
        };
        verify();
    }, [params.id]);

    if (status === 'loading') {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', textAlign: 'center', padding: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                <p style={{ marginTop: '20px', fontSize: '18px', opacity: 0.8 }}>Verifying Certificate Authenticity...</p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#475569' }}>Connecting to verification database...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link href="/verify" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', fontSize: '14px', marginBottom: '16px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px' }}>
                        <Home size={14} /> Back to Portal
                    </Link>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Credential Verifier
                    </h1>
                    <div style={{ height: '2px', width: '60px', background: '#3b82f6', margin: '0 auto' }}></div>
                </div>

                {status === 'verified' && certData ? (
                    <div style={{ background: '#1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{ padding: '20px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%' }}>
                                <ShieldCheck size={64} color="#22c55e" />
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e', marginBottom: '4px' }}>Successfully Verified</h2>
                            <p style={{ fontSize: '14px', color: '#94a3b8' }}>This certificate is an authentic document issued via AgTech CertEngine.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <User color="#3b82f6" size={20} />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Recipient</div>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{certData.recipient_name}</div>
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Award color="#3b82f6" size={20} />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Template</div>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{certData.certificate_templates?.name || 'Academic Credential'}</div>
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Calendar color="#3b82f6" size={20} />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Issued On</div>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{new Date(certData.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#475569', wordBreak: 'break-all' }}>
                                Verification ID: {certData.id}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%' }}>
                                <AlertTriangle size={64} color="#ef4444" />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>Invalid Certificate</h2>
                        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                            {errorMsg || "We could not verify this certificate ID in our database. It may have been revoked, tampered with, or does not exist."}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
                            <Link
                                href="/verify"
                                style={{ background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Try Manual Entry
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                style={{ background: 'transparent', color: '#fff', border: '1px solid #334155', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                )}

                <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#475569' }}>
                    AgTech Transformation Summit &copy; {new Date().getFullYear()} Credential Gateway
                </p>
            </div>
        </div>
    );
}
