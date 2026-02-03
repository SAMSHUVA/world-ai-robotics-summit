import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function SpeakersPage() {
    let speakers = [];
    try {
        speakers = await (prisma.speaker as any).findMany({
            orderBy: { displayOrder: 'asc' }
        }) || [];
    } catch (e) {
        console.error("Speakers Page: Failed to fetch speakers", e);
    }

    return (
        <div className="container" style={{ padding: '80px 20px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>WARS '26 Speakers</h1>
                <p style={{ opacity: 0.6 }}>Leading the conversation on Intelligent Systems in Singapore.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {speakers.map((speaker: any, idx: number) => (
                    <div key={idx} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '300px', background: '#1A1830', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {speaker.photoUrl ? (
                                <img src={speaker.photoUrl} alt={speaker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                    {speaker.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '24px', flex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{speaker.name}</h3>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>{speaker.role}</div>
                            <div style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '12px' }}>{speaker.affiliation}</div>
                            <p style={{ opacity: 0.8, lineHeight: 1.6, fontSize: '0.95rem' }}>{speaker.bio}</p>
                        </div>
                    </div>
                ))}
                {speakers.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>More speakers coming soon.</p>}
            </div>
        </div>
    );
}
