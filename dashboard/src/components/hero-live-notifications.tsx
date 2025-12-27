"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Plus, MessageCircle, Info } from "lucide-react";

// Types for our notification cards
type NotificationCard = {
    id: string;
    title: string;
    meta: string;
    icon: React.ReactNode;
    position: string; // Tailwind classes for desktop positioning
    mobilePosition?: string;
    color: string;
};

// The 4 requested cards
const NOTIFICATIONS: NotificationCard[] = [
    {
        id: "workout",
        title: "Workout sent to 42 members",
        meta: "Today • 7:00 AM",
        icon: <span className="text-xl">💪</span>,
        position: "top-10 -left-12",
        color: "bg-blue-500",
    },
    {
        id: "member",
        title: "5 members completed today",
        meta: "Live update",
        icon: <Check className="w-5 h-5 text-green-400" />,
        position: "bottom-32 -right-8",
        color: "bg-green-500",
    },
    {
        id: "revenue",
        title: "₹18,000 renewal collected",
        meta: "Membership fees • Today",
        icon: <span className="text-xl">💰</span>,
        position: "-bottom-6 left-10",
        color: "bg-yellow-500",
    },
    {
        id: "lead",
        title: "New lead captured",
        meta: "Rahul S • Muscle Gain",
        icon: <MessageCircle className="w-5 h-5 text-white" />,
        position: "top-40 -right-16",
        color: "bg-green-600",
    },
];

export function HeroLiveNotifications() {
    const [visibleIndices, setVisibleIndices] = useState<number[]>([0]);

    // Animation Loop Logic
    useEffect(() => {
        // Sequence: 
        // 0s: Show Card 0 (Workout)
        // 2s: Show Card 1 (Member)
        // 4s: Show Card 2 (Revenue)
        // 6s: Show Card 3 (Lead) - maybe replace one of the others?

        // Simple staggered entry for "Alive" feel
        const timeouts: NodeJS.Timeout[] = [];

        // Reset initially
        setVisibleIndices([]);

        // Staggered Entry
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => [...prev, 0]), 500));
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => [...prev, 1]), 2500));
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => [...prev, 2]), 4500));
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => [...prev, 3]), 6500));

        // Optional: Cycle/Exit logic could be added here for a loop
        // For now, let's keep them persistent as they "build up" the activity view
        // or we can remove the first one when the last one appears to avoid clutter
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => prev.filter(i => i !== 0)), 8500));
        timeouts.push(setTimeout(() => setVisibleIndices((prev) => [...prev, 0]), 10500)); // Bring it back

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {/* Mobile: Vertical List Layout (Hidden on desktop) */}
            <div className="lg:hidden absolute -bottom-24 left-0 right-0 flex flex-col items-center space-y-3 px-4">
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live AI Activity
                </div>
                <AnimatePresence mode="popLayout">
                    {/* Show only the ACTIVE recent card on mobile to save space */}
                    {NOTIFICATIONS.map((card, i) => (
                        visibleIndices.includes(i) && i === visibleIndices[visibleIndices.length - 1] ? (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full max-w-sm bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3"
                            >
                                <div className={`w-10 h-10 rounded-full ${card.color}/20 flex items-center justify-center border border-white/5`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{card.title}</div>
                                    <div className="text-xs text-gray-400">{card.meta}</div>
                                </div>
                            </motion.div>
                        ) : null
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop: Floating Layout */}
            <div className="hidden lg:block w-full h-full relative">
                {/* Live Badge */}
                <div className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">DailyFit AI — Live in Gyms</span>
                </div>

                <AnimatePresence>
                    {NOTIFICATIONS.map((card, i) => (
                        visibleIndices.includes(i) && (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`absolute ${card.position} w-72 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform cursor-default`}
                                style={{ boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-inner`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white leading-tight mb-0.5">{card.title}</div>
                                    <div className="text-xs text-gray-400 font-medium">{card.meta}</div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
