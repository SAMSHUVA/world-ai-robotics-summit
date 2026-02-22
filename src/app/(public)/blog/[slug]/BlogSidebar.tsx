'use client';
import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Timer, Mail } from 'lucide-react';
import { CONFERENCE_CONFIG } from '@/config/conference';

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface BlogSidebarProps {
    title: string;
    url: string;
    tocItems?: TocItem[];
}

export default function BlogSidebar({ title, url, tocItems = [] }: BlogSidebarProps) {
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const targetDate = new Date(`${CONFERENCE_CONFIG.dates.start}T09:00:00`);
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60)
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateProgress = () => {
            const doc = document.documentElement;
            const scrollableHeight = doc.scrollHeight - doc.clientHeight;
            const ratio = scrollableHeight > 0 ? (doc.scrollTop / scrollableHeight) * 100 : 0;
            setScrollProgress(Math.max(0, Math.min(100, ratio)));
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            alert('Subscribed successfully!');
            setEmail('');
        } catch (error) {
            console.error('Subscription error', error);
        }
    };

    const encodedText = encodeURIComponent(`Check out this article: ${title}`);
    const encodedUrl = encodeURIComponent(url);
    const copyUrl = async () => {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        }
    };

    return (
        <>
            <div className="reading-progress-shell" aria-hidden="true">
                <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />
            </div>
            <aside className="sticky-share-rail" aria-label="Share this article">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn fb" aria-label="Share on Facebook"><Facebook size={16} /></a>
                <a href={`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn tw" aria-label="Share on X"><Twitter size={16} /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn ln" aria-label="Share on LinkedIn"><Linkedin size={16} /></a>
                <button type="button" className="social-btn" onClick={copyUrl} aria-label="Copy article link"><Share2 size={16} /></button>
            </aside>

            <aside className="post-sidebar">
                {tocItems.length >= 2 && (
                    <div className="sidebar-widget toc-widget">
                        <div className="widget-header">
                            <Share2 size={18} className="widget-icon" />
                            <h3>On this page</h3>
                        </div>
                        <nav className="toc-links" aria-label="Table of contents">
                            {tocItems.map((item) => (
                                <a key={item.id} href={`#${item.id}`} className={`toc-link toc-level-${item.level}`}>
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}

            <div className="sidebar-widget countdown-widget">
                <div className="widget-header">
                    <Timer size={18} className="widget-icon" />
                    <h3>Summit Countdown</h3>
                </div>
                <div className="countdown-timer">
                    <div className="time-block">
                        <span className="time-val">{timeLeft.days}</span>
                        <span className="time-label">Days</span>
                    </div>
                    <div className="time-block">
                        <span className="time-val">{timeLeft.hours}</span>
                        <span className="time-label">Hrs</span>
                    </div>
                    <div className="time-block">
                        <span className="time-val">{timeLeft.minutes}</span>
                        <span className="time-label">Min</span>
                    </div>
                </div>
                <p className="countdown-text">{CONFERENCE_CONFIG.dates.formatted} &bull; {CONFERENCE_CONFIG.location}</p>
                <a href="/register" className="widget-btn">Register Now</a>
            </div>

            <div className="sidebar-widget newsletter-widget">
                <div className="widget-header">
                    <Mail size={18} className="widget-icon" />
                    <h3>Stay Updated</h3>
                </div>
                <p>Get the latest AgTech insights.</p>
                <form onSubmit={handleSubscribe} className="sidebar-form">
                    <input
                        type="email"
                        placeholder="Business Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            <div className="sidebar-share">
                <p>Share this article</p>
                <div className="social-row">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn fb" aria-label="Share on Facebook"><Facebook size={18} /></a>
                    <a href={`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn tw" aria-label="Share on X"><Twitter size={18} /></a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="social-btn ln" aria-label="Share on LinkedIn"><Linkedin size={18} /></a>
                    <button
                        type="button"
                        className="social-btn"
                        onClick={copyUrl}
                        aria-label="Copy article link"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
                {copied && <p className="copy-feedback">Link copied</p>}
            </div>
            </aside>
        </>
    );
}
