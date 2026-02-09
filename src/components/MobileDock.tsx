"use client";

import React from 'react';

export default function MobileDock() {
    return (
        <div className="floating-dock mobile-only">
            <div className="dock-container">
                <a href="/" className="dock-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </a>
                <a href="/call-for-papers" className="dock-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Submissions</span>
                </a>
                <a href="/about" className="dock-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>About</span>
                </a>
                <a href="/contact" className="dock-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span>Contact</span>
                </a>
            </div>

            <style jsx>{`
                .mobile-only {
                    display: none;
                }

                @media (max-width: 992px) {
                    .mobile-only {
                        display: block;
                    }

                    .floating-dock {
                        position: fixed;
                        bottom: 0px;
                        left: 0;
                        right: 0;
                        z-index: 99999;
                        padding: 12px 20px 24px;
                        background: linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%);
                        pointer-events: none;
                    }

                    :global([data-theme="dark"]) .floating-dock {
                        background: linear-gradient(to top, rgba(13, 11, 30, 0.95) 0%, transparent 100%);
                    }

                    .dock-container {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(20px) saturate(180%);
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 20px;
                        display: flex;
                        justify-content: space-around;
                        padding: 10px;
                        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
                        pointer-events: auto;
                        margin: 0 auto;
                        width: 100%;
                        max-width: 440px;
                    }

                    :global([data-theme="dark"]) .dock-container {
                        background: rgba(13, 11, 30, 0.9);
                        border-color: rgba(255, 255, 255, 0.1);
                        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
                    }

                    .dock-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        color: var(--text-secondary);
                        text-decoration: none;
                        transition: all 0.3s;
                        flex: 1;
                    }

                    .dock-item svg {
                        opacity: 0.7;
                    }

                    .dock-item span {
                        font-size: 0.7rem;
                        font-weight: 700;
                    }

                    .dock-item:hover {
                        color: #5B4DFF;
                    }

                    .dock-item:hover svg {
                        opacity: 1;
                        transform: translateY(-2px);
                    }
                }
            `}</style>
        </div>
    );
}
