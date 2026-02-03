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
                        <span>📍 Marina Bay Sands, Singapore</span>
                        <a href="https://wa.me/1234567890" target="_blank" className="whatsapp-link">💬 Support</a>
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
        </header>
    );
}
