"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, Zap, TrendingUp, Users, Brain, Shield, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { LandingHeader } from "@/components/landing-header";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <LandingHeader />

            {/* 1. HERO SECTION */}
            <section className="pt-32 pb-20 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400">
                        <span>✨ The DailyFit Story</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                        Crafting a smarter path from <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">gyms to lasting results.</span>
                    </h1>

                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        We’re building a WhatsApp-first AI fitness automation platform that helps
                        gyms and trainers deliver daily guidance, consistency, and measurable
                        progress — without apps, manual follow-ups, or trainer burnout.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/pricing">
                            <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg">
                                Start Free <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Button variant="ghost" className="h-12 px-8 rounded-full text-gray-400 hover:text-white">
                            View How It Works
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* 2. METRICS STRIP */}
            <section className="py-12 border-y border-white/5 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-white">1000+</div>
                            <div className="text-sm text-gray-500 font-medium">Daily Interactions</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-white">40K+</div>
                            <div className="text-sm text-gray-500 font-medium">Messages Delivered</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-white">99%+</div>
                            <div className="text-sm text-gray-500 font-medium">Open Rate</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-white">Global</div>
                            <div className="text-sm text-gray-500 font-medium">Gyms & Trainers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ABOUT NARRATIVE */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">About DailyFit AI</h2>
                        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                            <p>
                                DailyFit AI was created to solve a simple but costly problem in the fitness industry:
                            </p>
                            <p className="text-white font-medium border-l-4 border-blue-500 pl-4 py-1">
                                Most gyms lose members not because of lack of equipment or trainers —
                                but because there is no system for daily guidance and accountability.
                            </p>
                            <p>
                                Gyms and trainers work hard, yet members still feel confused about what to eat, what workout to do, and if they are making progress.
                            </p>
                            <p>
                                DailyFit AI bridges this gap with WhatsApp-first AI agents that automate daily workouts, nutrition guidance, and progress summaries — while keeping trainers fully in control.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-6">Our Mission</h3>
                            <p className="text-2xl font-light text-white leading-relaxed">
                                "To make daily engagement effortless for every gym and trainer."
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold">Consistency over intensity</div>
                                    <div className="text-sm text-gray-400">Small daily actions win.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CORE PHILOSOPHY */}
            <section className="py-24 bg-white/5">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Removing friction from daily operations</h2>
                        <p className="text-gray-400">DailyFit AI is built on three core principles.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-black border border-white/10 hover:border-blue-500/50 transition-colors">
                            <TrendingUp className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Consistency over Intensity</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Daily results come from small actions done consistently. We focus on daily clarity, not extreme programs.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-black border border-white/10 hover:border-purple-500/50 transition-colors">
                            <Brain className="w-10 h-10 text-purple-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Automation with Control</h3>
                            <p className="text-gray-400 leading-relaxed">
                                AI handles repetition. Trainers handle judgment, motivation, and personalization.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-black border border-white/10 hover:border-green-500/50 transition-colors">
                            <Users className="w-10 h-10 text-green-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Scalability without Burnout</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Gyms and trainers should scale impact without increasing stress. DailyFit AI makes that possible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOUNDER BLOCK */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2">Founder & Early Team Ethos</h2>
                            <p className="text-blue-400 font-medium">Akhilesh Reddy — Founder, DailyFit AI</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6 text-gray-300 leading-relaxed">
                                <p>
                                    DailyFit AI was born from deep observation of how gyms actually operate on the ground — not from theory, but from real-world friction.
                                </p>
                                <p>
                                    Akhilesh saw that trainers were overworked, members were under-guided, and apps were ignored. But <b>WhatsApp</b> was always open.
                                </p>
                                <p>
                                    Instead of building another app, DailyFit AI was designed as a fitness operating system that works where people already are.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span>Ship fast, but responsibly</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span>Build systems before scale</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span>Listen closely to gyms and trainers</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span>Optimize for long-term trust</span>
                                    </div>
                                </div>
                                <blockquote className="p-6 bg-white/5 rounded-xl border border-white/5 italic text-gray-300">
                                    "If fitness businesses win daily, growth becomes inevitable."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PRODUCT PILLARS */}
            <section className="py-24 container mx-auto px-4 md:px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">What DailyFit AI Is Built On</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-white/20 transition-all">
                        <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Daily Guidance</h3>
                        <p className="text-gray-400">Automated daily workout and diet plans delivered directly on WhatsApp.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-white/20 transition-all">
                        <div className="w-12 h-12 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                            <Brain className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Adaptive Intelligence</h3>
                        <p className="text-gray-400">AI that learns from member behavior and trainer edits to improve plans over time.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-white/20 transition-all">
                        <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-xl flex items-center justify-center mb-6">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">WhatsApp-First Experience</h3>
                        <p className="text-gray-400">No apps. No friction. Just consistent engagement where users already are.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-white/20 transition-all">
                        <div className="w-12 h-12 bg-orange-900/30 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Trainer Empowerment</h3>
                        <p className="text-gray-400">Trainers stay in control with dashboards, overrides, and deep insights.</p>
                    </div>
                </div>
            </section>

            {/* 7. UNDER THE HOOD */}
            <section className="py-24 bg-black border-y border-white/10">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-8">Under the Hood</h2>
                    <p className="text-gray-400 mb-12">
                        DailyFit AI runs on a modular AI-agent architecture designed for reliability and scale.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Plan Generation Agents", "Personalization Engine", "Photo Calorie Estimation", "Trainer Learning Loops", "Auto-Scheduling"].map((tech) => (
                            <div key={tech} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-blue-300">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. JOURNEY TIMELINE */}
            <section className="py-24 container mx-auto px-4 md:px-6 max-w-4xl">
                <h2 className="text-3xl font-bold mb-12 text-center">Our Build Journey</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10">

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-500 bg-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-blue-400 text-xs font-bold uppercase mb-1">Stage 1</div>
                            <div className="font-bold text-white mb-2">Core Problems Identified</div>
                            <div className="text-sm text-gray-400">Identified retention & trainer burnout as the enemies of growth.</div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-purple-500 bg-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-purple-400 text-xs font-bold uppercase mb-1">Stage 2</div>
                            <div className="font-bold text-white mb-2">WhatsApp Testing</div>
                            <div className="text-sm text-gray-400">Verified that WhatsApp is the only channel with 100% open rates.</div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-500 bg-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-green-400 text-xs font-bold uppercase mb-1">Stage 3</div>
                            <div className="font-bold text-white mb-2">AI Agents Live</div>
                            <div className="text-sm text-gray-400">Built the agents that generate workout and diet plans instantly.</div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-white/10 border border-white/20">
                            <div className="text-white text-xs font-bold uppercase mb-1">Now</div>
                            <div className="font-bold text-white mb-2">Full Platform Scale</div>
                            <div className="text-sm text-gray-400">Expanding into a comprehensive automation suite for gyms worldwide.</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 9. BELIEF SECTION */}
            <section className="py-24 text-center container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Why We’re Building This</h2>
                    <div className="text-xl text-gray-400 leading-relaxed space-y-4 font-light">
                        <p>Because fitness businesses deserve systems that work <span className="text-white italic">with</span> them, not against them.</p>
                        <p>Because trainers deserve leverage, not exhaustion.</p>
                        <p>Because daily habits matter more than perfect plans.</p>
                    </div>
                    <div className="pt-8">
                        <p className="text-white font-medium">DailyFit AI exists to make daily fitness guidance effortless.</p>
                    </div>
                </div>
            </section>

            {/* 10. FINAL CTA BANNER */}
            <section className="py-24 container mx-auto px-4">
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-[3rem] p-12 md:p-24 text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Build a smarter fitness system today</h2>
                        <p className="text-xl text-gray-300 mb-10">
                            Start automating workouts, nutrition, and follow-ups on WhatsApp —
                            and let DailyFit AI handle consistency while you focus on growth.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/pricing">
                                <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg shadow-xl shadow-white/10">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 text-white hover:bg-white/10 text-lg">
                                Request Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
