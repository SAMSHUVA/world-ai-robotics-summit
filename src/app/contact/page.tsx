
export default function ContactPage() {
    return (
        <div className="container grid-2" style={{ padding: '80px 20px' }}>
            <div>
                <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Get in Touch</h1>
                <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '40px' }}>
                    Have questions about the conference, sponsorship opportunities, or visa letters? Our team is here to help.
                </p>

                <div style={{ display: 'grid', gap: '30px' }}>
                    <div>
                        <h3 style={{ marginBottom: '8px' }}>Venue</h3>
                        <p style={{ opacity: 0.6 }}>Grand Convention Center<br />123 Innovation Blvd<br />San Francisco, CA 94103</p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '8px' }}>Email</h3>
                        <p style={{ opacity: 0.6 }}>support@aifuture2024.com<br />sponsors@aifuture2024.com</p>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h2 style={{ marginBottom: '24px' }}>Send us a message</h2>
                <form style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
                        <input type="text" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                        <input type="email" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
                        <textarea rows={5} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}></textarea>
                    </div>
                    <button type="submit" className="btn">Send Message</button>
                </form>
            </div>
        </div>
    );
}
