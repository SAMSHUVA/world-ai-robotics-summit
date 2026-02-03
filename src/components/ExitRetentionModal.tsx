'use client';

import { useState, useEffect } from 'react';
import './ExitRetentionModal.css';

interface ExitRetentionModalProps {
    onClose: () => void;
    onCouponAccepted: (couponCode: string) => void;
    currentTicketType?: string;
}

export default function ExitRetentionModal({ onClose, onCouponAccepted, currentTicketType }: ExitRetentionModalProps) {
    const [reason, setReason] = useState('');
    const [email, setEmail] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [showCouponOffer, setShowCouponOffer] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReasonChange = (selectedReason: string) => {
        setReason(selectedReason);
        // Show coupon offer if price is the issue
        if (selectedReason === 'PRICE_HIGH') {
            setShowCouponOffer(true);
        } else {
            setShowCouponOffer(false);
        }
    };

    const handleAcceptCoupon = async () => {
        setIsSubmitting(true);

        // Save feedback with coupon acceptance
        await saveFeedback(true);

        // Apply coupon and return to registration
        onCouponAccepted('SAVE10');
        onClose();
    };

    const saveFeedback = async (acceptedCoupon: boolean = false) => {
        try {
            await fetch('/api/exit-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email || null,
                    ticketType: currentTicketType || null,
                    abandonReason: reason,
                    additionalNotes: additionalNotes || null,
                    wasOfferedCoupon: reason === 'PRICE_HIGH',
                    acceptedCoupon,
                }),
            });
        } catch (error) {
            console.error('Failed to save exit feedback:', error);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!reason) {
            alert('Please select a reason');
            return;
        }

        setIsSubmitting(true);
        await saveFeedback(false);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="exit-modal-overlay" onClick={onClose}>
            <div className="exit-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="exit-modal-close" onClick={onClose}>×</button>

                <div className="exit-modal-header">
                    <h2>⚠️ Wait! Before you go...</h2>
                    <p>Help us understand why you're leaving</p>
                </div>

                <div className="exit-modal-body">
                    <label htmlFor="reason-select">What's stopping you from registering?</label>
                    <select
                        id="reason-select"
                        value={reason}
                        onChange={(e) => handleReasonChange(e.target.value)}
                        className="exit-select"
                    >
                        <option value="">Select a reason</option>
                        <option value="PRICE_HIGH">Price is too high</option>
                        <option value="NOT_READY">Not ready to register yet</option>
                        <option value="NEED_APPROVAL">Need manager/supervisor approval</option>
                        <option value="TECHNICAL_ISSUE">Encountered technical issues</option>
                        <option value="OTHER">Other reason</option>
                    </select>

                    {showCouponOffer && (
                        <div className="coupon-offer-box">
                            <div className="coupon-offer-icon">🎉</div>
                            <h3>Special Offer Just For You!</h3>
                            <p>We understand budget constraints. Here's an exclusive discount:</p>
                            <div className="coupon-code-display">
                                <span className="coupon-label">Use code:</span>
                                <span className="coupon-code">SAVE10</span>
                            </div>
                            <p className="coupon-discount">Get <strong>10% OFF</strong> your registration!</p>
                            <button
                                className="btn-accept-coupon"
                                onClick={handleAcceptCoupon}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Applying...' : 'Apply Discount & Continue'}
                            </button>
                        </div>
                    )}

                    {reason === 'NOT_READY' && (
                        <div className="reminder-box">
                            <p>📧 We'll send you a reminder email:</p>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="exit-input"
                            />
                        </div>
                    )}

                    <label htmlFor="additional-notes">Additional comments (optional):</label>
                    <textarea
                        id="additional-notes"
                        placeholder="Tell us more about your concerns..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="exit-textarea"
                        rows={3}
                    />
                </div>

                <div className="exit-modal-footer">
                    <button
                        className="btn-submit-feedback"
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting || !reason}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button className="btn-close-modal" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
