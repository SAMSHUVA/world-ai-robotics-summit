"use client";

import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            const threshold = window.innerWidth < 768 ? 40 : 100; // More sensitive on mobile
            if (window.scrollY > threshold) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
        });
    };

    if (!mounted) return null;

    return (
        <div
            className={`scroll-indicator-v6 ${isVisible ? 'visible' : 'hidden'} ${isMobile ? 'is-mobile' : 'is-desktop'}`}
            onClick={handleClick}
        >
            {!isMobile ? (
                <div className="desktop-content">
                    <div className="mouse-icon">
                        <div className="scroll-piston" />
                    </div>
                    <span className="scroll-label">Explore</span>
                </div>
            ) : (
                <div className="mobile-capsule">
                    <span className="mobile-text">Scroll down to explore</span>
                    <span className="mobile-arrow">↓</span>
                </div>
            )}

            <style jsx>{`
                .scroll-indicator-v6 {
                    position: fixed;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 2147483647;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    pointer-events: auto;
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .scroll-indicator-v6.is-desktop {
                    bottom: 100px;
                }

                .scroll-indicator-v6.is-mobile {
                    bottom: 25px; /* Deep bottom anchor to avoid covering content */
                }

                .scroll-indicator-v6.hidden {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                    pointer-events: none;
                }

                .scroll-indicator-v6.visible {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }

                /* Desktop Styles */
                .desktop-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .mouse-icon {
                    width: 28px;
                    height: 46px;
                    border: 2px solid #1FCB8F;
                    border-radius: 16px;
                    display: flex;
                    justify-content: center;
                    padding-top: 8px;
                    background: rgba(13, 11, 30, 0.4);
                    backdrop-filter: blur(8px);
                    box-shadow: 0 0 20px rgba(31, 203, 143, 0.2);
                }

                .scroll-piston {
                    width: 5px;
                    height: 9px;
                    background: #1FCB8F;
                    border-radius: 2.5px;
                    box-shadow: 0 0 10px #1FCB8F;
                    animation: pistonMove 1.5s infinite ease-in-out;
                }

                @keyframes pistonMove {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(12px); opacity: 0.3; }
                }

                .scroll-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #1FCB8F;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
                }

                /* Mobile Capsule Styles - More Discreet */
                .mobile-capsule {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(13, 11, 30, 0.7); /* More translucent */
                    padding: 8px 18px;
                    border-radius: 30px;
                    border: 1px solid rgba(31, 203, 143, 0.3);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }

                .mobile-text {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #1FCB8F;
                    letter-spacing: 0.02em;
                }

                .mobile-arrow {
                    color: #1FCB8F;
                    font-size: 1rem;
                    line-height: 1;
                    animation: arrowSubtle 1.5s infinite ease-in-out;
                }

                @keyframes arrowSubtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(3px); }
                }

                /* Theme Overrides */
                :global([data-theme="light"]) .mouse-icon {
                    background: rgba(255, 255, 255, 0.6);
                    border-color: #0F9F74;
                }

                :global([data-theme="light"]) .scroll-piston,
                :global([data-theme="light"]) .scroll-label,
                :global([data-theme="light"]) .mobile-text,
                :global([data-theme="light"]) .mobile-arrow {
                    color: #0F9F74;
                }
                
                :global([data-theme="light"]) .scroll-piston {
                    background: #0F9F74;
                }

                :global([data-theme="light"]) .mobile-capsule {
                    background: rgba(255, 255, 255, 0.85);
                    border-color: rgba(15, 159, 116, 0.3);
                }
            `}</style>
        </div>
    );
}
