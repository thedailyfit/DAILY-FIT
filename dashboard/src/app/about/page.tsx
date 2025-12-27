"use client";

import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Zap, Target, Shield, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-blue-500/30 font-sans">
            <LandingHeader />

            <main className="pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-5xl">

                {/* HERO: Vision Statement */}
                <section className="text-center mb-24 space-y-6">
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-mono uppercase tracking-wider mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        The DailyFit Manifesto
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Crafting the operating system<br />
                        <span className="text-gray-500">for modern fitness automated.</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        We remove the friction between "Starting a Gym" and "Scaling a Brand".
                        DailyFit is the automation layer for lean, high-growth fitness centers.
                    </motion.p>
                </section>

                {/* MISSION: Values Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 border-y border-white/10 py-16">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Velocity</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Manual work kills growth. We build tools that turn 3-hour admin tasks into 3-second automated flows. Speed is our currency.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Precision</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Fitness is science. Our AI doesn't guess; it uses data to deliver precise diet plans, workout splits, and revenue forecasts.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Leverage</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            One gym owner should be able to manage 500 members. We provide the digital leverage to multiply your output without multiplying your hours.
                        </p>
                    </div>
                </section>

                {/* FOUNDER ETHOS */}
                <section className="mb-32">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/3">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gray-900 grayscale hover:grayscale-0 transition-all duration-700">
                                {/* Placeholder for Founder Image - Using CSS block if no image */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 flex items-center justify-center">
                                    <span className="text-6xl font-bold text-white/5">AR</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-8">
                            <h2 className="text-3xl font-bold text-white">Founder & Team Ethos</h2>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Akhilesh Reddy</h3>
                                <p className="text-blue-400 text-sm font-medium mb-4">Founder • Product & Engineering</p>
                                <blockquote className="text-xl text-gray-300 italic mb-6 border-l-2 border-blue-500 pl-4">
                                    "Started this to compress the time from 'Opening a Gym' → 'Profitable Brand'.
                                    I believe gym owners deserve software that works as hard as they do."
                                </blockquote>
                                <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                                    <p>Built from scratch with an obsession for clarity, diverse regional support, and scalable automation.</p>
                                    <ul className="space-y-2 list-disc pl-4">
                                        <li><span className="text-white">Short feedback cycles:</span> We ship features weekly based on what you actually need.</li>
                                        <li><span className="text-white">Safety nets:</span> Guardrailed AI that respects fitness science.</li>
                                        <li><span className="text-white">Bias for clarity:</span> No complex dashboards. Just clear, actionable growth.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCT PILLARS */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Product Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Speed Over Friction</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Idea → Live Plan in seconds. Low ceremony, high leverage. We hate button clicks.
                                If the AI can do it, you shouldn't have to.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                <Target className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Clarity {'>'} Complexity</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Visual flows that stay readable at scale. A dashboard shouldn't look like a cockpit;
                                it should look like a calm morning.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Power With Safety</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Smart data controls + privacy guardrails. Your member data is yours.
                                We build systems that protect your business while growing it.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Heart className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Builder Empathy</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We ship what we'd want to use daily: shortcuts, sane defaults, and resilience.
                                We are builders serving builders.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-20 border-t border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-6">Build your legacy today.</h2>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 font-bold">
                            Start Free Trial
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-full px-8">
                            Read our Story
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
