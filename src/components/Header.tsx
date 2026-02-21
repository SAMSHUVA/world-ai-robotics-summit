"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CONFERENCE_CONFIG } from '@/config/conference';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Home, FileText, Users, Calendar, Info, Mail, Linkedin, MessageCircle, Instagram, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    settings?: {
        name: string;
        year: string;
        shortName: string;
        fullName: string;
        location: string;
        venue: string;
        tagline: string;
        datesValue: string;
        heroTitleLine2: string;
        social: {
            whatsapp: string;
            email: string;
        }
    },
    abstractDeadline?: string;
}

export default function Header({ settings, abstractDeadline }: HeaderProps) {
    const config = settings || {
        ...CONFERENCE_CONFIG,
        datesValue: (CONFERENCE_CONFIG as any).dates?.formatted || '',
        heroTitleLine2: 'Robotics Summit',
        social: {
            whatsapp: (CONFERENCE_CONFIG as any).social?.whatsapp || '',
            email: (CONFERENCE_CONFIG as any).social?.email || ''
        }
    } as any;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [activeBadge, setActiveBadge] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const themeContext = useTheme();
    const pathname = usePathname();

    const badges = [
        `Abstracts: ${abstractDeadline || 'Coming Soon'} ⏳`,
        `Venue: ${config.venue || 'Singapore'} 🇸🇬`,
        `Early Bird Open 🎟️`
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBadge((prev) => (prev + 1) % badges.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [badges.length]);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Hide scroll hint after 3 seconds or on first scroll
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header className={`header-fixed ${isScrolled ? 'scrolled' : ''}`}>
                {/* Desktop Header Elements */}
                <div className="top-bar desktop-only">
                    <div className="container top-bar-content">
                        <div className="top-bar-info">
                            <a href={`mailto:${config.social.email}`} className="top-info-item">
                                <span className="info-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </span>
                                {config.social.email}
                            </a>
                            <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer" className="top-info-item">
                                <span className="info-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.983 9.983 0 004.78 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2v0zm0 18.288h-.003a8.316 8.316 0 01-4.235-1.156l-.304-.18-3.15.745.84-3.068-.198-.315a8.286 8.286 0 01-1.267-4.42c.002-4.572 3.722-8.292 8.3-8.295a8.24 8.24 0 015.856 2.435 8.26 8.26 0 012.43 5.862c-.002 4.576-3.724 8.295-8.27 8.295v.002zm4.538-6.205c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.808-.788.974-.145.166-.29.187-.539.062-.249-.125-1.051-.387-2.003-1.235-.74-.66-1.24-1.473-1.385-1.722-.146-.249-.016-.384.109-.508.112-.112.249-.29.373-.436.125-.145.166-.249.25-.415.082-.166.04-.311-.022-.436-.062-.124-.56-1.348-.767-1.846-.202-.486-.407-.42-.56-.428h-.477c-.166 0-.436.063-.664.312-.228.248-.871.85-.871 2.073 0 1.223.891 2.404 1.016 2.57.124.166 1.753 2.677 4.248 3.753.593.256 1.056.409 1.42.525.603.192 1.151.164 1.587.1.477-.07 1.473-.601 1.68-.1.183.207-.58.353-.601.415-.228.083-.394.125-.56-.125z" /></svg>
                                </span>
                                Chat with Support Team
                            </a>
                        </div>
                        <div className="top-bar-actions">
                            <a href="/register" className="top-register-btn">Register</a>
                        </div>
                    </div>
                </div>

                <div className="main-header glass-card desktop-only">
                    <div className="container header-content">
                        <a href="/" className="logo-container">
                            <Image
                                src="/Iaisr%20Logo.webp"
                                alt="IAISR Logo"
                                className="header-logo"
                                width={199}
                                height={67}
                                priority
                            />
                        </a>
                        <nav className="nav-links">
                            <a href="/" className="nav-link">Home</a>
                            <a href="/call-for-papers" className="nav-link">Submissions</a>
                            <a href="/speakers" className="nav-link">Speakers</a>
                            <a href="/sessions" className="nav-link">Sessions</a>
                            <a href="/about" className="nav-link">About</a>
                            <a href="/contact" className="nav-link">Contact</a>
                        </nav>
                        <div className="header-actions-group">
                            <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer" className="whatsapp-btn-header">
                                <span className="whatsapp-icon">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.983 9.983 0 004.78 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2v0zm0 18.288h-.003a8.316 8.316 0 01-4.235-1.156l-.304-.18-3.15.745.84-3.068-.198-.315a8.286 8.286 0 01-1.267-4.42c.002-4.572 3.722-8.292 8.3-8.295a8.24 8.24 0 015.856 2.435 8.26 8.26 0 012.43 5.862c-.002 4.576-3.724 8.295-8.27 8.295v.002zm4.538-6.205c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.808-.788.974-.145.166-.29.187-.539.062-.249-.125-1.051-.387-2.003-1.235-.74-.66-1.24-1.473-1.385-1.722-.146-.249-.016-.384.109-.508.112-.112.249-.29.373-.436.125-.145.166-.249.25-.415.082-.166.04-.311-.022-.436-.062-.124-.56-1.348-.767-1.846-.202-.486-.407-.42-.56-.428h-.477c-.166 0-.436.063-.664.312-.228.248-.871.85-.871 2.073 0 1.223.891 2.404 1.016 2.57.124.166 1.753 2.677 4.248 3.753.593.256 1.056.409 1.42.525.603.192 1.151.164 1.587.1.477-.07 1.473-.601 1.68-.1.183.207-.58.353-.601.415-.228.083-.394.125-.56-.125z" /></svg>
                                </span>
                                <span className="wa-text">WhatsApp</span>
                            </a>
                            <a href="/register" className="btn btn-header-premium">Register Now <span className="arrow">→</span></a>
                        </div>
                    </div>
                </div>

                {/* Mobile Redesigned Header */}
                <div className="mobile-header-redesign mobile-only">
                    {/* Row 1: Logo & Actions */}
                    <div className="mobile-row-top">
                        <a href="/" className="mobile-logo-group">
                            <Image
                                src="/Iaisr%20Logo.webp"
                                alt="IAISR Logo"
                                className="mobile-logo-img"
                                width={110}
                                height={38}
                                priority
                            />
                        </a>
                        <div className="mobile-actions-group">
                            <a href="/register" className="register-capsule">Register</a>
                            <button className="theme-toggle-btn" onClick={themeContext?.toggleTheme} aria-label="Toggle theme">
                                {isMounted && themeContext?.theme === 'dark' ? <Sun size={22} /> : isMounted ? <Moon size={22} /> : null}
                            </button>
                            <button className={`mobile-hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>

                    <div className="mobile-separator"></div>

                    {/* Row 2: Info */}
                    <div className="mobile-row-bottom">
                        <a href={`mailto:${config.social.email}`} className="mobile-email">{config.social.email}</a>
                        <div className="mobile-status-indicator">
                            <span className="dot pulse-green"></span>
                            <span className="status-text">EARLY BIRD OPEN NOW</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Slide-in Panel Redesign */}
            <div className={`mobile-nav-slider ${isMenuOpen ? 'is-open' : ''}`}>
                {/* Backdrop for closing */}
                <div className={`mobile-nav-backdrop ${isMenuOpen ? 'is-open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

                <div className={`mobile-nav-panel ${isMenuOpen ? 'is-open' : ''}`}>
                    <nav className="mobile-nav-links">
                        <a href="/" className={`mobile-link-item ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <Home size={18} className="nav-item-icon" /> <span>Home</span>
                            {pathname === '/' && <span className="active-dot"></span>}
                        </a>
                        <a href="/call-for-papers" className={`mobile-link-item ${pathname === '/call-for-papers' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <FileText size={18} className="nav-item-icon" /> <span>Submissions</span>
                            {pathname === '/call-for-papers' && <span className="active-dot"></span>}
                        </a>
                        <a href="/speakers" className={`mobile-link-item ${pathname === '/speakers' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <Users size={18} className="nav-item-icon" /> <span>Speakers</span>
                            {pathname === '/speakers' && <span className="active-dot"></span>}
                        </a>
                        <a href="/sessions" className={`mobile-link-item ${pathname === '/sessions' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <Calendar size={18} className="nav-item-icon" /> <span>Sessions</span>
                            {pathname === '/sessions' && <span className="active-dot"></span>}
                        </a>
                        <a href="/about" className={`mobile-link-item ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <Info size={18} className="nav-item-icon" /> <span>About</span>
                            {pathname === '/about' && <span className="active-dot"></span>}
                        </a>
                        <a href="/contact" className={`mobile-link-item ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                            <Mail size={18} className="nav-item-icon" /> <span>Contact</span>
                            {pathname === '/contact' && <span className="active-dot"></span>}
                        </a>
                    </nav>

                    <div className="mobile-social-circle-group">
                        <a href="https://linkedin.com/in/iaisr" target="_blank" rel="noopener noreferrer" className="mobile-social-circle blue-icon">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://m.me/iaisrglobal" target="_blank" rel="noopener noreferrer" className="mobile-social-circle blue-icon">
                            <MessageCircle size={18} />
                        </a>
                        <a href="https://www.instagram.com/iaisrmeetings/" target="_blank" rel="noopener noreferrer" className="mobile-social-circle pink-icon">
                            <Instagram size={18} />
                        </a>
                    </div>

                    <div className="mobile-trust-card">
                        <Image src="/SVGs/stars-5-1.svg" alt="5 Stars" width={80} height={16} />
                        <p>Trusted by 5000+<br />Academicians</p>
                    </div>

                    <div className="mobile-get-in-touch">
                        <h5 className="footer-heading">GET IN TOUCH</h5>
                        <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer" className="mobile-wa-support-btn">
                            <Image src="/SVGs/whatsapp-8.svg" alt="WhatsApp" width={20} height={20} />
                            <span>WhatsApp Support</span>
                        </a>
                    </div>

                    <div className="mobile-ssl-badge">
                        <ShieldCheck size={14} />
                        <span>SSL SECURED</span>
                        <Image src="/SVGs/iso-31.svg" alt="ISO" width={24} height={24} style={{ marginLeft: 'auto' }} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mobile-only {
                    display: none;
                }

                .desktop-only {
                    display: flex;
                }

                /* Header Actions Group - Desktop */
                .header-actions-group {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .whatsapp-btn-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(31, 203, 143, 0.08);
                    border: 1px solid rgba(31, 203, 143, 0.3);
                    padding: 10px 24px;
                    border-radius: 12px;
                    color: var(--primary);
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    backdrop-filter: blur(8px);
                }

                .whatsapp-btn-header:hover {
                    background: rgba(31, 203, 143, 0.12);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(31, 203, 143, 0.18);
                }

                .wa-text {
                    letter-spacing: -0.01em;
                }

                .btn-header-premium {
                    background: var(--gradient-main);
                    padding: 12px 28px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    box-shadow: 0 10px 25px rgba(31, 203, 143, 0.21);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-header-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(31, 203, 143, 0.34);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .btn-header-premium .arrow {
                    transition: transform 0.3s;
                }

                .btn-header-premium:hover .arrow {
                    transform: translateX(4px);
                }

                .desktop-only {
                    display: flex;
                }

                @media (max-width: 992px) {
                    .desktop-only {
                        display: none !important;
                    }

                    .mobile-only {
                        display: block !important;
                    }

                    .header-fixed {
                        top: 0 !important;
                        position: fixed !important;
                        width: 100% !important;
                        z-index: 9999 !important;
                        transform: none !important;
                    }

                    .mobile-header-redesign {
                        background: rgba(255, 255, 255, 0.8) !important;
                        backdrop-filter: blur(25px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(25px) saturate(180%) !important;
                        padding: 10px 18px;
                        width: 100%;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
                        height: auto;
                        position: relative;
                        z-index: 10000;
                    }

                    :global(.header-fixed.scrolled) .mobile-header-redesign {
                        background: rgba(255, 255, 255, 0.9) !important;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                        padding: 12px 20px;
                    }

                    :global([data-theme="dark"]) .mobile-header-redesign {
                        background: rgba(13, 11, 30, 0.75) !important;
                        border-color: rgba(255, 255, 255, 0.08) !important;
                    }

                    :global([data-theme="dark"]) :global(.header-fixed.scrolled) .mobile-header-redesign {
                        background: rgba(13, 11, 30, 0.95) !important;
                        border-bottom-color: rgba(255, 255, 255, 0.12) !important;
                    }

                    .mobile-row-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-bottom: 8px;
                    }

                    .mobile-logo-group {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .mobile-logo-img {
                        height: 38px;
                        width: auto;
                    }

                    .mobile-actions-group {
                        display: flex;
                        align-items: center;
                        gap: 15px; /* Increased gap */
                    }

                    .mobile-wa-btn svg {
                        width: 24px; /* Increased from 20px */
                        height: 24px;
                        color: var(--primary);
                        display: flex;
                    }

                    .theme-toggle-btn {
                        background: none;
                        border: none;
                        color: var(--text-primary);
                        padding: 6px;
                        display: flex;
                        align-items: center;
                        opacity: 0.8;
                    }

                    .theme-toggle-btn :global(svg) {
                        width: 22px; /* Increased */
                        height: 22px;
                    }

                    .register-capsule {
                        background: var(--gradient-main);
                        color: white !important;
                        text-decoration: none;
                        padding: 9px 20px; /* Increased padding */
                        border-radius: 20px;
                        font-size: 0.85rem; /* Slightly larger */
                        font-weight: 700;
                        box-shadow: 0 4px 12px rgba(31, 203, 143, 0.18);
                    }

                    .register-capsule:active {
                        transform: scale(0.96);
                    }

                    .mobile-separator {
                        height: 1px;
                        background: rgba(0,0,0,0.06);
                        margin: 0 -16px;
                    }

                    :global([data-theme="dark"]) .mobile-separator {
                        background: rgba(255,255,255,0.08);
                    }

                    .mobile-row-bottom {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-top: 8px;
                    }

                    .mobile-email {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                        opacity: 0.9;
                    }

                    .mobile-status-indicator {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: var(--primary);
                        position: relative;
                    }

                    .pulse-green::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: var(--primary);
                        border-radius: 50%;
                        animation: pulse-ring 2s infinite;
                    }

                    @keyframes pulse-ring {
                        0% { transform: scale(1); opacity: 0.7; }
                        100% { transform: scale(3.5); opacity: 0; }
                    }

                    .status-text {
                        font-size: 0.65rem;
                        font-weight: 800;
                        color: var(--text-primary);
                        letter-spacing: 0.04em;
                    }

                    /* Hamburger Button */
                    .mobile-hamburger {
                        width: 32px;
                        height: 24px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        padding: 0;
                        z-index: 10000;
                    }

                    .mobile-hamburger span {
                        width: 100%;
                        height: 3px;
                        background: var(--text-primary);
                        border-radius: 4px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .mobile-hamburger.open span:nth-child(1) {
                        transform: translateY(10.5px) rotate(45deg);
                        background: var(--primary);
                    }

                    .mobile-hamburger.open span:nth-child(2) {
                        opacity: 0;
                        transform: translateX(10px);
                    }

                    .mobile-hamburger.open span:nth-child(3) {
                        transform: translateY(-10.5px) rotate(-45deg);
                        background: var(--primary);
                    }

                    /* Sliding Panel System */
                    .mobile-nav-slider {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 9998; /* Below main header */
                        pointer-events: none;
                        display: flex;
                        justify-content: flex-end;
                    }

                    .mobile-nav-slider.is-open {
                        pointer-events: auto;
                    }

                    .mobile-nav-backdrop {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: none;
                    }

                    .mobile-nav-backdrop.is-open {
                        opacity: 1;
                        pointer-events: auto;
                    }

                    .mobile-nav-panel {
                        position: relative;
                        width: 70%;
                        max-width: 380px;
                        height: 100%;
                        background: rgba(3, 11, 26, 0.98);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        box-shadow: -5px 0 25px rgba(0,0,0,0.15);
                        transform: translateX(100%);
                        transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                        display: flex;
                        flex-direction: column;
                        padding: 130px 24px 40px;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                    }

                    .mobile-nav-panel.is-open {
                        transform: translateX(0);
                    }

                    :global([data-theme="light"]) .mobile-nav-panel {
                        background: #ffffff;
                    }

                    /* Slider Links */
                    .mobile-nav-links {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        margin-bottom: 24px;
                    }

                    .mobile-link-item {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: var(--text-primary);
                        text-decoration: none;
                        padding: 12px 14px;
                        border-radius: 12px;
                        transition: all 0.2s ease;
                        position: relative;
                    }

                    .nav-item-icon {
                        color: var(--primary);
                        opacity: 0.8;
                    }

                    .mobile-link-item:hover, .mobile-link-item:active {
                        background: rgba(31, 203, 143, 0.1);
                        color: var(--primary);
                    }

                    .mobile-link-item.active {
                        background: rgba(31, 203, 143, 0.15);
                        color: var(--primary);
                        box-shadow: 0 4px 12px rgba(31, 203, 143, 0.05);
                    }

                    .mobile-link-item.active .nav-item-icon {
                        opacity: 1;
                    }

                    .active-dot {
                        width: 6px;
                        height: 6px;
                        background-color: var(--primary);
                        border-radius: 50%;
                        position: absolute;
                        right: 16px;
                    }

                    /* Social Circles */
                    .mobile-social-circle-group {
                        display: flex;
                        gap: 12px;
                        margin-bottom: 24px;
                        padding: 0 8px;
                    }

                    .mobile-social-circle {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid rgba(128, 128, 128, 0.2);
                        color: var(--text-primary);
                        transition: all 0.2s ease;
                    }

                    .mobile-social-circle.blue-icon {
                        color: #0077b5;
                    }

                    .mobile-social-circle.pink-icon {
                        color: #E1306C;
                    }

                    .mobile-social-circle:active {
                        transform: scale(0.95);
                        background: rgba(128, 128, 128, 0.1);
                    }

                    /* Trust Card */
                    .mobile-trust-card {
                        background: rgba(31, 203, 143, 0.1);
                        border-radius: 16px;
                        padding: 16px;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        margin-bottom: 24px;
                        border: 1px solid rgba(31, 203, 143, 0.2);
                    }

                    .mobile-trust-card p {
                        font-size: 0.85rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        line-height: 1.4;
                        margin: 0;
                    }

                    /* Get IN Touch */
                    .mobile-get-in-touch {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-bottom: 30px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(128, 128, 128, 0.15);
                    }

                    .footer-heading {
                        font-size: 0.75rem;
                        font-weight: 800;
                        color: var(--text-secondary);
                        letter-spacing: 0.05em;
                        margin: 0;
                        text-transform: uppercase;
                    }

                    .mobile-wa-support-btn {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        text-decoration: none;
                        color: var(--primary);
                        font-weight: 600;
                        font-size: 0.95rem;
                        padding: 10px 0;
                    }

                    /* SSL Badge */
                    .mobile-ssl-badge {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 0.7rem;
                        font-weight: 800;
                        color: var(--text-secondary);
                        margin-top: auto;
                    }
                }

                @media (min-width: 993px) {
                    .main-header {
                        background: rgba(13, 11, 30, 0.75) !important;
                        backdrop-filter: blur(30px) saturate(200%) !important;
                        -webkit-backdrop-filter: blur(30px) saturate(200%) !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 20px 0 !important;
                        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    }

                    :global(.header-fixed.scrolled) .main-header {
                        padding: 12px 0 !important;
                        background: rgba(13, 11, 30, 0.85) !important;
                        backdrop-filter: blur(40px) saturate(200%) !important;
                        -webkit-backdrop-filter: blur(40px) saturate(200%) !important;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                    }

                    :global([data-theme="light"]) .main-header {
                        background: rgba(255, 255, 255, 0.88) !important;
                        backdrop-filter: blur(35px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.02);
                    }

                    :global([data-theme="light"] .header-fixed.scrolled) .main-header {
                        background: rgba(255, 255, 255, 0.95) !important;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    }

                    .header-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 40px;
                        gap: 15px;
                        max-width: 1600px;
                    }

                    .logo-container {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-right: 0;
                        flex-shrink: 0;
                        text-decoration: none;
                    }

                    .nav-links {
                        gap: 32px;
                        margin: 0;
                        flex: 1;
                        justify-content: center;
                    }

                    .nav-links a {
                        font-size: 0.95rem;
                        font-weight: 600;
                        letter-spacing: 0.01em;
                        color: var(--text-primary);
                        opacity: 0.7;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        padding: 8px 0;
                    }

                    .nav-links a::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 0;
                        height: 2px;
                        background: var(--primary);
                        transition: width 0.3s;
                    }

                    .nav-links a:hover {
                        opacity: 1;
                        color: var(--primary);
                    }

                    .nav-links a:hover::after {
                        width: 100%;
                    }

                    .top-bar {
                        background: #f8f9ff;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                        padding: 8px 0;
                    }

                    :global([data-theme="dark"]) .top-bar {
                        background: rgba(13, 11, 30, 0.4);
                        border-bottom-color: rgba(255,255,255,0.05);
                    }

                    .top-info-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 0.8rem;
                        color: var(--text-secondary);
                        text-decoration: none;
                        font-weight: 500;
                        transition: color 0.3s;
                    }

                    .top-info-item:hover {
                        color: #1FCB8F;
                    }

                    .info-icon {
                        display: flex;
                        color: #1FCB8F;
                    }
                }

                /* Hide header actions group on mobile */
                @media (max-width: 992px) {
                    .header-actions-group {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}
