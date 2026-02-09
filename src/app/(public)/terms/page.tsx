import type { Metadata } from 'next';
import { CONFERENCE_CONFIG } from '@/config/conference';
import { getSiteSettings } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Terms & Conditions | ${settings.name} ${settings.year}`,
        description: `Terms and conditions for ${settings.fullName} registration and attendance.`,
        alternates: {
            canonical: `${CONFERENCE_CONFIG.urls.canonical}/terms`,
        },
    };
}

export default async function TermsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '900px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Terms & Conditions</h1>
            <p style={{ opacity: 0.7, marginBottom: '40px' }}>Last updated: February 2026</p>

            <div className="glass-card" style={{ padding: '40px' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>1. Conference Registration</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        By registering for the {settings.fullName} ({settings.shortName}), you agree to comply with these terms and conditions. Registration is confirmed only upon successful payment processing.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        All registrations are subject to availability. IAISR reserves the right to refuse or cancel any registration at its discretion.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>2. Ticket Types & Attendance Modes</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        {settings.shortName} offers both in-person and virtual attendance options:
                    </p>
                    <ul style={{ lineHeight: 1.8, marginLeft: '20px', marginBottom: '16px' }}>
                        <li><strong>In-Person Tickets:</strong> Early Bird, Regular, and Student tickets grant physical access to the conference venue in {settings.location}.</li>
                        <li><strong>Virtual Tickets:</strong> E-Oral, E-Poster, and Listener tickets provide remote access via our online platform.</li>
                        <li><strong>Hybrid Access:</strong> Some ticket types may include both in-person and virtual components as specified during registration.</li>
                    </ul>
                    <p style={{ lineHeight: 1.8 }}>
                        Ticket holders must use the attendance mode specified in their registration. Upgrades or changes may be requested subject to availability and additional fees.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>3. Refund Policy</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        Refund requests must be submitted in writing to <a href="mailto:info@iaisr.com" style={{ color: 'var(--primary)' }}>info@iaisr.com</a>. The following refund schedule applies:
                    </p>
                    <ul style={{ lineHeight: 1.8, marginLeft: '20px', marginBottom: '16px' }}>
                        <li><strong>30+ days before conference:</strong> Full refund (100% of registration fee)</li>
                        <li><strong>15-30 days before conference:</strong> Partial refund (50% of registration fee)</li>
                        <li><strong>Less than 15 days before conference:</strong> No refund</li>
                    </ul>
                    <p style={{ lineHeight: 1.8 }}>
                        Refunds will be processed within 14 business days to the original payment method. Payment processing fees are non-refundable.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>4. Cancellation Policy</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        IAISR reserves the right to cancel or postpone the conference due to circumstances beyond our control, including but not limited to natural disasters, pandemics, or government restrictions.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        In the event of cancellation, registrants will receive a full refund or the option to transfer their registration to a future IAISR event.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>5. Transfer Policy</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        Registrations may be transferred to another individual up to 7 days before the conference start date. A $25 USD administrative fee applies to all transfers.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        To request a transfer, email <a href="mailto:info@iaisr.com" style={{ color: 'var(--primary)' }}>info@iaisr.com</a> with your registration ID and the new attendee's details.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>6. Payment Terms</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        All payments are processed securely through Razorpay. We accept major credit/debit cards, UPI, and net banking. Payment must be completed at the time of registration.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        All prices are listed in USD and are subject to applicable taxes. Currency conversion rates are determined by your payment provider.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>7. Code of Conduct</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        All attendees must adhere to professional standards of conduct. Harassment, discrimination, or disruptive behavior will not be tolerated and may result in removal from the conference without refund.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        We are committed to providing a safe, inclusive environment for all participants regardless of gender, race, ethnicity, religion, disability, or sexual orientation.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>8. Intellectual Property</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        Presenters retain copyright to their research and presentations. By presenting at {settings.name} {settings.year}, you grant IAISR permission to record, photograph, and distribute your presentation for educational and promotional purposes.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        Conference materials, including proceedings and recordings, are for personal use only and may not be redistributed without permission.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>9. Liability Disclaimer</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        IAISR is not liable for any personal injury, loss, or damage to property sustained by attendees during the conference. Attendees are responsible for their own travel, accommodation, and insurance arrangements.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        Virtual attendees are responsible for their own internet connectivity and technical equipment. IAISR is not liable for technical issues that prevent virtual attendance.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>10. Privacy & Data Protection</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        Your personal information will be handled in accordance with our <a href="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</a>. We collect only the information necessary to process your registration and provide conference services.
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        By registering, you consent to receive conference-related communications from IAISR. You may opt out of marketing emails at any time.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>11. Changes to Terms</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        IAISR reserves the right to modify these terms at any time. Material changes will be communicated to registered attendees via email. Continued participation after changes constitutes acceptance of the modified terms.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>12. Contact Information</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: '16px' }}>
                        For questions regarding these terms or your registration, please contact:
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        <strong>Email:</strong> <a href={`mailto:${settings.social.email}`} style={{ color: 'var(--primary)' }}>{settings.social.email}</a><br />
                        <strong>WhatsApp:</strong> {settings.social.whatsapp}<br />
                        <strong>Support Response Time:</strong> Within 24 hours
                    </p>
                </section>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.7 }}>
                <p>© {settings.year} International Association for Innovation and Scientific Research (IAISR)</p>
                <p style={{ marginTop: '10px' }}>
                    <a href="/privacy" style={{ color: 'var(--primary)', marginRight: '20px' }}>Privacy Policy</a>
                    <a href="/" style={{ color: 'var(--primary)' }}>Return to Home</a>
                </p>
            </div>
        </div>
    );
}
