"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useSoundEffects from '../../hooks/use-sound-effects';
import Link from 'next/link';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    href?: string; // If provided, renders as Link
}

export default function MagneticButton({
    children,
    className = "",
    strength = 0.5,
    onClick,
    href,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { playHover, playClick } = useSoundEffects();

    const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        const { height, width, left, top } = rect;
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        setPosition({ x: middleX * strength, y: middleY * strength });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
        playHover();
    };

    const commonProps = {
        ref: ref as any,
        className: className,
        animate: { x: position.x, y: position.y },
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
        onMouseMove: handleMouse,
        onMouseLeave: reset,
        onMouseEnter: handleMouseEnter,
    };

    if (href) {
        return (
            <motion.a
                href={href}
                onClick={(e) => {
                    playClick();
                    if (onClick) onClick(e as any);
                }}
                {...(commonProps as any)}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            onClick={(e) => {
                playClick();
                if (onClick) onClick(e);
            }}
            {...(commonProps as any)}
            {...(props as any)}
        >
            {children}
        </motion.button>
    );
}
