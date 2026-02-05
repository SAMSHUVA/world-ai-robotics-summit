
export default function SessionsPage() {
    const dates = ["May 22", "May 23", "May 24"];
    const tracks = ["Generative AI", "Human-Robotics", "Ethical AI", "NLP"];

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>WARS '26 Schedule</h1>
                <p style={{ opacity: 0.6 }}>7th World AI & Robotics Summit | Singapore, Marina Bay Sands</p>
            </header>

            {/* Tabs Placeholder */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                {dates.map((d, i) => (
                    <button key={d} className="btn" style={{ background: i === 0 ? 'var(--primary)' : 'transparent', border: '1px solid var(--glass-border)' }}>
                        {d}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                {[
                    { time: "09:00 AM", title: "Opening Keynote: The Future of Embodied AI", speaker: "Dr. Kenji Tanaka", room: "Grand Ballroom", track: "Keynote" },
                    { time: "10:30 AM", title: "Large World Models: Beyond Text", speaker: "Dr. Sarah Miller", room: "Sands Hall A", track: "Generative AI" },
                    { time: "10:30 AM", title: "Collaborative Robots in Surgical Suites", speaker: "Panel Discussion", room: "Sands Hall B", track: "Human-Robotics" },
                    { time: "01:00 PM", title: "Lunch Break & Tech Expo", speaker: "", room: "Exhibition Hall", track: "Social" },
                    { time: "02:30 PM", title: "Workshop: Fine-Tuning Agents for Enterprise", speaker: "Alex Rivera", room: "Innovation Lab", track: "Workshop" },
                ].map((session, idx) => (
                    <div key={idx} className="glass-card session-row">
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{session.time}</div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>{session.track}</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{session.title}</h3>
                            {session.speaker && <div style={{ opacity: 0.7 }}>{session.speaker}</div>}
                        </div>
                        <div style={{ textAlign: 'right', opacity: 0.6, fontSize: '0.9rem' }}>
                            📍 {session.room}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
