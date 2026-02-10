"use client";
import React, { useEffect, useRef } from "react";
import "./BackgroundGradient.css";
import { useTheme } from "@/contexts/ThemeContext";

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
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size = "80%",
    blendingValue = "hard-light",
    children,
    interactive = true,
    containerClassName,
    className,
}: BackgroundGradientProps) => {
    const interactiveRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const themeContext = useTheme();
    const theme = themeContext?.theme || 'dark';

    // Using refs for coordinates to avoid state-driven re-renders during mouse move
    const tgX = useRef(0);
    const tgY = useRef(0);
    const curX = useRef(0);
    const curY = useRef(0);

    const getThemeColors = () => {
        if (theme === 'light') {
            return {
                bgStart: gradientBackgroundStart || "rgb(245, 245, 255)",
                bgEnd: gradientBackgroundEnd || "rgb(240, 240, 250)",
                first: firstColor || "91, 77, 255",
                second: secondColor || "255, 59, 138",
                third: thirdColor || "100, 220, 255",
                fourth: fourthColor || "200, 150, 255",
                fifth: fifthColor || "255, 200, 220",
                pointer: pointerColor || "91, 77, 255",
            };
        } else {
            return {
                bgStart: gradientBackgroundStart || "rgb(13, 11, 30)",
                bgEnd: gradientBackgroundEnd || "rgb(10, 8, 20)",
                first: firstColor || "91, 77, 255",
                second: secondColor || "255, 59, 138",
                third: thirdColor || "100, 220, 255",
                fourth: fourthColor || "200, 50, 50",
                fifth: fifthColor || "180, 180, 50",
                pointer: pointerColor || "91, 77, 255",
            };
        }
    };

    // Update CSS variables once on mount or theme change
    useEffect(() => {
        if (containerRef.current) {
            const colors = getThemeColors();
            const container = containerRef.current;
            container.style.setProperty("--gradient-background-start", colors.bgStart);
            container.style.setProperty("--gradient-background-end", colors.bgEnd);
            container.style.setProperty("--first-color", colors.first);
            container.style.setProperty("--second-color", colors.second);
            container.style.setProperty("--third-color", colors.third);
            container.style.setProperty("--fourth-color", colors.fourth);
            container.style.setProperty("--fifth-color", colors.fifth);
            container.style.setProperty("--pointer-color", colors.pointer);
            container.style.setProperty("--size", size);
            container.style.setProperty("--blending-value", blendingValue);
        }
    }, [theme, gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, pointerColor, size, blendingValue]);

    useEffect(() => {
        const move = () => {
            if (!interactiveRef.current) return;

            curX.current = curX.current + (tgX.current - curX.current) / 20;
            curY.current = curY.current + (tgY.current - curY.current) / 20;

            interactiveRef.current.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(curY.current)}px)`;
            requestAnimationFrame(move);
        };

        if (interactive && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            move();
        }
    }, [interactive]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (interactiveRef.current && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            tgX.current = event.clientX - rect.left;
            tgY.current = event.clientY - rect.top;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`bg-gradient-container ${containerClassName || ''}`}
            onMouseMove={interactive ? handleMouseMove : undefined}
        >
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
