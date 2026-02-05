"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How can I apply to speak at WARS '26?",
        answer: "You can apply to speak by clicking the 'Apply to Speak' button at the bottom of this page. We accept proposals for Keynotes, Panel Discussions, and Technical Workshops. The application process involves a 3-step wizard where you'll share your abstract and professional background."
    },
    {
        question: "What topics are you looking for?",
        answer: "We are looking for talks on Generative AI, Robotics, Autonomous Systems, AI Ethics, Computer Vision, and the Future of Work. We value both technical deep-dives and strategic, high-level visionary talks."
    },
    {
        question: "Is there a deadline for speaker applications?",
        answer: "Yes, the Call for Papers closes on August 31, 2026. We review applications on a rolling basis, so we encourage early submission to secure your spot."
    },
    {
        question: "Do you cover travel expenses for speakers?",
        answer: "For Keynote speakers and select featured session leads, WARS '26 provides full travel and accommodation support. For other tracks, we offer a discounted speaker pass and can assist with visa invitation letters."
    },
    {
        question: "Can I co-present a session?",
        answer: "Yes, we welcome co-presentations, especially for case studies involving a vendor and a client. Please indicate both speakers in your application proposal."
    }
];

export default function SpeakersFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="faq-section">
            <div className="container">
                <h2 className="faq-title">Frequently Asked Questions</h2>
                <div className="faq-grid">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="faq-item" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className={`arrow ${openIndex === idx ? 'open' : ''}`}>▼</span>
                            </div>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="faq-answer-wrapper"
                                    >
                                        <p className="faq-answer">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .faq-section {
                    padding: 80px 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .faq-title {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 50px;
                    background: linear-gradient(to right, #fff, #a5a5a5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .faq-item {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 20px;
                    cursor: pointer;
                }
                
                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0;
                }
                
                .faq-question h3 {
                    font-size: 1.2rem;
                    font-weight: 500;
                    margin: 0;
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .arrow {
                    color: #5B4DFF;
                    transition: transform 0.3s;
                    font-size: 0.8rem;
                }
                
                .arrow.open {
                    transform: rotate(180deg);
                }
                
                .faq-answer-wrapper {
                    overflow: hidden;
                }
                
                .faq-answer {
                    padding-bottom: 24px;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.6;
                    font-size: 1rem;
                }
                
                @media (max-width: 600px) {
                    .faq-title {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </section>
    );
}
