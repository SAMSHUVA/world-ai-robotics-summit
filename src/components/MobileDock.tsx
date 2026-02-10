"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, Calendar, Mail } from 'lucide-react';

const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Submit', icon: FileText, path: '/call-for-papers' },
    { label: 'Speaker', icon: Users, path: '/speakers' },
    { label: 'Schedule', icon: Calendar, path: '/sessions' },
    { label: 'Contact', icon: Mail, path: '/contact' },
];

export default function MobileDock() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getNormalizedPath = (path: string) => {
        if (!path) return '';
        return path === '/' ? '/' : path.replace(/\/$/, '').toLowerCase();
    };

    const currentPath = getNormalizedPath(pathname || '');

    // Render an empty shell on server to match client precisely
    return (
        <div className="mobile-dock-v5-wrapper" id="mobile-dock-v5">
            {mounted ? (
                <nav className="mobile-dock">
                    <div className="dock-items">
                        {navItems.map((item) => {
                            const itemPath = getNormalizedPath(item.path);
                            const isActive = itemPath === '/'
                                ? currentPath === '/'
                                : currentPath.startsWith(itemPath);

                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`dock-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="item-content">
                                        <div className="icon-wrapper">
                                            {isActive && <div className="active-pill" />}
                                            <Icon
                                                size={20}
                                                className="dock-icon"
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />
                                            {isActive && <div className="active-dot" />}
                                        </div>
                                        <span className="dock-label">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            ) : (
                <div className="mobile-dock-placeholder" style={{ height: '70px', opacity: 0 }} />
            )}

            <style jsx>{`
                .mobile-dock-v5-wrapper {
                    display: none;
                }

                @media (max-width: 992px) {
                    .mobile-dock-v5-wrapper {
                        display: block;
                        position: fixed;
                        bottom: 0px;
                        left: 0;
                        right: 0;
                        z-index: 99999;
                        padding: 10px 12px 24px;
                        background: linear-gradient(to top, rgba(13, 11, 30, 0.8) 0%, transparent 100%);
                        pointer-events: none;
                    }

                    .mobile-dock {
                        max-width: 500px;
                        margin: 0 auto;
                        background: rgba(13, 11, 30, 0.95);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        pointer-events: auto;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
                        animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    @keyframes slide-up {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }

                    :global([data-theme="light"]) .mobile-dock {
                        background: rgba(255, 255, 255, 0.98);
                        border-color: rgba(0, 0, 0, 0.1);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    }

                    .dock-items {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        padding: 8px 4px;
                    }

                    .dock-item {
                        position: relative;
                        flex: 1;
                        text-decoration: none;
                        display: flex;
                        justify-content: center;
                        transition: transform 0.2s ease;
                        -webkit-tap-highlight-color: transparent;
                    }

                    .dock-item:active {
                        transform: scale(0.9);
                    }

                    .item-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 2px;
                    }

                    .icon-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 44px;
                        height: 32px;
                    }

                    .dock-icon {
                        color: rgba(255, 255, 255, 0.5);
                        transition: color 0.3s ease, stroke-width 0.3s ease;
                        z-index: 2;
                    }

                    :global([data-theme="light"]) .dock-icon {
                        color: rgba(0, 0, 0, 0.4);
                    }

                    .active .dock-icon {
                        color: #5B4DFF !important;
                    }

                    .dock-label {
                        font-size: 0.65rem;
                        font-weight: 800;
                        color: rgba(255, 255, 255, 0.5);
                        transition: color 0.3s ease;
                    }

                    :global([data-theme="light"]) .dock-label {
                        color: rgba(0, 0, 0, 0.5);
                    }

                    .active .dock-label {
                        color: #5B4DFF !important;
                    }

                    .active-pill {
                        position: absolute;
                        inset: 2px;
                        background: rgba(91, 77, 255, 0.15);
                        border-radius: 14px;
                        z-index: 1;
                    }

                    .active-dot {
                        position: absolute;
                        top: -10px;
                        width: 5px;
                        height: 5px;
                        background: #5B4DFF;
                        border-radius: 50%;
                        box-shadow: 0 0 12px #5B4DFF;
                        z-index: 3;
                    }
                }
            `}</style>
        </div>
    );
}
