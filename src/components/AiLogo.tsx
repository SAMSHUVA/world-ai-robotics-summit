import React from 'react';

export default function AiLogo({ className }: { className?: string }) {
    return (
        <div className={`ai-logo-wrapper ${className || ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="ai-logo-svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5B4DFF" />
                        <stop offset="100%" stopColor="#FF3B8A" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Central Core */}
                <circle cx="50" cy="50" r="15" fill="url(#logoGradient)" filter="url(#glow)">
                    <animate attributeName="r" values="15;18;15" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Rotating Rings */}
                <g>
                    <circle cx="50" cy="50" r="28" stroke="url(#logoGradient)" strokeWidth="2" strokeDasharray="10 5" opacity="0.8">
                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
                    </circle>
                </g>
                <g>
                    <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
                        <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Orbital Nodes */}
                <circle cx="50" cy="12" r="4" fill="#FFFFFF" filter="url(#glow)">
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
                </circle>
            </svg>

            {/* Desktop Text - Visible only on Desktop if needed, or we keep standard logo text */}
            <div className="logo-text-desktop" style={{ display: 'none' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>IAISR</span>
            </div>
        </div>
    );
}
