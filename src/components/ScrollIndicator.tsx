"use client";

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(true);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        // Check if user has seen this before
        const hasSeenIndicator = sessionStorage.getItem('hasSeenScrollIndicator');
        if (hasSeenIndicator) {
            setIsVisible(false);
            return;
        }

        // Hide on scroll
        const handleScroll = () => {
            if (window.scrollY > 100 && !hasScrolled) {
                setHasScrolled(true);
                setIsVisible(false);
                sessionStorage.setItem('hasSeenScrollIndicator', 'true');
            }
        };

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeenScrollIndicator', 'true');
        }, 5000);

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [hasScrolled]);

    const handleClick = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
        setIsVisible(false);
        sessionStorage.setItem('hasSeenScrollIndicator', 'true');
    };

    if (!isVisible) return null;

    return (
        <div
            className="scroll-indicator"
            onClick={handleClick}
            role="button"
            aria-label="Scroll down to explore more"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            <div className="scroll-text">Scroll to explore</div>
            <div className="scroll-icon-wrapper">
                <ChevronDown className="scroll-icon" size={24} strokeWidth={2.5} />
                <ChevronDown className="scroll-icon scroll-icon-2" size={24} strokeWidth={2.5} />
            </div>

            <style jsx>{`
                .scroll-indicator {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 50;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    animation: fadeIn 0.5s ease-out, float 2s ease-in-out infinite;
                    transition: opacity 0.3s ease;
                }

                .scroll-indicator:hover {
                    opacity: 0.8;
                }

                .scroll-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(31, 203, 143, 0.9);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                :global([data-theme="light"]) .scroll-text {
                    color: rgba(15, 159, 116, 0.9);
                    text-shadow: 0 2px 8px rgba(255, 255, 255, 0.5);
                }

                .scroll-icon-wrapper {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(31, 203, 143, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1.5px solid rgba(31, 203, 143, 0.4);
                    border-radius: 50%;
                    box-shadow: 0 4px 16px rgba(31, 203, 143, 0.2);
                }

                :global([data-theme="light"]) .scroll-icon-wrapper {
                    background: rgba(15, 159, 116, 0.1);
                    border-color: rgba(15, 159, 116, 0.3);
                    box-shadow: 0 4px 16px rgba(15, 159, 116, 0.15);
                }

                .scroll-icon {
                    color: #1FCB8F;
                    position: absolute;
                }

                :global([data-theme="light"]) .scroll-icon {
                    color: #0F9F74;
                }

                .scroll-icon-2 {
                    animation: bounce 1.5s ease-in-out infinite;
                    opacity: 0.5;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-10px);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateY(8px);
                        opacity: 0.2;
                    }
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .scroll-indicator {
                        bottom: 120px;
                    }

                    .scroll-text {
                        font-size: 0.7rem;
                    }

                    .scroll-icon-wrapper {
                        width: 36px;
                        height: 36px;
                    }

                    .scroll-icon {
                        width: 20px;
                        height: 20px;
                    }
                }

                /* Respect reduced motion preference */
                @media (prefers-reduced-motion: reduce) {
                    .scroll-indicator {
                        animation: fadeIn 0.5s ease-out;
                    }

                    .scroll-icon-2 {
                        animation: none;
                        opacity: 0.3;
                    }
                }
            `}</style>
        </div>
    );
}
