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
    const [loadingPath, setLoadingPath] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setLoadingPath(null);
    }, [pathname]);

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

                            const isLoading = loadingPath === item.path;

                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`dock-item ${isActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                                    onClick={() => {
                                        if (pathname !== item.path) {
                                            setLoadingPath(item.path);
                                        }
                                    }}
                                >
                                    <div className="item-content">
                                        <div className="icon-wrapper">
                                            {isActive && <div className="active-pill" />}
                                            {isLoading && !isActive && <div className="loading-pill" />}
                                            <Icon
                                                size={20}
                                                className={`dock-icon ${isLoading ? 'animate-pulse' : ''}`}
                                                strokeWidth={isActive || isLoading ? 2.5 : 2}
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
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 99999;
                        padding: 0;
                        background: transparent;
                        pointer-events: none;
                    }

                    .mobile-dock {
                        width: 100%;
                        max-width: 100%;
                        margin: 0;
                        background: rgba(3, 11, 26, 0.98);
                        backdrop-filter: blur(20px);
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 0;
                        pointer-events: auto;
                        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
                        animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        padding-bottom: env(safe-area-inset-bottom);
                    }

                    @keyframes slide-up {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }

                    :global([data-theme="light"]) .mobile-dock {
                        background: rgba(255, 255, 255, 0.98);
                        border-top: 1px solid rgba(0, 0, 0, 0.08);
                        box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.05);
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
                        cursor: pointer;
                    }

                    .dock-item:active {
                        transform: scale(0.9);
                    }
                    
                    /* Loading State */
                    .animate-pulse {
                        animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        color: var(--primary, #1FCB8F) !important;
                        opacity: 1 !important;
                    }
                    
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    .loading-pill {
                        position: absolute;
                        inset: 4px;
                        background: rgba(31, 203, 143, 0.1);
                        border-radius: 12px;
                        z-index: 1;
                        animation: pulse-bg 1s infinite;
                    }
                    
                    @keyframes pulse-bg {
                        0%, 100% { opacity: 0.8; }
                        50% { opacity: 0.3; }
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
                        color: var(--primary, #1FCB8F) !important;
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
                        color: var(--primary, #1FCB8F) !important;
                    }

                    .active-pill {
                        position: absolute;
                        inset: 2px;
                        background: rgba(31, 203, 143, 0.15);
                        border-radius: 14px;
                        z-index: 1;
                    }

                    .active-dot {
                        position: absolute;
                        top: -10px;
                        width: 5px;
                        height: 5px;
                        background: var(--primary, #1FCB8F);
                        border-radius: 50%;
                        box-shadow: 0 0 12px var(--primary, #1FCB8F);
                        z-index: 3;
                    }
                }
            `}</style>
        </div>
    );
}
