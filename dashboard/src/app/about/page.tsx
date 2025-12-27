"use client";

import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Target, Shield, Heart, ArrowRight } from "lucide-react";

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
                        Building the brain for<br />
                        <span className="text-gray-500">fitness businesses.</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        We don't just "manage members". We build the automated systems that allow gym owners to sleep at night while their business grows itself.
                    </motion.p>
                </section>

                {/* MISSION: Values Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 border-y border-white/10 py-16">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Hyper-Velocity</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The speed of execution determines the winner. We compress weeks of admin work into milliseconds of compute.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Absolute Precision</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your business is a machine. We tune it. From calorie counts to revenue projections, our AI operates with zero margin for error.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Digital Leverage</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Small teams, massive impact. We give independent gym owners the technological power of a global franchise.
                        </p>
                    </div>
                </section>

                {/* FOUNDER ETHOS */}
                <section className="mb-32">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/3">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gray-900 group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                                    <span className="text-8xl font-bold text-white/5">AR</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-8">
                            <h2 className="text-3xl font-bold text-white">Founder & Team Ethos</h2>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Akhilesh Reddy</h3>
                                <p className="text-blue-400 text-sm font-medium mb-4">Founder • Product & Engineering</p>
                                <blockquote className="text-xl text-gray-300 italic mb-6 border-l-2 border-blue-500 pl-4">
                                    "I didn't build DailyFit to be another 'database'. I built it to be a co-founder.
                                    It works 24/7, doesn't take holidays, and cares about your revenue as much as you do."
                                </blockquote>
                                <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                                    <p>We are obsessed with removing the "Grunt Work" from fitness.</p>
                                    <ul className="space-y-2 pl-4">
                                        <li className="flex gap-2 items-center"><ArrowRight className="w-4 h-4 text-blue-500" /> <span className="text-white">Shipping Daily:</span> We iterate based on your feedback faster than anyone else.</li>
                                        <li className="flex gap-2 items-center"><ArrowRight className="w-4 h-4 text-blue-500" /> <span className="text-white">Data Safety:</span> We protect your member list like it's a bank vault.</li>
                                        <li className="flex gap-2 items-center"><ArrowRight className="w-4 h-4 text-blue-500" /> <span className="text-white">Empathy First:</span> We know what it's like to lose a sale. That's why we built the AI to fix it.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCT PILLARS */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Speed Over Ceremony</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We hate complex setups. DailyFit is designed to go from "Sign Up" to "First Automation" in minutes, not days.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                <Target className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Clarity Is King</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                A dashboard should answer questions, not create them. We hide the complexity and show you the money.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Power With Safety</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Our AI is powerful, but it has boundaries. It will never hallucinate or be rude to a member. It's safe by design.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Heart className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Built by Obsessives</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We care about pixels, we care about milliseconds, and we care about you. We are not a corporation; we are a craft shop.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-20 border-t border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-6">Start your transformation.</h2>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 font-bold">
                            Get Started Free
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
