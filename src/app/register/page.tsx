'use client';

import React, { useState, useEffect } from 'react';

export default function RegisterPage() {
    const [step, setStep] = useState(1); // 1: Ticket, 2: Details, 3: Success, 4: Abandoned
    const [selectedTicket, setSelectedTicket] = useState('regular');
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [attendeeId, setAttendeeId] = useState<number | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        org: '',
        role: 'Professor / Faculty',
        dietary: '',
    });

    const tickets = {
        early: { price: 5000, name: 'Early Bird', status: 'ENDING', value: 'EARLY_BIRD' },
        regular: { price: 7500, name: 'Regular', status: 'POPULAR', value: 'REGULAR' },
        student: { price: 3000, name: 'Student', status: 'ID REQUIRED', value: 'STUDENT' },
    };

    const getPrice = () => {
        // @ts-ignore
        return tickets[selectedTicket].price;
    }

    const tax = getPrice() * 0.05;
    const total = getPrice() + tax;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegistration = async () => {
        setLoading(true);
        try {
            // 1. Initial Registration (Save details)
            const regRes = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // @ts-ignore
                    ticketType: tickets[selectedTicket].value,
                }),
            });

            const regData = await regRes.json();
            if (!regData.success) throw new Error(regData.error);

            setAttendeeId(regData.attendee.id);

            // 2. Create Razorpay Order
            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attendeeId: regData.attendee.id,
                    // @ts-ignore
                    ticketType: tickets[selectedTicket].value,
                }),
            });

            const order = await orderRes.json();
            setOrderId(order.id);

            // 3. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: "World AI & Robotics Summit",
                description: "Conference Registration Pass",
                order_id: order.id,
                handler: async function (response: any) {
                    await handlePaymentSuccess(response);
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                },
                theme: { color: "#5B4DFF" },
                modal: {
                    ondismiss: function () {
                        handlePaymentDismissed(order.id);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (response: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
            });

            const data = await res.json();
            if (data.success) {
                setStep(3); // Success Screen
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        } catch (err) {
            alert('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentDismissed = (oid: string) => {
        setStep(4); // Abandoned State / Feedback View
        setShowFeedbackModal(true);
        // Silently mark as ABANDONED in DB
        fetch('/api/razorpay/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: oid, status: 'ABANDONED', feedback: 'Dismissed without feedback yet' }),
        });
    };

    const submitFeedback = async () => {
        setLoading(true);
        await fetch('/api/razorpay/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: 'ABANDONED', feedback }),
        });
        setLoading(false);
        setShowFeedbackModal(false);
        alert('Thank you for your feedback! We will get in touch if needed.');
    };

    return (
        <div className="container" style={{ padding: '80px 20px', minHeight: '100vh' }}>
            <header className="registration-header" style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px', background: 'linear-gradient(to right, #fff, #5B4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Join the Future of AI
                </h1>
                <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                    Secure your spot at the World AI & Robotics Summit. October 24-26, 2024.
                </p>
            </header>

            {step <= 2 && (
                <div style={{ marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        <span>Registration Progress</span>
                        <span style={{ color: 'var(--primary)' }}>Step {step} of 2</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${(step / 2) * 100}%`,
                            background: 'var(--primary)',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <div className="page-sidebar-layout sidebar-right" style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {step === 1 && (
                    <div className="glass-card">
                        <h2 style={{ marginBottom: '24px' }}>1. Select Your Pass</h2>
                        <div className="ticket-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {Object.entries(tickets).map(([key, ticket]) => (
                                <div key={key}
                                    onClick={() => setSelectedTicket(key)}
                                    style={{
                                        border: selectedTicket === key ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                        background: selectedTicket === key ? 'rgba(91, 77, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        transform: selectedTicket === key ? 'translateY(-5px)' : 'none'
                                    }}
                                >
                                    {ticket.status && (
                                        <span style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            background: selectedTicket === key ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold'
                                        }}>
                                            {ticket.status}
                                        </span>
                                    )}
                                    <div style={{ fontSize: '1rem', marginBottom: '8px', opacity: 0.8 }}>{ticket.name}</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{ticket.price}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '40px', textAlign: 'right' }}>
                            <button onClick={() => setStep(2)} className="btn">Continue to Details</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass-card">
                        <h2 style={{ marginBottom: '24px' }}>2. Your Details</h2>
                        <form style={{ display: 'grid', gap: '20px' }} onSubmit={(e) => { e.preventDefault(); handleRegistration(); }}>
                            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} style={inputStyle} placeholder="First Name" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} style={inputStyle} placeholder="Last Name" />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={inputStyle} placeholder="email@example.com" />
                            </div>
                            <div>
                                <label style={labelStyle}>Organization</label>
                                <input type="text" name="org" value={formData.org} onChange={handleInputChange} style={inputStyle} placeholder="University or Company" />
                            </div>
                            <div>
                                <label style={labelStyle}>Dietary Requirements</label>
                                <textarea name="dietary" value={formData.dietary} onChange={handleInputChange} style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Any allergies or requirements?"></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button type="button" onClick={() => setStep(1)} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                                <button type="submit" disabled={loading} className="btn">{loading ? 'Processing...' : 'Proceed to Payment'}</button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Payment Completed!</h2>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                            Thank you for registering. You are now part of the World AI & Robotics Summit 2024.
                        </p>
                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid var(--primary)', display: 'inline-block' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>What happens next?</p>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Our team will reach reach out to you shortly via email and WhatsApp with your digital pass and event guidelines.</p>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <button onClick={() => window.location.href = '/'} className="btn">Back to Home</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="glass-card feedback-container" style={{ textAlign: 'center', padding: '60px 24px', gridColumn: 'span 2', maxWidth: '700px', margin: '0 auto' }}>
                        <div className="feedback-icon" style={{ fontSize: '4rem', marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(91, 77, 255, 0.4))' }}>🧐</div>
                        <h2 className="feedback-title" style={{ fontSize: '2.5rem', marginBottom: '16px', lineHeight: 1.2 }}>Wait! Is something wrong?</h2>
                        <p className="feedback-subtitle" style={{ opacity: 0.7, fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                            We noticed you went back from the payment page. Was there an issue that prevented you from completing your registration?
                        </p>

                        {showFeedbackModal && (
                            <div className="feedback-form-box" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ ...labelStyle, fontSize: '1rem', marginBottom: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>What made you go back?</label>
                                <div className="feedback-select-wrapper" style={{ position: 'relative', marginBottom: '24px' }}>
                                    <select
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        style={{
                                            ...inputStyle,
                                            appearance: 'none',
                                            paddingRight: '40px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="" style={{ background: '#0a0a0c' }}>Select a reason</option>
                                        <option value="Payment issue" style={{ background: '#0a0a0c' }}>🛠️ Technical Payment Issue</option>
                                        <option value="Price high" style={{ background: '#0a0a0c' }}>💰 Price is higher than expected</option>
                                        <option value="Offer missing" style={{ background: '#0a0a0c' }}>🏷️ Expected an offer/discount</option>
                                        <option value="Change mind" style={{ background: '#0a0a0c' }}>🔄 Changed my mind</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>▼</div>
                                </div>
                                <button onClick={submitFeedback} className="btn" style={{ width: '100%', padding: '16px' }}>Submit Feedback & Finish</button>
                            </div>
                        )}

                        {!showFeedbackModal && (
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ opacity: 0.6, marginBottom: '20px' }}>Feedback submitted! Thank you for helping us improve.</p>
                            </div>
                        )}

                        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            <button onClick={() => setStep(2)} className="btn" style={{ background: 'transparent', border: '2px solid var(--primary)', padding: '14px 40px' }}>
                                Try Payment Again →
                            </button>
                            <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }}>
                                Return to Home
                            </button>
                        </div>
                    </div>
                )}

                {/* Sidebar Summary */}
                {step <= 2 && (
                    <div>
                        <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                <span style={{ opacity: 0.7 }}>1x {tickets[selectedTicket as keyof typeof tickets].name}</span>
                                <span>₹{getPrice()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.9rem' }}>
                                <span style={{ opacity: 0.7 }}>Platform Handling (5%)</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--glass-border)', margin: '16px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                <span>Total</span>
                                <span>₹{total.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 };
const inputStyle = { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' };
