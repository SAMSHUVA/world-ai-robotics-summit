"use client";
import { useState } from 'react';

export default function AwardsModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    if (!isOpen) {
        return (
            <button onClick={openModal} className="btn" style={{ background: 'var(--accent)', marginTop: '20px' }}>
                🏆 Nominate Now
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-card" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={closeModal} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer'
                }}>×</button>

                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>🏆 Apply / Nominate for Awards</h2>

                <form style={{ display: 'grid', gap: '16px' }} onSubmit={(e) => { e.preventDefault(); alert('Nomination Submitted!'); closeModal(); }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Award Category</label>
                        <select style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}>
                            <option>Best Paper Award</option>
                            <option>Young Researcher Award</option>
                            <option>Innovation Excellence</option>
                            <option>Lifetime Achievement</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Nominee Name</label>
                        <input type="text" required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Affiliation / University</label>
                        <input type="text" required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Justification (Brief)</label>
                        <textarea rows={3} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}></textarea>
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }}>Submit Nomination</button>
                </form>
            </div>
        </div>
    );
}
