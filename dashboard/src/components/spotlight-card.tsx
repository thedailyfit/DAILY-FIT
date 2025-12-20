"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className={`relative rounded-xl overflow-hidden border border-white/10 bg-card/50 ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity: isFocused ? 1 : 0,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity: isFocused ? 1 : 0,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.4), transparent 40%)`,
                    maskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
                    WebkitMaskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px' // Border width
                }}
            />

            <div className="relative h-full">
                {children}
            </div>
        </div>
    );
}
