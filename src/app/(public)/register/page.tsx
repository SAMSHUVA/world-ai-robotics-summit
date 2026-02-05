'use client';

import React, { useState, useEffect } from 'react';
import ExitRetentionModal from '@/components/ExitRetentionModal';

// --- Icons & SVGs ---
const SSLIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const PCIIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v8"></path>
        <path d="M8 12h8"></path>
    </svg>
);

const RazorpayLogo = () => (
    <svg width="90" height="22" viewBox="0 0 100 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 5px rgba(91, 77, 255, 0.3))' }}>
        <path d="M12.5 0L0 25H5L15 5L20 15L17.5 20H22.5L25 15L12.5 0Z" fill="#5B4DFF" />
        <text x="30" y="18" fill="white" fontSize="14" fontWeight="900" fontFamily="Inter, Arial, sans-serif" letterSpacing="-0.5">Razorpay</text>
    </svg>
);

const VisaLogo = () => (
    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" className="payment-icon">
        <rect width="45" height="28" rx="6" fill="#1A1F71" />
        <path d="M16 19L17.5 9H20L18.5 19H16ZM30 9.2C29.5 9 28.5 8.8 27.5 8.8C24.5 8.8 22.5 10.5 22.5 13C22.5 14.5 24 15.5 25 16C26 16.5 26.5 16.8 26.5 17.5C26.5 18.5 25.5 19 24.5 19C23.5 19 22.8 18.8 22.2 18.5L21.8 20.2C22.5 20.5 23.5 20.8 24.8 20.8C28 20.8 30 19.2 30 16.5C30 14 26.5 13.8 26.5 12.5C26.5 12.2 26.8 11.8 27.5 11.6C28 11.6 28.8 11.5 30 12L30.5 10.2C30 9.8 29.5 9.5 29 9.3V9.2ZM39 9H36.5C35.8 9 35.3 9.4 35 10L31 20H34L34.5 18.5H38.5L39 20H42L39 9ZM37.5 16H35.5L37 11L37.5 16Z" fill="white" />
    </svg>
);

const MCLogo = () => (
    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" className="payment-icon">
        <rect width="45" height="28" rx="6" fill="#222" />
        <circle cx="18" cy="14" r="8" fill="#EB001B" />
        <circle cx="27" cy="14" r="8" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
);

const AmexLogo = () => (
    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" className="payment-icon">
        <rect width="45" height="28" rx="6" fill="#016FD0" />
        <text x="5" y="18" fill="white" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif">AMEX</text>
    </svg>
);

const UPILogo = () => (
    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" className="payment-icon">
        <rect width="45" height="28" rx="6" fill="white" />
        <path d="M14 9L12 20H15L16 14.5H19.5L18.5 20H21.5L24 9H14Z" fill="#6B3595" />
        <path d="M26 9L24 20H27L29.5 9H26Z" fill="#00A74A" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.011 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.413 1.259 4.858l-1.281 4.673 4.781-1.253c1.404.762 3.006 1.197 4.706 1.197 5.506 0 9.989-4.478 9.989-9.984s-4.483-9.984-9.989-9.984zm0 18.291c-1.544 0-3.012-.411-4.281-1.127l-.307-.173-2.825.741.751-2.739-.19-.302c-.777-1.238-1.187-2.666-1.187-4.148 0-4.347 3.536-7.886 7.892-7.886s7.891 3.539 7.891 7.886c0 4.347-3.536 7.886-7.891 7.886zm4.569-6.31c-.249-.125-1.472-.725-1.7-.808-.228-.082-.394-.125-.558.125-.164.249-.636.808-.781.975-.145.164-.294.187-.544.058-.249-.125-1.054-.388-2.007-1.235-.742-.66-1.242-1.474-1.387-1.725-.145-.249-.016-.384.11-.508.112-.112.249-.294.375-.443.125-.145.166-.249.251-.411.082-.164.041-.31-.02-.443-.058-.125-.558-1.347-.764-1.841-.2-.482-.4-.413-.558-.421-.144-.007-.31-.007-.477-.007s-.442.062-.672.31c-.228.249-.877.858-.877 2.09s.896 2.427.994 2.56c.101.125 1.764 2.693 4.269 3.774.59.256 1.056.408 1.411.521.594.187 1.136.161 1.564.1.477-.066 1.472-.602 1.681-1.187.211-.585.211-1.085.145-1.187-.062-.102-.23-.164-.48-.291z" />
    </svg>
);

// --- Benefit Icons ---
const MapPin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Coffee = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
const Users = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const Award = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const Monitor = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const MessageSquare = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const Share2 = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const Globe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '15px 0' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '500' }}
            >
                <span>{question}</span>
                <span style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {isOpen && (
                <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function RegisterPage() {
    const [step, setStep] = useState(1); // 1: Ticket, 2: Details, 3: Success, 4: Abandoned
    const [selectedTicket, setSelectedTicket] = useState('regular');
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [attendeeId, setAttendeeId] = useState<number | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [hasExitModalShown, setHasExitModalShown] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        org: '',
        role: 'Professor / Faculty',
        dietary: '',
    });

    const tickets = {
        early: { price: 299, name: 'Early Bird (In-Person)', status: 'LIMITED', value: 'EARLY_BIRD', mode: 'IN_PERSON' },
        regular: { price: 399, name: 'Regular (In-Person)', status: 'POPULAR', value: 'REGULAR', mode: 'IN_PERSON' },
        student: { price: 199, name: 'Student (In-Person)', status: 'ECONOMY', value: 'STUDENT', mode: 'IN_PERSON' },
        e_oral: { price: 149, name: 'E-Oral (Virtual)', status: 'REMOTE', value: 'E_ORAL', mode: 'VIRTUAL' },
        e_poster: { price: 99, name: 'E-Poster (Virtual)', status: 'REMOTE', value: 'E_POSTER', mode: 'VIRTUAL' },
        listener: { price: 79, name: 'Listener (Virtual)', status: 'DELEGATE', value: 'LISTENER', mode: 'VIRTUAL' },
    };

    const getBasePrice = () => {
        // @ts-ignore
        return tickets[selectedTicket].price;
    }

    const discountAmount = getBasePrice() * (discount / 100);
    const finalPrice = getBasePrice() - discountAmount;
    const tax = finalPrice * 0.05;
    const total = finalPrice + tax;

    const [abandonmentReason, setAbandonmentReason] = useState('');
    const [abandonmentEmail, setAbandonmentEmail] = useState('');
    const [abandonmentNotes, setAbandonmentNotes] = useState('');
    const [isSubmittingAbandonment, setIsSubmittingAbandonment] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Exit intent detection (Mouse - Desktop)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 50 && !hasExitModalShown && step < 3) {
                setShowExitModal(true);
                setHasExitModalShown(true);
            }
        };

        // Exit intent detection (Back Button - Mobile)
        // Push a state so we can detect one 'back' click
        window.history.pushState({ exitIntent: true }, '');

        const handlePopState = (e: PopStateEvent) => {
            if (step < 3 && !hasExitModalShown) {
                // Prevent actually going back if they haven't seen the modal
                setShowExitModal(true);
                setHasExitModalShown(true);
                // Re-push state so they can eventually leave if they click back again
                window.history.pushState({ exitIntent: true }, '');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.body.removeChild(script);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('popstate', handlePopState);
        }
    }, [hasExitModalShown, step]);

    const applyCoupon = async (code: string = couponCode) => {
        if (!code) return;
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code.toUpperCase() }),
            });
            const data = await res.json();
            if (data.valid) {
                setDiscount(data.coupon.discountValue);
                setCouponCode(data.coupon.code);
            } else {
                alert(data.error || 'Invalid coupon code');
                setDiscount(0);
            }
        } catch (err) {
            console.error('Coupon validation error:', err);
        }
    };

    const handleCouponAcceptedFromExitModal = (code: string) => {
        setCouponCode(code);
        applyCoupon(code);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegistration = async () => {
        setLoading(true);
        try {
            const regRes = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // @ts-ignore
                    ticketType: tickets[selectedTicket].value,
                    // @ts-ignore
                    attendanceMode: tickets[selectedTicket].mode,
                    couponCode: discount > 0 ? couponCode : null,
                    discountApplied: discount,
                    amount: total,
                }),
            });

            const regData = await regRes.json();
            if (!regData.success) throw new Error(regData.error);

            setAttendeeId(regData.attendee.id);

            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attendeeId: regData.attendee.id,
                    // @ts-ignore
                    ticketType: tickets[selectedTicket].value,
                    discountAmount: discountAmount,
                    customTotal: total,
                }),
            });

            const order = await orderRes.json();
            setOrderId(order.id);

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
                        setStep(4);
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
                setStep(3);
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        } catch (err) {
            alert('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '80px 20px', minHeight: '100vh' }}>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .shimmer-text {
                    background: linear-gradient(90deg, #fff 0%, #5B4DFF 50%, #fff 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s infinite linear;
                }
                .trust-item:hover { transform: scale(1.02); color: var(--primary); transition: all 0.3s ease; }
                
                .payment-icon {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }
                .payment-icon:hover {
                    transform: scale(1.2) translateY(-5px) rotate(2deg);
                    box-shadow: 0 10px 20px rgba(91, 77, 255, 0.4);
                    filter: brightness(1.2);
                }
                
                .benefit-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.05);
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    border: 1px solid var(--glass-border);
                    transition: all 0.3s ease;
                }
                .benefit-tag:hover {
                    background: rgba(91, 77, 255, 0.1);
                    border-color: var(--primary);
                    transform: translateX(5px);
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .staggered-icon {
                    opacity: 0;
                    animation: slideRight 0.5s ease forwards;
                }
            `}</style>

            <header className="registration-header animate-in" style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 className="shimmer-text" style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 'bold' }}>
                    Join the Future of AI
                </h1>
                <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Secure your spot at the World AI & Robotics Summit. October 24-26, 2026.
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
                    <div className="glass-card animate-in">
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
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>${ticket.price}</div>
                                </div>
                            ))}
                        </div>

                        {/* DYNAMIC BENEFITS SECTION */}
                        <div className="animate-in" style={{ marginTop: '30px', animationDelay: '0.2s' }}>
                            <div style={{
                                padding: '24px',
                                background: 'rgba(91, 77, 255, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(91, 77, 255, 0.2)',
                                transition: 'all 0.5s ease'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--primary)', display: 'flex' }}>
                                        {tickets[selectedTicket as keyof typeof tickets].mode === 'IN_PERSON' ? <MapPin /> : <Globe />}
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--primary)', margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                                            {tickets[selectedTicket as keyof typeof tickets].mode === 'IN_PERSON' ? 'In-Person Experience' : 'Virtual Pass Benefits'}
                                        </h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>
                                            Premium benefits for your selected entry type
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {tickets[selectedTicket as keyof typeof tickets].mode === 'IN_PERSON' ? (
                                        <>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><MapPin /></span> Venue: Singapore Expo Center</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Coffee /></span> Lunch & Refreshments Included</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Users /></span> Physical Networking sessions</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Award /></span> Printed Certificates & Kits</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Monitor /></span> Global Live Streaming Access</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><MessageSquare /></span> Interactive Digital Q&A</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Share2 /></span> Online Networking Lounge</div>
                                            <div className="benefit-tag"><span style={{ color: 'var(--primary)', display: 'flex' }}><Award /></span> Digital E-Certificates</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', textAlign: 'right' }}>
                            <button onClick={() => setStep(2)} className="btn">Continue to Details</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass-card animate-in">
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
                                <label style={labelStyle}>Dietary Requirements (In-Person only)</label>
                                <textarea name="dietary" value={formData.dietary} onChange={handleInputChange} style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Any allergies or requirements?"></textarea>
                            </div>

                            <div style={{ padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                <label style={{ ...labelStyle, marginBottom: '12px' }}>Have a coupon code?</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                                        placeholder="Enter code (e.g. SAVE10)"
                                    />
                                    <button type="button" onClick={() => applyCoupon()} className="btn" style={{ padding: '0 25px' }}>Apply</button>
                                </div>
                                {discount > 0 && (
                                    <p style={{ color: '#00ff88', fontSize: '0.85rem', marginTop: '8px', fontWeight: 'bold' }}>
                                        ✓ {discount}% discount applied!
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button type="button" onClick={() => setStep(1)} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                                <button type="submit" disabled={loading} className="btn">{loading ? 'Processing...' : `Pay $${total.toFixed(0)}`}</button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass-card animate-in" style={{ textAlign: 'center', padding: '60px 40px', gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Payment Completed!</h2>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                            Thank you for registering. You are now part of the World AI & Robotics Summit 2026.
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
                    <div className="glass-card animate-in" style={{ padding: '40px 24px', gridColumn: 'span 2', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧐</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Registration Incomplete</h2>
                        <p style={{ opacity: 0.7, marginBottom: '30px' }}>
                            We noticed you couldn't complete your registration. Help us improve by sharing why:
                        </p>

                        <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <label style={labelStyle}>What was the main reason?*</label>
                            <select
                                value={abandonmentReason}
                                onChange={(e) => setAbandonmentReason(e.target.value)}
                                style={{ ...inputStyle, marginBottom: '20px' }}
                            >
                                <option value="">Select a reason</option>
                                <option value="PRICE_HIGH">Price is too high</option>
                                <option value="NOT_READY">Not ready to register yet</option>
                                <option value="NEED_APPROVAL">Need manager/supervisor approval</option>
                                <option value="TECHNICAL_ISSUE">Encountered technical issues</option>
                                <option value="OTHER">Other reason</option>
                            </select>

                            {abandonmentReason === 'PRICE_HIGH' && (
                                <div className="coupon-offer-box animate-in" style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                                    <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>🎉 Special Discount Found!</h4>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '15px' }}>We understand budget constraints. Use code <strong>SAVE10</strong> for an immediate 10% discount.</p>
                                    <button
                                        onClick={() => {
                                            setCouponCode('SAVE10');
                                            setDiscount(10);
                                            setStep(2);
                                        }}
                                        className="btn"
                                        style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                                    >
                                        Apply SAVE10 & Continue →
                                    </button>
                                </div>
                            )}

                            <label style={labelStyle}>Additional comments (optional)</label>
                            <textarea
                                value={abandonmentNotes}
                                onChange={(e) => setAbandonmentNotes(e.target.value)}
                                placeholder="Any specific concerns?"
                                style={{ ...inputStyle, minHeight: '100px', marginBottom: '20px' }}
                            />

                            <button
                                onClick={async () => {
                                    setIsSubmittingAbandonment(true);
                                    await fetch('/api/exit-feedback', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            ticketType: tickets[selectedTicket as keyof typeof tickets].value,
                                            abandonReason: abandonmentReason || 'UNKNOWN',
                                            additionalNotes: abandonmentNotes,
                                            wasOfferedCoupon: abandonmentReason === 'PRICE_HIGH',
                                            acceptedCoupon: false
                                        })
                                    });
                                    setIsSubmittingAbandonment(false);
                                    window.location.href = '/';
                                }}
                                className="btn"
                                style={{ width: '100%' }}
                                disabled={isSubmittingAbandonment || !abandonmentReason}
                            >
                                {isSubmittingAbandonment ? 'Saving...' : 'Submit Feedback & Return Home'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Sidebar Summary */}
                {step <= 2 && (
                    <div>
                        <div className="glass-card animate-in" style={{ position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                <span style={{ opacity: 0.7 }}>1x {tickets[selectedTicket as keyof typeof tickets].name}</span>
                                <span>${getBasePrice()}</span>
                            </div>

                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: '#00ff88' }}>
                                    <span style={{ opacity: 0.7 }}>Discount ({discount}%)</span>
                                    <span>-${discountAmount.toFixed(0)}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.9rem' }}>
                                <span style={{ opacity: 0.7 }}>Platform Handling (5%)</span>
                                <span>${tax.toFixed(0)}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--glass-border)', margin: '16px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                <span>Total</span>
                                <span>${total.toFixed(0)}</span>
                            </div>

                            <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
                                <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', opacity: 0.8 }}>
                                    <div style={{ color: '#00ff88' }}><SSLIcon /></div>
                                    <span><strong>SSL Secured</strong> 256-bit Encryption</span>
                                </div>
                                <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', opacity: 0.8 }}>
                                    <div style={{ color: '#5B4DFF' }}><PCIIcon /></div>
                                    <span><strong>PCI DSS</strong> Compliant Payments</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>POWERED BY</span>
                                        <RazorpayLogo />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', opacity: 1, marginTop: '8px' }}>
                                        <div className="staggered-icon" style={{ animationDelay: '0.1s' }}><VisaLogo /></div>
                                        <div className="staggered-icon" style={{ animationDelay: '0.2s' }}><MCLogo /></div>
                                        <div className="staggered-icon" style={{ animationDelay: '0.3s' }}><AmexLogo /></div>
                                        <div className="staggered-icon" style={{ animationDelay: '0.4s' }}><UPILogo /></div>
                                        <div className="staggered-icon" style={{ animationDelay: '0.5s', width: '45px', height: '28px', fontSize: '0.65rem', border: '1px solid var(--glass-border)', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>+ more</div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '5px' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px' }}>Need Assistance?</p>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        <a href="https://wa.me/918754057375" target="_blank" className="btn" style={{ fontSize: '0.8rem', padding: '8px', background: '#25D366', color: 'white' }}>
                                            <WhatsAppIcon /> <span style={{ marginLeft: '8px' }}>Chat on WhatsApp</span>
                                        </a>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center' }}>
                                            📧 info@iaisr.com <br />
                                            <span style={{ fontSize: '0.7rem' }}>Avg. response time: &lt; 2 Hours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FAQ SECTION */}
            <div className="animate-in" style={{ maxWidth: '800px', margin: '80px auto 0', animationDelay: '0.4s' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>Frequently Asked Questions</h2>
                <div className="glass-card">
                    <FAQItem
                        question="Is my payment secure?"
                        answer="Yes, all transactions are processed through Razorpay's secure infrastructure with 256-bit SSL encryption. We never store your credit card or sensitive bank details."
                    />
                    <FAQItem
                        question="What is the refund policy?"
                        answer="We offer a full refund if canceled 30 days before the event. Cancellations within 15-30 days are eligible for a 50% refund. Please check our Terms of Service for more details."
                    />
                    <FAQItem
                        question="Can I change my attendance mode (In-Person/Virtual)?"
                        answer="Yes, you can upgrade or downgrade your ticket up to 14 days before the event. Please contact info@iaisr.com for assistance with ticket transfers."
                    />
                    <FAQItem
                        question="Will I receive a formal invoice for my organization?"
                        answer="Absolutely. A formal registration invoice will be sent to your registered email address automatically after successful payment verification."
                    />
                </div>
            </div>

            {showExitModal && (
                <ExitRetentionModal
                    onClose={() => setShowExitModal(false)}
                    onCouponAccepted={handleCouponAcceptedFromExitModal}
                    currentTicketType={tickets[selectedTicket as keyof typeof tickets].value}
                />
            )}
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 };
const inputStyle = { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' };
