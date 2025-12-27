"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
    "Manually replying to every WhatsApp message",
    "Chasing members for fee renewals",
    "Spending hours creating diet plans",
    "Losing leads who reply late at night",
    "No way to track real client progress",
];

const solutions = [
    "AI Agent answers queries 24/7 instantly",
    "Automated WhatsApp fee reminders",
    "Generate personalized plans in seconds",
    "Capture & follow-up leads while you sleep",
    "Visual progress tracking & analytics dashboard",
];

export function BeforeAfter() {
    return (
        <section className="py-24 container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Gym: <span className="text-gray-500">Before & After</span></h2>
                <p className="text-gray-400">See the difference DailyFit makes in your daily life.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* BEFORE CARD */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="rounded-3xl p-8 bg-red-500/5 border border-red-500/10 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-red-400">Before DailyFit</h3>
                        <div className="p-2 bg-red-500/10 rounded-full">
                            <X className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                    <ul className="space-y-6">
                        {problems.map((item, idx) => (
                            <li key={idx} className="flex gap-4 items-start text-gray-400">
                                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-lg">{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* AFTER CARD */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="rounded-3xl p-8 bg-green-500/10 border border-green-500/20 backdrop-blur-sm relative overflow-hidden"
                >
                    {/* Glowing Background Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-2xl font-bold text-green-400">After DailyFit</h3>
                        <div className="p-2 bg-green-500/20 rounded-full">
                            <Check className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <ul className="space-y-6 relative z-10">
                        {solutions.map((item, idx) => (
                            <li key={idx} className="flex gap-4 items-start text-white font-medium">
                                <div className="p-0.5 bg-green-500 rounded-full mt-1">
                                    <Check className="w-3 h-3 text-black" />
                                </div>
                                <span className="text-lg">{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}
