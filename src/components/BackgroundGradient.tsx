"use client";
import React, { useEffect, useRef, useState } from "react";
import "./BackgroundGradient.css";

interface BackgroundGradientProps {
    gradientBackgroundStart?: string;
    gradientBackgroundEnd?: string;
    firstColor?: string;
    secondColor?: string;
    thirdColor?: string;
    fourthColor?: string;
    fifthColor?: string;
    pointerColor?: string;
    size?: string;
    blendingValue?: string;
    children?: React.ReactNode;
    interactive?: boolean;
    containerClassName?: string;
    className?: string;
}

export const BackgroundGradientAnimation = ({
    gradientBackgroundStart = "rgb(10, 8, 30)", // Adjusted to match your theme
    gradientBackgroundEnd = "rgb(0, 0, 0)",
    firstColor = "91, 77, 255", // Your primary purple
    secondColor = "255, 59, 138", // Your accent pink
    thirdColor = "100, 220, 255",
    fourthColor = "200, 50, 50",
    fifthColor = "180, 180, 50",
    pointerColor = "91, 77, 255",
    size = "80%",
    blendingValue = "hard-light",
    children,
    interactive = true,
    containerClassName,
    className,
}: BackgroundGradientProps) => {
    const interactiveRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [curX, setCurX] = useState(0);
    const [curY, setCurY] = useState(0);
    const [tgX, setTgX] = useState(0);
    const [tgY, setTgY] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            container.style.setProperty("--gradient-background-start", gradientBackgroundStart);
            container.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
            container.style.setProperty("--first-color", firstColor);
            container.style.setProperty("--second-color", secondColor);
            container.style.setProperty("--third-color", thirdColor);
            container.style.setProperty("--fourth-color", fourthColor);
            container.style.setProperty("--fifth-color", fifthColor);
            container.style.setProperty("--pointer-color", pointerColor);
            container.style.setProperty("--size", size);
            container.style.setProperty("--blending-value", blendingValue);
        }
    }, [gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, pointerColor, size, blendingValue]);

    useEffect(() => {
        let animationFrameId: number;
        let currentX = 0;
        let currentY = 0;

        const move = () => {
            if (!interactiveRef.current) return;

            currentX = currentX + (tgX - currentX) / 20;
            currentY = currentY + (tgY - currentY) / 20;

            interactiveRef.current.style.transform = `translate(${Math.round(currentX)}px, ${Math.round(currentY)}px)`;
            animationFrameId = requestAnimationFrame(move);
        };

        if (interactive) {
            animationFrameId = requestAnimationFrame(move);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [tgX, tgY, interactive]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (interactiveRef.current) {
            const rect = interactiveRef.current.getBoundingClientRect();
            setTgX(event.clientX - rect.left);
            setTgY(event.clientY - rect.top);
        }
    };

    return (
        <div ref={containerRef} className={`bg-gradient-container ${containerClassName || ''}`} onMouseMove={interactive ? handleMouseMove : undefined}>
            <svg className="hidden" style={{ display: 'none' }}>
                <defs>
                    <filter id="blurMe">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div className={`gradients-container ${className || ''}`}>
                <div className="g-circle g-1"></div>
                <div className="g-circle g-2"></div>
                <div className="g-circle g-3"></div>
                <div className="g-circle g-4"></div>
                <div className="g-circle g-5"></div>
                {interactive && <div ref={interactiveRef} className="g-interactive"></div>}
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                {children}
            </div>
        </div>
    );
};
