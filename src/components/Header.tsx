"use client";
import React, { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header-fixed ${isScrolled ? 'scrolled' : ''}`}>
            <div className="top-bar">
                <div className="container top-bar-content">
                    <div className="top-bar-info">
                        {/* Location Text Removed per request */}
                        <a href="https://wa.me/918754057375" target="_blank" className="whatsapp-btn">
                            <span className="whatsapp-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.983 9.983 0 004.78 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2v0zm0 18.288h-.003a8.316 8.316 0 01-4.235-1.156l-.304-.18-3.15.745.84-3.068-.198-.315a8.286 8.286 0 01-1.267-4.42c.002-4.572 3.722-8.292 8.3-8.295a8.24 8.24 0 015.856 2.435 8.26 8.26 0 012.43 5.862c-.002 4.576-3.724 8.295-8.27 8.295v.002zm4.538-6.205c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.808-.788.974-.145.166-.29.187-.539.062-.249-.125-1.051-.387-2.003-1.235-.74-.66-1.24-1.473-1.385-1.722-.146-.249-.016-.384.109-.508.112-.112.249-.29.373-.436.125-.145.166-.249.25-.415.082-.166.04-.311-.022-.436-.062-.124-.56-1.348-.767-1.846-.202-.486-.407-.42-.56-.428h-.477c-.166 0-.436.063-.664.312-.228.248-.871.85-.871 2.073 0 1.223.891 2.404 1.016 2.57.124.166 1.753 2.677 4.248 3.753.593.256 1.056.409 1.42.525.603.192 1.151.164 1.587.1.477-.07 1.473-.601 1.68-.1.183.207-.58.353-.601.415-.228.083-.394.125-.56-.125z" /></svg>
                            </span>
                            <span className="whatsapp-text">Chat on WhatsApp</span>
                        </a>
                    </div>
                    <div className="top-bar-actions">
                        <a href="/register" className="top-register-btn">Register</a>
                    </div>
                </div>
            </div>
            <div className="main-header glass-card">
                <div className="container header-content">
                    <a href="/" className="logo-container">
                        <img src="/logo.png" alt="IAISR Logo" className="header-logo animated-iaisr-logo" />
                        <div className="mobile-header-info">
                            <div className="mhi-title">World AI & Robotics Summit 2026</div>
                            <div className="mhi-meta">May 22-24, Singapore</div>
                        </div>
                        <div className="header-flag-rotator">
                            <div className="flag-track">
                                <span><img src="https://flagcdn.com/w40/sg.png" alt="SG" /></span>
                                <span><img src="https://flagcdn.com/w40/us.png" alt="US" /></span>
                                <span><img src="https://flagcdn.com/w40/gb.png" alt="GB" /></span>
                                <span><img src="https://flagcdn.com/w40/jp.png" alt="JP" /></span>
                                <span><img src="https://flagcdn.com/w40/in.png" alt="IN" /></span>
                                <span><img src="https://flagcdn.com/w40/ae.png" alt="AE" /></span>
                                <span><img src="https://flagcdn.com/w40/au.png" alt="AU" /></span>
                                <span><img src="https://flagcdn.com/w40/ca.png" alt="CA" /></span>
                                <span><img src="https://flagcdn.com/w40/de.png" alt="DE" /></span>
                                <span><img src="https://flagcdn.com/w40/kr.png" alt="KR" /></span>
                                {/* Duplicate for Loop */}
                                <span><img src="https://flagcdn.com/w40/sg.png" alt="SG" /></span>
                                <span><img src="https://flagcdn.com/w40/us.png" alt="US" /></span>
                                <span><img src="https://flagcdn.com/w40/gb.png" alt="GB" /></span>
                                <span><img src="https://flagcdn.com/w40/jp.png" alt="JP" /></span>
                                <span><img src="https://flagcdn.com/w40/in.png" alt="IN" /></span>
                                <span><img src="https://flagcdn.com/w40/ae.png" alt="AE" /></span>
                                <span><img src="https://flagcdn.com/w40/au.png" alt="AU" /></span>
                                <span><img src="https://flagcdn.com/w40/ca.png" alt="CA" /></span>
                                <span><img src="https://flagcdn.com/w40/de.png" alt="DE" /></span>
                                <span><img src="https://flagcdn.com/w40/kr.png" alt="KR" /></span>
                            </div>
                        </div>
                    </a>
                    <nav className="nav-links">
                        <a href="/">Home</a>
                        <a href="/call-for-papers">Submissions</a>
                        <a href="/speakers">Speakers</a>
                        <a href="/sessions">Schedule</a>
                        <a href="/about">About</a>
                    </nav>
                    <a href="/register" className="btn btn-header">Register Now →</a>
                </div>
            </div>
            {/* Horizontal Scroll Nav for Mobile */}
            <div className="mobile-scroll-nav">
                <div className="container scroll-nav-container">
                    <a href="/" className="scroll-nav-link active">Home</a>
                    <a href="/call-for-papers" className="scroll-nav-link">Papers</a>
                    <a href="/speakers" className="scroll-nav-link">Speakers</a>
                    <a href="/sessions" className="scroll-nav-link">Schedule</a>
                    <a href="/about" className="scroll-nav-link">About</a>
                </div>
            </div>

            <style jsx>{`
                .whatsapp-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #25D366;
                    border: none;
                    padding: 6px 16px;
                    border-radius: 20px;
                    color: white;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);
                }

                .whatsapp-btn:hover {
                    background: #128C7E;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 14px rgba(37, 211, 102, 0.3);
                }

                .whatsapp-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @keyframes techPulse {
                    0% { filter: drop-shadow(0 0 0px rgba(91, 77, 255, 0)); transform: scale(1); }
                    50% { filter: drop-shadow(0 0 15px rgba(91, 77, 255, 0.6)); transform: scale(1.02); }
                    100% { filter: drop-shadow(0 0 0px rgba(91, 77, 255, 0)); transform: scale(1); }
                }

                .header-logo {
                    animation: techPulse 4s infinite ease-in-out;
                    will-change: transform, filter;
                }
            `}</style>
        </header>
    );
}
