"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
}

export function CursorTrail() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(true);
    const [isMoving, setIsMoving] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsVisible(!mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsVisible(!e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const addParticle = useCallback((x: number, y: number) => {
        const id = Date.now() + Math.random();
        const size = Math.random() * 4 + 2; // Random size between 2-6px
        setParticles((prev) => [...prev.slice(-6), { id, x, y, size }]);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let lastX = 0;
        let lastY = 0;
        let moveTimeout: NodeJS.Timeout;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setIsMoving(true);

            // Clear existing timeout
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => setIsMoving(false), 100);

            // Only add particle if mouse moved enough
            const distance = Math.sqrt(
                Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
            );

            if (distance > 30) {
                addParticle(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearTimeout(moveTimeout);
        };
    }, [addParticle, isVisible]);

    // Remove old particles
    useEffect(() => {
        if (particles.length === 0) return;

        const timer = setTimeout(() => {
            setParticles((prev) => prev.slice(1));
        }, 300);

        return () => clearTimeout(timer);
    }, [particles]);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* Primary cursor glow - only show when moving */}
            <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                    width: isMoving ? 40 : 20,
                    height: isMoving ? 40 : 20,
                }}
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                    scale: isMoving ? 1 : 0.5,
                    opacity: isMoving ? 0.4 : 0.2,
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 150,
                    mass: 0.3,
                }}
            />

            {/* Energy trail particles */}
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            boxShadow: `0 0 ${particle.size * 2}px hsl(var(--primary) / 0.5)`,
                        }}
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 1,
                            opacity: 0.6
                        }}
                        animate={{
                            scale: 0.2,
                            opacity: 0,
                            y: particle.y + 10
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
