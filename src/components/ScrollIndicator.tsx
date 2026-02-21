"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
    const [hasMounted, setHasMounted] = useState(false);
    const { scrollY } = useScroll();

    // Fade out between 0 and 200px scroll
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    // Slight downward movement as you scroll to feel "sticky" but fading
    const y = useTransform(scrollY, [0, 200], [0, 50]);
    // Scale down slightly as it fades
    const scale = useTransform(scrollY, [0, 200], [1, 0.8]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    const handleClick = () => {
        window.scrollTo({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
        });
    };

    return (
        <motion.div
            style={{ opacity, y, scale, x: '-50%' }}
            className="scroll-indicator"
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
        >
            <div className="mouse-container">
                <div className="mouse-body">
                    <motion.div
                        className="mouse-wheel"
                        animate={{
                            y: [0, 10, 0],
                            opacity: [1, 0.2, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>
            <div className="scroll-text">Scroll to explore</div>

            <style jsx>{`
                .scroll-indicator {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    z-index: 50;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    pointer-events: auto;
                }

                .mouse-container {
                    width: 26px;
                    height: 42px;
                    padding: 4px;
                    border: 2px solid var(--primary);
                    border-radius: 14px;
                    display: flex;
                    justify-content: center;
                    background: rgba(var(--bg-rgb, 13, 11, 30), 0.2);
                    backdrop-filter: blur(4px);
                    box-shadow: 0 0 15px rgba(31, 203, 143, 0.2);
                }

                :global([data-theme="light"]) .mouse-container {
                    border-color: rgba(31, 203, 143, 0.6);
                    background: rgba(255, 255, 255, 0.4);
                }

                .mouse-body {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .mouse-wheel {
                    width: 4px;
                    height: 8px;
                    background: var(--primary);
                    border-radius: 2px;
                    position: absolute;
                    left: 50%;
                    margin-left: -2px;
                    box-shadow: 0 0 8px var(--primary);
                }

                .scroll-text {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    opacity: 0.8;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }

                :global([data-theme="light"]) .scroll-text {
                    color: var(--text-primary);
                    opacity: 0.7;
                    text-shadow: none;
                }

                /* Mobile tweaks */
                @media (max-width: 768px) {
                    .scroll-indicator {
                        bottom: 30px;
                    }
                    .mouse-container {
                        width: 22px;
                        height: 36px;
                    }
                }
            `}</style>
        </motion.div>
    );
}
