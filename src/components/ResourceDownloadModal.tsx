"use client";
import { useState } from 'react';

interface Resource {
    title: string;
    fileUrl: string;
    description: string;
}

export default function ResourceDownloadModal({ resource, onClose }: { resource: Resource, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            resource: resource.title
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setSuccess(true);
                // Trigger download
                const link = document.createElement('a');
                link.href = resource.fileUrl;
                link.download = resource.fileUrl.split('/').pop() || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass-card" style={{ width: '90%', maxWidth: '450px', position: 'relative', padding: '40px' }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer'
                }}>×</button>

                {!success ? (
                    <>
                        <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>📥 Download Resource</h2>
                        <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px', fontSize: '0.9rem' }}>
                            Please provide your details to download <strong>{resource.title}</strong>
                        </p>

                        <form style={{ display: 'grid', gap: '20px' }} onSubmit={handleSubmit}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.8 }}>Full Name</label>
                                <input name="name" type="text" required placeholder="John Doe" style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.8 }}>Email Address</label>
                                <input name="email" type="email" required placeholder="john@example.com" style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.8 }}>Phone Number</label>
                                <input name="phone" type="tel" required placeholder="+1 234 567 890" style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                                {loading ? 'Processing...' : 'Start Download'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ marginBottom: '10px' }}>Thank You!</h2>
                        <p style={{ opacity: 0.8 }}>Your download should start automatically in a few seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
