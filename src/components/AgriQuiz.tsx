'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, RefreshCw, CheckCircle2, XCircle, Sparkles, Gift, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "How much water can Vertical Farming save compared to traditional open-field agriculture?",
        options: ["30-40%", "50-60%", "70-80%", "Up to 95%"],
        correct: 3,
        explanation: "Vertical farming uses advanced hydroponic or aeroponic systems to recycle water, saving up to 95% compared to traditional farming."
    },
    {
        id: 2,
        question: "Which technology allows autonomous tractors to detect obstacles and navigate with centimeter-level precision?",
        options: ["Bluetooth", "LiDAR & GPS", "Ultrasonic sensors only", "Radio waves"],
        correct: 1,
        explanation: "LiDAR (Light Detection and Ranging) combined with RTK-GPS provides the high-precision mapping required for autonomous field navigation."
    },
    {
        id: 3,
        question: "What is the primary role of 'Computer Vision' in modern agriculture?",
        options: ["Weather forecasting", "Pest and disease identification", "Streaming movies to tractors", "Controlling tractor speed"],
        correct: 1,
        explanation: "Computer Vision uses AI to analyze images from drones or robots to identify pests, weeds, and diseases in real-time."
    }
];

const AgriQuiz = () => {
    const [step, setStep] = useState<'start' | 'quiz' | 'result'>('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === QUESTIONS[currentQuestion].correct) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setStep('result');
        }
    };

    const restartQuiz = () => {
        setStep('start');
        setCurrentQuestion(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    return (
        <section className="quiz-section" id="knowledge-harvest">
            <div className="quiz-container">
                <div className="quiz-bg-sparkle">
                    <Sparkles size={120} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="quiz-content text-center"
                        >
                            <div className="quiz-icon-wrapper">
                                <Trophy size={40} />
                            </div>
                            <h2 className="quiz-title">Knowledge <span className="highlight">Harvest</span></h2>
                            <p className="quiz-subtitle">
                                Test your AgTech expertise! Complete the quiz with a perfect score to unlock an exclusive reward.
                            </p>
                            <button onClick={() => setStep('quiz')} className="btn-primary">
                                Start Quiz <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}

                    {step === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="quiz-content"
                        >
                            <div className="quiz-progress-header">
                                <span className="quiz-step-label">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                                <div className="quiz-progress-bar">
                                    <motion.div
                                        className="quiz-progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <h3 className="quiz-question">
                                {QUESTIONS[currentQuestion].question}
                            </h3>

                            <div className="quiz-options">
                                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleAnswer(idx)}
                                        className={`quiz-option ${isAnswered
                                            ? idx === QUESTIONS[currentQuestion].correct
                                                ? 'correct'
                                                : idx === selectedOption
                                                    ? 'incorrect'
                                                    : 'dimmed'
                                            : ''
                                            }`}
                                    >
                                        <span>{option}</span>
                                        {isAnswered && idx === QUESTIONS[currentQuestion].correct && <CheckCircle2 size={18} />}
                                        {isAnswered && idx === selectedOption && idx !== QUESTIONS[currentQuestion].correct && <XCircle size={18} />}
                                    </button>
                                ))}
                            </div>

                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="quiz-feedback"
                                >
                                    <div className="quiz-explanation">
                                        <strong>Context:</strong> {QUESTIONS[currentQuestion].explanation}
                                    </div>
                                    <button onClick={nextQuestion} className="btn-primary w-full">
                                        {currentQuestion === QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="quiz-content text-center"
                        >
                            {score === QUESTIONS.length ? (
                                <>
                                    <div className="quiz-icon-wrapper gift">
                                        <Gift size={40} />
                                    </div>
                                    <h2 className="quiz-title">Harvest <span className="highlight">Successful!</span></h2>
                                    <p className="quiz-subtitle">Perfect score! You truly are an AgTech visionary. Here is your reward:</p>

                                    <div className="reward-card">
                                        <span className="reward-label">Your Promo Code</span>
                                        <span className="reward-code">HARVEST20</span>
                                        <p className="reward-note">20% off registrations for delegates & exhibitors.</p>
                                    </div>
                                    <div className="quiz-share">
                                        <p>Share your achievement</p>
                                        <div className="social-row quiz-social">
                                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://iaisr.org/blog" target="_blank" rel="noopener noreferrer" className="social-btn fb"><Facebook size={18} /></a>
                                            <a href="https://twitter.com/intent/tweet?text=I%20just%20scored%20100%%20on%20the%20Knowledge%20Harvest%20AgTech%20Quiz!&url=https://iaisr.org/blog" target="_blank" rel="noopener noreferrer" className="social-btn tw"><Twitter size={18} /></a>
                                            <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://iaisr.org/blog&title=Knowledge%20Harvest%20AgTech%20Quiz%20Perfect%20Score" target="_blank" rel="noopener noreferrer" className="social-btn ln"><Linkedin size={18} /></a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="quiz-icon-wrapper learned">
                                        <RefreshCw size={40} />
                                    </div>
                                    <h2 className="quiz-title">Keep <span className="highlight-orange">Learning</span></h2>
                                    <p className="quiz-subtitle">You got {score} out of {QUESTIONS.length} correct. Knowledge is a journey, try again to unlock your reward!</p>
                                    <button onClick={restartQuiz} className="btn-secondary">
                                        Try Again <RefreshCw size={18} />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .quiz-section {
                    padding: 3rem 1rem;
                }
                .quiz-container {
                    max-width: 42rem;
                    margin: 0 auto;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                }
                .quiz-bg-sparkle {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 1rem;
                    opacity: 0.1;
                    pointer-events: none;
                    color: #1fcb8f;
                }
                .quiz-content {
                    position: relative;
                    z-index: 1;
                }
                .text-center { text-align: center; }
                .quiz-icon-wrapper {
                    width: 5rem;
                    height: 5rem;
                    background: var(--bg-elevated);
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    color: var(--primary);
                    border: 1px solid var(--border-color);
                }
                .quiz-icon-wrapper.gift { border-radius: 9999px; }
                .quiz-icon-wrapper.learned { background: var(--bg-elevated); color: #f97316; border-radius: 9999px; }
                
                .quiz-title {
                    font-size: 1.875rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }
                .highlight { color: var(--primary); }
                .highlight-orange { color: #f97316; }
                
                .quiz-subtitle {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }
                
                .btn-primary {
                    background-color: var(--primary);
                    color: black;
                    font-weight: 700;
                    padding: 1rem 2rem;
                    border-radius: 0.75rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0 auto;
                    transition: transform 0.2s;
                }
                .btn-primary:hover { transform: scale(1.05); background-color: var(--primary-hover); }
                .btn-primary.w-full { width: 100%; justify-content: center; }
                
                .btn-secondary {
                    background-color: var(--bg-elevated);
                    color: var(--text-primary);
                    font-weight: 700;
                    padding: 1rem 2rem;
                    border-radius: 0.75rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0 auto;
                    transition: background 0.2s;
                }
                .btn-secondary:hover { background-color: rgba(255, 255, 255, 0.2); }

                .quiz-progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .quiz-step-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .quiz-progress-bar {
                    height: 0.375rem;
                    width: 8rem;
                    background: var(--bg-elevated);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .quiz-progress-fill {
                    height: 100%;
                    background: var(--primary);
                }
                
                .quiz-question {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    color: var(--text-primary);
                    line-height: 1.6;
                }
                
                .quiz-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .quiz-option {
                    width: 100%;
                    text-align: left;
                    padding: 1rem;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    border-radius: 0.75rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s;
                }
                .quiz-option:not(:disabled):hover { border-color: rgba(31, 203, 143, 0.5); }
                .quiz-option.correct { background: var(--bg-tertiary); border-color: var(--primary); color: var(--primary); }
                .quiz-option.incorrect { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; }
                .quiz-option.dimmed { background: transparent; border-color: transparent; color: var(--text-muted); opacity: 0.5; }
                
                .quiz-feedback { margin-bottom: 2rem; }
                .quiz-explanation {
                    padding: 1rem;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    font-style: italic;
                    margin-bottom: 1.5rem;
                }
                
                .reward-card {
                    background: rgba(31, 203, 143, 0.08);
                    border: 2px dashed rgba(31, 203, 143, 0.3);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                }
                .reward-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #1fcb8f;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }
                .reward-code {
                    display: block;
                    font-size: 2.25rem;
                    font-weight: 900;
                    color: var(--text-primary);
                    letter-spacing: 0.1em;
                }
                .reward-note {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 1rem;
                }
                
                .quiz-share {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--border-color);
                }
                .quiz-share p {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                }
                .quiz-social {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }
                .social-btn {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .social-btn:hover { background: var(--primary); color: black; border-color: transparent; }
                .social-btn.fb:hover { background: #1877F2; color: white; }
                .social-btn.tw:hover { background: #1DA1F2; color: white; }
                .social-btn.ln:hover { background: #0A66C2; color: white; }
                
                @media (max-width: 768px) {
                    .quiz-container { padding: 1.25rem; }
                    .quiz-title { font-size: 1.3rem; }
                    .quiz-question { font-size: 1.1rem; }
                    .reward-code { font-size: 1.75rem; }
                    .quiz-subtitle { font-size: 0.82rem; }
                    .quiz-section { padding: 1.25rem 1rem; }
                }
            `}</style>
        </section>
    );
};

export default AgriQuiz;
