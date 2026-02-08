'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageLoaderProps {
    isLoading: boolean;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="page-loader-overlay"
                >
                    <div className="loader-content">
                        <div className="loader-spinner-container">
                            <div className="loader-spinner"></div>
                            <div className="loader-glow"></div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="loader-text"
                        >
                            Loading...
                        </motion.p>
                    </div>

                    <style jsx>{`
                        .page-loader-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(9, 8, 22, 0.95);
                            backdrop-filter: blur(20px);
                            -webkit-backdrop-filter: blur(20px);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .loader-content {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 24px;
                        }

                        .loader-spinner-container {
                            position: relative;
                            width: 80px;
                            height: 80px;
                        }

                        .loader-spinner {
                            width: 80px;
                            height: 80px;
                            border: 4px solid rgba(91, 77, 255, 0.1);
                            border-top: 4px solid var(--primary);
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            position: relative;
                            z-index: 2;
                        }

                        .loader-glow {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 100px;
                            height: 100px;
                            background: radial-gradient(circle, rgba(91, 77, 255, 0.3) 0%, transparent 70%);
                            animation: pulse 2s ease-in-out infinite;
                            z-index: 1;
                        }

                        .loader-text {
                            color: white;
                            font-size: 1.1rem;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                            opacity: 0.9;
                        }

                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        @keyframes pulse {
                            0%, 100% {
                                opacity: 0.5;
                                transform: translate(-50%, -50%) scale(1);
                            }
                            50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(1.1);
                            }
                        }

                        @media (prefers-color-scheme: light) {
                            .page-loader-overlay {
                                background: rgba(255, 255, 255, 0.95);
                            }
                            .loader-text {
                                color: #1a1a1a;
                            }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
