'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { CONFERENCE_CONFIG as config } from '@/config/conference';

const WhatsAppWidget: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show widget after a small delay
        const timer = setTimeout(() => {
            setIsVisible(true);

            // Check if user has seen support notification before
            const hasSeenSupport = sessionStorage.getItem('hasSeenSupportIAISR');
            if (!hasSeenSupport) {
                setShowTooltip(true);
                sessionStorage.setItem('hasSeenSupportIAISR', 'true');

                // Auto-hide tooltip after 8 seconds
                setTimeout(() => setShowTooltip(false), 8000);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const whatsappLink = config.social.whatsapp;

    return (
        <div className={`whatsapp-widget-container ${isVisible ? 'visible' : ''}`}>
            {showTooltip && (
                <div className="whatsapp-tooltip">
                    <div className="tooltip-content">
                        <span className="tooltip-text">Support here! 👋</span>
                        <button className="tooltip-close" onClick={() => setShowTooltip(false)}>
                            <X size={12} />
                        </button>
                    </div>
                    <div className="tooltip-arrow"></div>
                </div>
            )}

            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-bubble"
                aria-label="Contact Support on WhatsApp"
            >
                <div className="bubble-inner">
                    <MessageCircle className="whatsapp-icon-svg" />
                    <span className="pulse-ring"></span>
                </div>
            </a>

            <style jsx>{`
                .whatsapp-widget-container {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    z-index: 9999;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    pointer-events: none;
                }

                .whatsapp-widget-container.visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: all;
                }

                .whatsapp-bubble {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background: #25D366;
                    border-radius: 50%;
                    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .whatsapp-bubble:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
                    background: #20BD59;
                }

                .bubble-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                :global(.whatsapp-icon-svg) {
                    color: white;
                    width: 32px;
                    height: 32px;
                    z-index: 2;
                }

                .pulse-ring {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: #25D366;
                    border-radius: 50%;
                    z-index: 1;
                    animation: wa-pulse 2s infinite;
                    opacity: 0;
                }

                @keyframes wa-pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }

                /* Tooltip Styles */
                .whatsapp-tooltip {
                    position: absolute;
                    bottom: 75px;
                    left: 0;
                    background: white;
                    color: #1a1a1a;
                    padding: 10px 16px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    white-space: nowrap;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    animation: tooltip-fade-in 0.4s ease-out forwards;
                    display: flex;
                    align-items: center;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                :global([data-theme="dark"]) .whatsapp-tooltip {
                    background: #1f2937;
                    color: white;
                    border-color: rgba(255,255,255,0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                }

                .tooltip-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .tooltip-close {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #666;
                    display: flex;
                    align-items: center;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .tooltip-close:hover {
                    opacity: 1;
                }

                .tooltip-arrow {
                    position: absolute;
                    bottom: -8px;
                    left: 20px;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid white;
                }

                :global([data-theme="dark"]) .tooltip-arrow {
                    border-top-color: #1f2937;
                }

                @keyframes tooltip-fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .whatsapp-widget-container {
                        bottom: 20px;
                        left: 20px;
                    }
                    
                    .whatsapp-bubble {
                        width: 50px;
                        height: 50px;
                    }
                    
                    :global(.whatsapp-icon-svg) {
                        width: 26px;
                        height: 26px;
                    }
                }
            `}</style>
        </div>
    );
};

export default WhatsAppWidget;
