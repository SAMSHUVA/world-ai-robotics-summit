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
        // Respect Reduced Motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
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
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const totalDelay = (delay + (stagger * index)) / 1000;

    return (
        <div
            ref={ref}
            className={`${animation} ${isVisible ? 'visible' : ''} ${className}`}
            style={{ '--delay': `${totalDelay}s` } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
