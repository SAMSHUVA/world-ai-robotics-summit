"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, Calendar, Mail, X, Menu } from 'lucide-react';

const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SUBMISSIONS', path: '/call-for-papers' },
    { label: 'SPEAKERS', path: '/speakers' },
    { label: 'SESSIONS', path: '/sessions' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
];

export default function MobileHamburgerMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Close menu when route changes
        if (mounted) {
            setIsOpen(false);
        }
    }, [pathname, mounted]);

    useEffect(() => {
        // Prevent body scroll when menu is open
        if (!mounted) return;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, mounted]);

    // Don't render anything on server or before mount
    if (!mounted) {
        return null;
    }

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="hamburger-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <Menu size={24} strokeWidth={2} />
            </button>

            {/* Full Screen Overlay Menu */}
            <div className={`hamburger-menu-overlay ${isOpen ? 'open' : ''}`}>
                <div className="menu-header">
                    <span className="menu-title">AGTECH SUMMIT</span>
                    <button
                        className="close-button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={28} strokeWidth={2} />
                    </button>
                </div>

                <nav className="menu-nav">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`menu-item ${isActive ? 'active' : ''}`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="menu-footer">
                    <Link href="/register" className="register-button">
                        Register
                    </Link>
                </div>
            </div>

            <style jsx>{`
                /* Only show on mobile */
                .hamburger-toggle {
                    display: none;
                }

                @media (max-width: 992px) {
                    .hamburger-toggle {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        z-index: 99998;
                        width: 48px;
                        height: 48px;
                        background: rgba(13, 11, 30, 0.9);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    }

                    :global([data-theme="light"]) .hamburger-toggle {
                        background: rgba(255, 255, 255, 0.95);
                        border-color: rgba(0, 0, 0, 0.1);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .hamburger-toggle:active {
                        transform: scale(0.95);
                    }

                    .hamburger-toggle :global(svg) {
                        color: rgba(255, 255, 255, 0.9);
                    }

                    :global([data-theme="light"]) .hamburger-toggle :global(svg) {
                        color: rgba(0, 0, 0, 0.8);
                    }

                    /* Overlay Menu */
                    .hamburger-menu-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 99999;
                        background: linear-gradient(135deg, 
                            rgba(15, 159, 116, 0.95) 0%, 
                            rgba(31, 203, 143, 0.92) 50%, 
                            rgba(90, 209, 255, 0.9) 100%
                        );
                        backdrop-filter: blur(30px) saturate(180%);
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    :global([data-theme="light"]) .hamburger-menu-overlay {
                        background: linear-gradient(135deg, 
                            rgba(232, 248, 242, 0.98) 0%, 
                            rgba(226, 247, 255, 0.96) 50%, 
                            rgba(240, 253, 250, 0.98) 100%
                        );
                    }

                    .hamburger-menu-overlay.open {
                        opacity: 1;
                        pointer-events: auto;
                    }

                    /* Menu Header */
                    .menu-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 20px 20px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    :global([data-theme="light"]) .menu-header {
                        border-bottom-color: rgba(0, 0, 0, 0.1);
                    }

                    .menu-title {
                        font-size: 0.75rem;
                        font-weight: 900;
                        letter-spacing: 0.1em;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    :global([data-theme="light"]) .menu-title {
                        color: rgba(0, 0, 0, 0.5);
                    }

                    .close-button {
                        width: 48px;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255, 255, 255, 0.15);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    :global([data-theme="light"]) .close-button {
                        background: rgba(0, 0, 0, 0.05);
                        border-color: rgba(0, 0, 0, 0.1);
                    }

                    .close-button:active {
                        transform: scale(0.95);
                    }

                    .close-button :global(svg) {
                        color: white;
                    }

                    :global([data-theme="light"]) .close-button :global(svg) {
                        color: rgba(0, 0, 0, 0.7);
                    }

                    /* Navigation */
                    .menu-nav {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        flex: 1;
                        gap: 8px;
                        padding: 40px 20px;
                    }

                    .menu-item {
                        font-size: 2rem;
                        font-weight: 900;
                        color: white;
                        text-decoration: none;
                        letter-spacing: -0.02em;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.3s ease;
                        padding: 12px 24px;
                        border-radius: 12px;
                        position: relative;
                    }

                    :global([data-theme="light"]) .menu-item {
                        color: rgba(0, 0, 0, 0.85);
                    }

                    .hamburger-menu-overlay.open .menu-item {
                        opacity: 1;
                        transform: translateY(0);
                        animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }

                    @keyframes slide-in {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .menu-item:active {
                        transform: scale(0.98);
                    }

                    .menu-item.active {
                        background: rgba(255, 255, 255, 0.2);
                        box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
                    }

                    :global([data-theme="light"]) .menu-item.active {
                        background: rgba(15, 159, 116, 0.15);
                        box-shadow: 0 0 20px rgba(15, 159, 116, 0.2);
                    }

                    /* Menu Footer */
                    .menu-footer {
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                    }

                    .register-button {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 16px 48px;
                        background: rgba(255, 255, 255, 0.95);
                        color: #0F9F74;
                        font-size: 1rem;
                        font-weight: 900;
                        text-decoration: none;
                        border-radius: 16px;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    :global([data-theme="light"]) .register-button {
                        background: rgba(15, 159, 116, 0.95);
                        color: white;
                    }

                    .hamburger-menu-overlay.open .register-button {
                        opacity: 1;
                        transform: translateY(0);
                        animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
                    }

                    .register-button:active {
                        transform: scale(0.95);
                    }
                }
            `}</style>
        </>
    );
}
