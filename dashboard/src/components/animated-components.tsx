"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Animated Card with fade-in and optional delay
export function AnimatedCard({
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Animated List with staggered children
export function AnimatedList({
    children,
    className
}: {
    children: ReactNode;
    className?: string;
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
                        staggerChildren: 0.08
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

// Animated Button with hover effects
export function AnimatedButton({
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
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(className)}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}

// Animated Table Row
export function AnimatedTableRow({
    children,
    className,
    index = 0
}: {
    children: ReactNode;
    className?: string;
    index?: number;
}) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ backgroundColor: "var(--accent)", transition: { duration: 0.2 } }}
            className={cn(className)}
        >
            {children}
        </motion.tr>
    );
}

// Hover Scale wrapper for cards
export function HoverCard({
    children,
    className
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 40px -10px var(--primary)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
