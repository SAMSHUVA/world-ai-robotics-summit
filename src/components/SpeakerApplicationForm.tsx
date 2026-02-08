"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpeakerApplicationForm({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        fullName: '',
        email: '',
        whatsappNumber: '',
        linkedin: '',
        website: '',

        // Step 2: Professional Background
        role: '',
        company: '',
        bio: '',
        expertise: [] as string[],

        // Step 3: Talk Proposal
        title: '',
        description: '',
        type: 'Keynote', // Keynote, Panel, Workshop
        duration: '30'
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = (e?: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('nextStep called, current step:', step);
        if (step < 3) {
            setStep(step + 1);
            console.log('Moving to step:', step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log('handleSubmit called, current step:', step);

        // Only submit if on step 3, otherwise just prevent default form submission
        if (step !== 3) {
            console.log('Blocking submission - not on step 3');
            return;
        }

        console.log('Proceeding with submission on step 3');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/speakers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.error || 'Failed to submit application'));
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to connect to the server. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="form-container success-view">
                <div className="success-icon-simple">✅</div>
                <div className="success-content">
                    <h2>Thank You!</h2>
                    <p>
                        Your speaker application for WARS '26 has been received. <br />
                        Our committee will review your proposal and contact you shortly via email.
                    </p>
                </div>
                <button className="btn-return" onClick={onClose}>Return to Summit</button>

                <style jsx>{`
                    .success-view {
                        text-align: center;
                        padding: 60px 40px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 24px;
                    }
                    .success-icon-simple {
                        width: 80px;
                        height: 80px;
                        background: rgba(0, 255, 136, 0.1);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        border: 1px solid rgba(0, 255, 136, 0.3);
                        box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
                    }
                    .success-content h2 {
                        font-size: 2rem;
                        color: white;
                        margin-bottom: 12px;
                    }
                    .success-content p {
                        font-size: 1.1rem;
                        line-height: 1.6;
                        color: rgba(255,255,255,0.7);
                    }
                    .btn-return {
                        background: rgba(255,255,255,0.05);
                        color: white;
                        border: 1px solid rgba(255,255,255,0.1);
                        padding: 12px 30px;
                        border-radius: 30px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .btn-return:hover {
                        background: rgba(255,255,255,0.1);
                        transform: translateY(-2px);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="form-container">
            {/* Progress Bar */}
            <div className="progress-bar">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="form-step"
                        >
                            <h3>Personal Information</h3>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Dr. Sarah Chen"
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="sarah@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleInputChange}
                                        placeholder="+65 8XXX-XXXX"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="linkedin.com/in/sarah"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Website / Portfolio</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="sarahchen.ai"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="form-step"
                        >
                            <h3>Professional Background</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Chief AI Officer"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company / Organization</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Neural Nexus"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Short Bio (150 words)</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about your background and achievements..."
                                    rows={4}
                                    required
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="form-step"
                        >
                            <h3>Talk Proposal</h3>
                            <div className="form-group">
                                <label>Session Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Catchy title for your talk"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Session Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange}>
                                        <option value="Keynote">Keynote Talk</option>
                                        <option value="Panel">Panel Discussion</option>
                                        <option value="Workshop">Technical Workshop</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <select name="duration" value={formData.duration} onChange={handleInputChange}>
                                        <option value="15">15 mins (Lightning)</option>
                                        <option value="30">30 mins (Standard)</option>
                                        <option value="45">45 mins (Extended)</option>
                                        <option value="60">60 mins (Workshop)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Session Abstract</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What will attendees learn from your session?"
                                    rows={5}
                                    required
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="form-actions">
                    {step > 1 && (
                        <button type="button" className="btn-secondary" onClick={prevStep}>Back</button>
                    )}
                    {step < 3 ? (
                        <button type="button" className="btn-primary" onClick={(e) => nextStep(e)}>Next Step</button>
                    ) : (
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
                .form-container {
                    background: #13111C;
                    color: white;
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                
                .success-view {
                    text-align: center;
                    padding: 60px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .success-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                    text-shadow: 0 0 30px rgba(91, 77, 255, 0.5);
                }
                
                .progress-bar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 40px;
                }
                
                .step-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: rgba(255,255,255,0.5);
                    border: 2px solid transparent;
                    transition: all 0.3s;
                }
                
                .step-dot.active {
                    background: #5B4DFF;
                    color: white;
                    border-color: #5B4DFF;
                    box-shadow: 0 0 15px rgba(91, 77, 255, 0.4);
                }
                
                .step-line {
                    width: 60px;
                    height: 2px;
                    background: rgba(255,255,255,0.1);
                    margin: 0 10px;
                    transition: all 0.3s;
                }
                
                .step-line.active {
                    background: #5B4DFF;
                }
                
                h3 {
                    font-size: 1.5rem;
                    margin-bottom: 24px;
                    color: white;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.7);
                }
                
                input, select, textarea {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 12px 16px;
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                
                input:focus, select:focus, textarea:focus {
                    outline: ::none;
                    border-color: #5B4DFF;
                    background: rgba(91, 77, 255, 0.05);
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                    margin-top: 30px;
                }
                
                .btn-primary, .btn-submit {
                    background: #5B4DFF;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .btn-secondary {
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .btn-primary:hover, .btn-submit:hover:not(:disabled) {
                    background: #6c5ffc;
                    box-shadow: 0 10px 20px rgba(91, 77, 255, 0.3);
                }
                
                @media (max-width: 600px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                    
                    .form-container {
                        padding: 24px;
                    }
                }

                /* Light Mode Overrides */
                :global([data-theme="light"]) .form-container {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    color: #1a1a1a;
                    border: 1px solid rgba(255,255,255,0.5);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
                }
                
                :global([data-theme="light"]) h3 { color: #1a1a1a; }
                :global([data-theme="light"]) label { color: #555; }
                
                :global([data-theme="light"]) input, 
                :global([data-theme="light"]) select, 
                :global([data-theme="light"]) textarea {
                    background: white;
                    border-color: rgba(0,0,0,0.1);
                    color: #1a1a1a;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
                }
                :global([data-theme="light"]) input:focus, 
                :global([data-theme="light"]) select:focus, 
                :global([data-theme="light"]) textarea:focus {
                    background: white;
                    border-color: var(--primary);
                }

                :global([data-theme="light"]) .step-dot {
                    background: #f0f0f0;
                    color: #888;
                }
                :global([data-theme="light"]) .step-dot.active {
                    background: var(--primary);
                    color: white;
                }
                :global([data-theme="light"]) .step-line { background: #e0e0e0; }
                :global([data-theme="light"]) .step-line.active { background: var(--primary); }

                :global([data-theme="light"]) .btn-secondary {
                    color: #555;
                    border-color: #ddd;
                }
                :global([data-theme="light"]) .btn-secondary:hover {
                    background: #f5f5f5;
                }

                :global([data-theme="light"]) .success-content h2 { color: #1a1a1a; }
                :global([data-theme="light"]) .success-content p { color: #555; }
                :global([data-theme="light"]) .btn-return {
                    background: rgba(0,0,0,0.05);
                    color: #1a1a1a;
                    border-color: rgba(0,0,0,0.1);
                }
                :global([data-theme="light"]) .btn-return:hover {
                    background: rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
