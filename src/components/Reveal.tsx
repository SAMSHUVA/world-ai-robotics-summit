"use client";

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'reveal' | 'reveal-fade' | 'reveal-left';
    delay?: number; // base delay in ms
    stagger?: number; // additional delay based on index
    index?: number;
    threshold?: number;
}

export default function Reveal({
    children,
    className = '',
    animation = 'reveal',
    delay = 0,
    stagger = 0,
    index = 0,
    threshold = 0.1
}: RevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Fallback for browsers that don't support window.matchMedia
        if (typeof window.matchMedia === 'function') {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                setIsVisible(true);
                return;
            }
        }

        // Fallback for browsers that don't support IntersectionObserver
        if (typeof window.IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current && observer) {
                observer.unobserve(ref.current);
                observer.disconnect();
            }
        };
    }, [threshold]);

    const totalDelay = (delay + (stagger * index)) / 1000;

    return (
        <div
            ref={ref}
            className={`${animation} ${isVisible ? 'visible' : ''} ${className}`}
            style={{ '--delay': `${totalDelay}s`, willChange: 'opacity, transform' } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
