'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StatCounterProps {
    end: number;
    suffix?: string;
    duration?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const totalFrames = Math.round(duration / 16); // 60fps approx
        const increment = end / totalFrames;
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const nextCount = Math.min(Math.round(increment * frame), end);
            setCount(nextCount);

            if (frame === totalFrames) {
                clearInterval(timer);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return (
        <span ref={countRef} className="stat-counter-number">
            {count.toLocaleString()}{suffix}
        </span>
    );
};

export default StatCounter;
