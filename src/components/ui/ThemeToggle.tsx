'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const themeContext = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted and context is available
    if (!mounted || !themeContext) {
        return null;
    }

    const { theme, toggleTheme } = themeContext;

    return (
        <>
            <div className="theme-toggle-wrapper">
                <div className="theme-instruction">
                    <span>Switch Mode</span>
                    <div className="arrow-down"></div>
                </div>
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label="Toggle theme"
                >
                    <div className="toggle-icon">
                        {theme === 'dark' ? (
                            <Sun size={20} className="icon sun" />
                        ) : (
                            <Moon size={20} className="icon moon" />
                        )}
                    </div>
                </button>
            </div>

            <style jsx>{`
                .theme-toggle-wrapper {
                    position: fixed;
                    bottom: 30px;
                    left: 30px;
                    z-index: 2147483647; /* Max Safe Integer to ensure top visibility */
                    display: flex !important;
                    flex-direction: column;
                    align-items: center;
                }

                .theme-toggle {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    // Reset fixed positioning since wrapper handles it
                    position: relative;
                    bottom: auto;
                    right: auto;
                }

                .theme-instruction {
                    position: absolute;
                    bottom: 70px;
                    background: var(--primary);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateY(10px);
                    animation: float-in 1s ease-out 1s forwards, fade-out 1s ease-in 6s forwards;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .arrow-down {
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0; 
                    height: 0; 
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid var(--primary);
                }

                @keyframes float-in {
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fade-out {
                    to { opacity: 0; visibility: hidden; }
                }

                .theme-toggle:hover {
                    transform: scale(1.1);
                    background: rgba(91, 77, 255, 0.2);
                    border-color: rgba(91, 77, 255, 0.4);
                    box-shadow: 0 12px 40px rgba(91, 77, 255, 0.3);
                }

                .toggle-icon {
                    position: relative;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon {
                    position: absolute;
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .icon.sun {
                    color: #fbbf24;
                    animation: rotateIn 0.4s ease-out;
                }

                .icon.moon {
                    color: #60a5fa;
                    animation: rotateIn 0.4s ease-out;
                }

                @keyframes rotateIn {
                    from {
                        transform: rotate(-180deg) scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: rotate(0deg) scale(1);
                        opacity: 1;
                    }
                }

                /* Light mode specific styles */
                :global([data-theme="light"]) .theme-toggle {
                    background: rgba(0, 0, 0, 0.05);
                    border-color: rgba(0, 0, 0, 0.1);
                }

                :global([data-theme="light"]) .theme-toggle:hover {
                    background: rgba(91, 77, 255, 0.1);
                    border-color: rgba(91, 77, 255, 0.3);
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .theme-toggle-wrapper {
                        bottom: 90px !important; /* Moved up to avoid bottom browser bars */
                        left: 20px !important;
                        position: fixed !important;
                        display: flex !important;
                        z-index: 999999 !important;
                        /* Force hardware acceleration */
                        transform: translateZ(0);
                        -webkit-transform: translateZ(0);
                        backface-visibility: hidden;
                    }
                    
                    .theme-toggle {
                        width: 48px;
                        height: 48px;
                        opacity: 1 !important;
                        visibility: visible !important;
                    }

                    .theme-instruction {
                        display: block !important; /* Show instruction on mobile too */
                        bottom: 60px;
                        font-size: 0.7rem;
                        padding: 4px 10px;
                        white-space: nowrap;
                    }
                }
            `}</style>
        </>
    );
}
