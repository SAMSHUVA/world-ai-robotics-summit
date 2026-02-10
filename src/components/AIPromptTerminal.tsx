'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface AIPromptTerminalProps {
    settings?: {
        aiTerminalVersion?: string;
        aiTerminalSubtitle?: string;
        aiTerminalLiveLabel?: string;
        aiActionSuggested?: string;
        aiResourcesLabel?: string;
        aiLearnMoreText?: string;
        resourcesTitle?: string;
        aiDownloadText?: string;
        shortName?: string;
    };
}

const AIPromptTerminal: React.FC<AIPromptTerminalProps> = ({ settings = {} }: AIPromptTerminalProps) => {
    const {
        aiTerminalVersion = "Summit Insight v4.5",
        aiTerminalSubtitle = "Future Vision",
        aiTerminalLiveLabel = "Live Intelligence",
        aiActionSuggested = "Action Suggested:",
        aiResourcesLabel = "Resources",
        aiLearnMoreText = "Learn More",
        resourcesTitle = "Premium Experience",
        aiDownloadText = "Download official",
        shortName = "WARS"
    } = settings;

    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showChips, setShowChips] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const COMMANDS = [
        { text: `Find AI research tracks for ${shortName}`, chip: aiResourcesLabel },
        { text: "How to submit research paper", chip: "Submission" },
        { text: "Check keynote speaker schedule", chip: "Keynote Lineup" },
        { text: "Explore robotics workshop details", chip: "Workshops" },
        { text: `${aiDownloadText} summit brochure`, chip: aiResourcesLabel }
    ];

    // Typing and Deleting logic
    useEffect(() => {
        const currentCommand = COMMANDS[currentCommandIndex].text;

        if (!isDeleting && charIndex < currentCommand.length) {
            // Typing
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + currentCommand[charIndex]);
                setCharIndex(prev => prev + 1);
            }, 30 + Math.random() * 20); // Faster, smoother typing
            return () => clearTimeout(timeout);
        } else if (!isDeleting && charIndex === currentCommand.length) {
            // Finished typing - pause
            setIsTyping(false);
            const chipTimeout = setTimeout(() => setShowChips(true), 500);
            const pauseTimeout = setTimeout(() => {
                setShowChips(false);
                setIsDeleting(true);
            }, 4000);
            return () => {
                clearTimeout(chipTimeout);
                clearTimeout(pauseTimeout);
            };
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev.slice(0, -1));
                setCharIndex(prev => prev - 1);
            }, 20); // Quick erase
            return () => clearTimeout(timeout);
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting - move to next
            setIsDeleting(false);
            setIsTyping(true);
            setCurrentCommandIndex((prev) => (prev + 1) % COMMANDS.length);
        }
    }, [charIndex, isDeleting, currentCommandIndex]);

    const activeChip = COMMANDS[currentCommandIndex].chip;

    return (
        <div className="prompt-terminal-container">
            <div className="prompt-terminal-header">
                <div className="terminal-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
                <div className="terminal-title">{aiTerminalVersion} // {aiTerminalSubtitle}</div>
                <div className="terminal-status">
                    <span className="status-pulse"></span>
                    {aiTerminalLiveLabel}
                </div>
            </div>

            <div className="prompt-terminal-body">
                <div className="prompt-input-line">
                    <span className="prompt-symbol">❯</span>
                    <span className="prompt-text">{displayText}</span>
                    <span className={`prompt-cursor ${isTyping ? 'typing' : 'blinking'}`}></span>
                </div>

                <div className={`prompt-chips-container ${showChips ? 'visible' : ''}`}>
                    <div className="prompt-chip highlight">{aiActionSuggested}</div>
                    <div className="prompt-chip active-action">{activeChip}</div>
                    <div className="prompt-chip secondary">{aiLearnMoreText}</div>
                </div>
            </div>

            <div className="prompt-terminal-footer">
                <div className="footer-shortcut">Type /help to see all commands</div>
                <div className="footer-badge">{resourcesTitle}</div>
            </div>

            <style jsx>{`
                .prompt-terminal-container {
                    background: rgba(13, 11, 30, 0.85);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), 0 0 100px rgba(91, 77, 255, 0.1);
                    max-width: 900px;
                    margin: 0 auto;
                    position: relative;
                }

                .prompt-terminal-header {
                    background: rgba(255, 255, 255, 0.04);
                    padding: 13px 18px;
                    display: grid;
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    align-items: center;
                    column-gap: 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .terminal-dots {
                    display: flex;
                    gap: 8px;
                    margin-right: 0;
                    flex-shrink: 0;
                }

                .dot { width: 10px; height: 10px; border-radius: 50%; }
                .dot.red { background: #ff5f56; }
                .dot.yellow { background: #ffbd2e; }
                .dot.green { background: #27c93f; }

                .terminal-title {
                    font-size: 0.68rem;
                    opacity: 0.72;
                    font-family: 'JetBrains Mono', monospace;
                    text-transform: uppercase;
                    letter-spacing: 1.4px;
                    line-height: 1.2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .terminal-status {
                    margin-left: 0;
                    padding-left: 12px;
                    border-left: 1px solid rgba(255, 255, 255, 0.14);
                    font-size: 0.72rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: #27c93f;
                    white-space: nowrap;
                    line-height: 1.2;
                    flex-shrink: 0;
                }

                .status-pulse {
                    width: 6px;
                    height: 6px;
                    background: #27c93f;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #27c93f;
                    animation: pulse 2s infinite;
                    flex-shrink: 0;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.6); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .prompt-terminal-body {
                    padding: 60px 40px;
                    min-height: 240px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .prompt-input-line {
                    font-size: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 500;
                }

                .prompt-symbol { color: var(--primary, #5B4DFF); }

                .prompt-cursor {
                    display: inline-block;
                    width: 14px;
                    height: 2.2rem;
                    background: var(--primary, #5B4DFF);
                    margin-left: 4px;
                }

                .prompt-cursor.blinking { animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }

                .prompt-chips-container {
                    margin-top: 40px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .prompt-chips-container.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .prompt-chip {
                    padding: 10px 22px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .prompt-chip:hover {
                    background: rgba(91, 77, 255, 0.15);
                    border-color: rgba(91, 77, 255, 0.4);
                    transform: translateY(-2px);
                }

                .prompt-chip.highlight {
                    border: none;
                    background: none;
                    opacity: 0.6;
                    padding-left: 0;
                    pointer-events: none;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .prompt-chip.active-action {
                    background: linear-gradient(135deg, rgba(91, 77, 255, 0.2) 0%, rgba(255, 59, 138, 0.1) 100%);
                    border-color: rgba(91, 77, 255, 0.6);
                    color: white;
                    font-weight: 700;
                    box-shadow: 0 4px 15px rgba(91, 77, 255, 0.2);
                    animation: slideIn 0.5s ease-out;
                }

                @keyframes slideIn {
                    from { transform: translateX(-10px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .prompt-chip.secondary { opacity: 0.4; border-style: dashed; }

                @media (max-width: 768px) {
                    .prompt-terminal-header {
                        padding: 10px 12px;
                        column-gap: 10px;
                    }
                    .prompt-input-line { font-size: 1.25rem; }
                    .prompt-terminal-body { padding: 30px 20px; min-height: 180px; }
                    .prompt-chip { padding: 8px 16px; font-size: 0.8rem; }
                    .prompt-cursor { height: 1.4rem; width: 10px; }
                    .terminal-title { font-size: 0.6rem; letter-spacing: 1px; }
                    .terminal-status { font-size: 0.65rem; padding-left: 8px; gap: 6px; }
                }

                .prompt-terminal-footer {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 12px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    font-size: 0.75rem;
                }

                .footer-shortcut {
                    font-family: 'JetBrains Mono', monospace;
                    opacity: 0.5;
                }

                .footer-badge {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    font-size: 0.65rem;
                    text-transform: uppercase;
                }

                :global([data-theme="light"]) .prompt-terminal-container {
                    background: rgba(246, 252, 249, 0.9) !important;
                    border: 1px solid rgba(15, 159, 116, 0.2) !important;
                    box-shadow: 0 24px 50px rgba(8, 38, 48, 0.12), 0 0 0 1px rgba(15, 159, 116, 0.05) !important;
                }

                :global([data-theme="light"]) .prompt-terminal-header {
                    background: rgba(16, 42, 51, 0.05) !important;
                    border-bottom: 1px solid rgba(16, 42, 51, 0.14) !important;
                }

                :global([data-theme="light"]) .terminal-title {
                    color: #325563 !important;
                    opacity: 0.96 !important;
                }

                :global([data-theme="light"]) .terminal-status {
                    color: #0F9F74 !important;
                    border-left-color: rgba(16, 42, 51, 0.2) !important;
                }

                :global([data-theme="light"]) .status-pulse {
                    background: #0F9F74 !important;
                    box-shadow: 0 0 10px rgba(15, 159, 116, 0.5) !important;
                }
            `}</style>
        </div>
    );
};

export default AIPromptTerminal;
