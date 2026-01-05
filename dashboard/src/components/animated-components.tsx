"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Animated Card with fade-in, hover scale, and subtle lift
export function AnimatedCard({
    children,
    className,
    delay = 0,
    hoverEffect = true
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            whileHover={hoverEffect ? {
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 }
            } : undefined}
            whileTap={hoverEffect ? { scale: 0.98 } : undefined}
            className={cn("transition-shadow hover:shadow-lg", className)}
        >
            {children}
        </motion.div>
    );
}

// Flip Card Animation - reveals on hover
export function FlipCard({
    children,
    className,
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            whileHover={{
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Pop-up Card Animation
export function PopupCard({
    children,
    className,
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                delay,
                type: "spring",
                stiffness: 200,
                damping: 15
            }}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
                transition: { duration: 0.2 }
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Animated List with staggered children
export function AnimatedList({
    children,
    className,
    staggerDelay = 0.08
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Animated Page wrapper for route transitions
export function AnimatedPage({
    children,
    className
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("w-full", className)}
        >
            {children}
        </motion.div>
    );
}

// Animated Section for content blocks
export function AnimatedSection({
    children,
    className,
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.section>
    );
}

// Glow Button with pulse effect
export function GlowButton({
    children,
    className,
    onClick
}: {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <motion.button
            whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(className)}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}

// Slide-in from side
export function SlideIn({
    children,
    className,
    direction = "left",
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
}) {
    const directionMap = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: -50 },
        down: { x: 0, y: 50 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionMap[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Counter animation for numbers
export function AnimatedCounter({
    value,
    className,
    prefix = "",
    suffix = ""
}: {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}) {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(className)}
        >
            {prefix}{value.toLocaleString()}{suffix}
        </motion.span>
    );
}

// Hover Scale wrapper
export function HoverScale({
    children,
    className,
    scale = 1.05
}: {
    children: ReactNode;
    className?: string;
    scale?: number;
}) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: scale - 0.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
