"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeakerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    speaker: any;
}

export default function SpeakerDetailModal({ isOpen, onClose, speaker }: SpeakerDetailModalProps) {
    // Lock body scroll when modal is active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!speaker) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                    >
                        <button className="close-btn" onClick={onClose}>×</button>

                        <div className="modal-grid">
                            <div className="modal-sidebar">
                                <div className="modal-image-container">
                                    <div className="image-wrapper">
                                        {speaker.photoUrl ? (
                                            <img src={speaker.photoUrl} alt={speaker.name} className="modal-img" />
                                        ) : (
                                            <div className="placeholder-img">{speaker.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="social-links">
                                        {speaker.social?.linkedin && (
                                            <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                            </a>
                                        )}
                                        {speaker.social?.twitter && (
                                            <a href={speaker.social.twitter} target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                            </a>
                                        )}
                                        {speaker.social?.website && (
                                            <a href={speaker.social.website} target="_blank" rel="noopener noreferrer" className="social-icon website">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-stats">
                                    <div className="stat-item">
                                        <span className="stat-value">{speaker.sessionCount || 0}</span>
                                        <span className="stat-label">Sessions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-details">
                                <div className="modal-header">
                                    <h2>{speaker.name}</h2>
                                    <div className="speaker-badges">
                                        <span className="role-badge">{speaker.role}, {speaker.affiliation}</span>
                                        {speaker.isFeatured && <span className="featured-badge">Keynote Speaker</span>}
                                    </div>
                                </div>

                                <div className="bio-section">
                                    <h3>Biography</h3>
                                    <p className="bio-text">{speaker.bio || "Biography coming soon..."}</p>
                                </div>

                                {speaker.expertise && speaker.expertise.length > 0 && (
                                    <div className="expertise-section">
                                        <h3>Areas of Expertise</h3>
                                        <div className="expertise-chips">
                                            {speaker.expertise.map((skill: string, idx: number) => (
                                                <span key={idx} className="expertise-chip">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {speaker.sessionTopics && speaker.sessionTopics.length > 0 && (
                                    <div className="topics-section">
                                        <h3>Speaking At WARS '26</h3>
                                        <ul className="topics-list">
                                            {speaker.sessionTopics.map((topic: string, idx: number) => (
                                                <li key={idx}>
                                                    <span className="topic-dot"></span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .modal-content {
                    background: #13111C;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: auto; /* Allow scroll inside modal if content is tall */
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                
                .close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    font-size: 24px;
                    line-height: 1;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: rotate(90deg);
                }
                
                .modal-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 0;
                    min-height: 500px;
                }
                
                .modal-sidebar {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 40px;
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .modal-image-container {
                    margin-bottom: 30px;
                    text-align: center;
                }
                
                .image-wrapper {
                    width: 180px;
                    height: 180px;
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                }
                
                .modal-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .placeholder-img {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1A1825 0%, #0F0D15 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    color: rgba(255,255,255,0.2);
                    font-weight: 700;
                }
                
                .social-links {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }
                
                .social-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.3s;
                }
                
                .social-icon:hover {
                    background: white;
                    color: black;
                    transform: translateY(-3px);
                }
                
                .modal-stats {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 20px;
                    margin-top: auto;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #5B4DFF;
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .modal-details {
                    padding: 40px;
                }
                
                .modal-header {
                    margin-bottom: 30px;
                }
                
                h2 {
                    font-size: 2.5rem;
                    margin-bottom: 12px;
                    background: linear-gradient(to right, #fff, #a5a5a5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .speaker-badges {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    align-items: center;
                }
                
                .role-badge {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .featured-badge {
                    background: linear-gradient(90deg, #FF4D4D, #F9CB28);
                    color: black;
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 4px 12px;
                    border-radius: 20px;
                    text-transform: uppercase;
                }
                
                .bio-section, .expertise-section, .topics-section {
                    margin-bottom: 30px;
                }
                
                h3 {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 15px;
                }
                
                .bio-text {
                    font-size: 1.05rem;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .expertise-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .expertise-chip {
                    background: rgba(91, 77, 255, 0.1);
                    border: 1px solid rgba(91, 77, 255, 0.3);
                    color: #A39BFF;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }
                
                .topics-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .topics-list li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 10px;
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.9);
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                }
                
                .topic-dot {
                    width: 8px;
                    height: 8px;
                    background: #5B4DFF;
                    border-radius: 50%;
                }
                
                @media (max-width: 768px) {
                    .modal-grid {
                        grid-template-columns: 1fr;
                        display: block;
                    }
                    
                    .modal-sidebar {
                        padding: 30px;
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    
                    .modal-details {
                        padding: 30px;
                    }
                    
                    h2 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </AnimatePresence>
    );
}
