"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell } from "lucide-react";

interface Particle {
    id: number;
    x: number;
    y: number;
}

export function CursorTrail() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(true);

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
        setParticles((prev) => [...prev.slice(-8), { id, x, y }]);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            // Only add particle if mouse moved enough
            const distance = Math.sqrt(
                Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
            );

            if (distance > 40) {
                addParticle(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [addParticle, isVisible]);

    // Remove old particles
    useEffect(() => {
        if (particles.length === 0) return;

        const timer = setTimeout(() => {
            setParticles((prev) => prev.slice(1));
        }, 200);

        return () => clearTimeout(timer);
    }, [particles]);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* Subtle glow following cursor */}
            <motion.div
                className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                style={{
                    background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                }}
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 180,
                    mass: 0.5,
                }}
            />

            {/* Gym-themed trail particles (mini dumbbells) */}
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 text-primary"
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 0.8,
                            opacity: 0.5,
                            rotate: 0
                        }}
                        animate={{
                            scale: 0.3,
                            opacity: 0,
                            rotate: 180
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                    >
                        <Dumbbell className="h-4 w-4" style={{ filter: "drop-shadow(0 0 4px var(--primary))" }} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
