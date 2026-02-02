
export default function SpeakersPage() {
    const speakers = [
        { name: "Dr. Kenji Tanaka", role: "CEO, Robotics Frontier", bio: "Leading pioneer in Human-Robot Interaction and Autonomous Systems.", img: "#" },
        { name: "Dr. Sarah Miller", role: "Lead Scientist, DeepMind", bio: "Renowned expert in Large World Models and Multimodal Learning.", img: "#" },
        { name: "Prof. Anaya Gupta", role: "National University of Singapore", bio: "Focused on Ethical AI frameworks for global south implementations.", img: "#" },
        { name: "Mark Davidson", role: "OpenAI", bio: "Lead architect for Agentic Workflows and AGI Research.", img: "#" },
        { name: "Dr. Li Wei", role: "Tsinghua University", bio: "Specialist in Generative Design for Robotics and Advanced Manufacturing.", img: "#" },
        { name: "Anita Kapoor", role: "Director, Sustainable AI", bio: "Integrating UN SDGs with Large Language Model operations.", img: "#" },
    ];

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>WARS '26 Keynotes</h1>
                <p style={{ opacity: 0.6 }}>Leading the conversation on Intelligent Systems in Singapore.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {speakers.map((speaker, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '250px', background: '#2A2840', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Placeholder for Image */}
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#4536D9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                {speaker.name.charAt(0)}
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{speaker.name}</h3>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>{speaker.role}</div>
                            <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.95rem' }}>{speaker.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
