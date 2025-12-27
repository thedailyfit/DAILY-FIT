"use client";

import { motion, useInView, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, Zap, TrendingUp, Users, Brain, Shield, ArrowRight, Heart, Star } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { LandingHeader } from "@/components/landing-header";

/* --- ANIMATED COUNTER COMPONENT --- */
function AnimatedCounter({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const springValue = useSpring(0, { stiffness: 50, damping: 20 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            springValue.set(value);
        }
    }, [isInView, value, springValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <div ref={ref} className="space-y-2">
            <div className="text-4xl md:text-6xl font-bold text-white tabular-nums tracking-tight">
                {displayValue}{suffix}
            </div>
            <div className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wide">{label}</div>
        </div>
    );
}

export default function AboutPage() {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            <LandingHeader />

            {/* 1. HERO SECTION */}
            <section className="pt-32 pb-24 md:pt-48 md:pb-32 container mx-auto px-4 md:px-6 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto space-y-10 relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 backdrop-blur-md"
                    >
                        <Star className="w-4 h-4 fill-blue-300" />
                        <span>The DailyFit Story</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
                        Crafting a smarter path from <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">gyms to lasting results.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
                        We’re building a WhatsApp-first AI platform that helps gyms deliver
                        <span className="text-white font-medium"> daily guidance</span>,
                        <span className="text-white font-medium"> consistency</span>, and
                        <span className="text-white font-medium"> measurable progress</span>
                        — without the burnout.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <Link href="/pricing" className="w-full sm:w-auto">
                            <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform hover:scale-105">
                                Start Free <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Button variant="ghost" className="h-14 px-10 rounded-full text-gray-400 hover:text-white text-lg w-full sm:w-auto border border-transparent hover:border-white/10">
                            View How It Works
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. METRICS STRIP - ANIMATED */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <AnimatedCounter value={1000} suffix="+" label="Daily Interactions" />
                        <AnimatedCounter value={40} suffix="K+" label="Messages Delivered" />
                        <AnimatedCounter value={99} suffix="%+" label="Open Rate" />
                        <AnimatedCounter value={500} suffix="+" label="Gyms & Trainers" />
                    </div>
                </div>
            </section>

            {/* 3. ABOUT NARRATIVE */}
            <section className="py-32 container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">About <span className="text-blue-500">DailyFit AI</span></h2>
                        <div className="space-y-6 text-gray-400 text-lg md:text-xl leading-relaxed">
                            <p>
                                DailyFit AI was created to solve a simple but costly problem:
                            </p>
                            <div className="border-l-4 border-blue-500 pl-6 py-2 my-6">
                                <p className="text-white text-2xl font-medium italic">
                                    "Most gyms lose members not because of equipment, but because there is no system for daily guidance."
                                </p>
                            </div>
                            <p>
                                Gyms and trainers work hard, yet members still feel confused about what to eat or do. DailyFit AI bridges this gap with <strong>WhatsApp-first AI agents</strong> that automate the heavy lifting.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 blur-[100px] opacity-20 rounded-full" />
                        <div className="bg-[#0A0A0A] p-10 md:p-14 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10">Our Mission</h3>
                            <p className="text-3xl md:text-4xl font-extralight text-white leading-tight relative z-10">
                                To make daily engagement <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 font-normal">effortless</span> for every gym and trainer.
                            </p>
                            <div className="mt-12 flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-white">Consistency &gt; Intensity</div>
                                    <div className="text-gray-400">Small daily actions win.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. CORE PHILOSOPHY */}
            <section className="py-32 bg-white/[0.02]">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Removing friction from operations</h2>
                        <p className="text-xl text-gray-400">DailyFit AI is built on three core principles that drive our product decisions.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: TrendingUp, color: "text-blue-400", title: "Consistency over Intensity", desc: "Daily results come from small actions done consistently. We focus on daily clarity, not extreme programs." },
                            { icon: Brain, color: "text-purple-400", title: "Automation with Control", desc: "AI handles repetition. Trainers handle judgment, motivation, and personalization." },
                            { icon: Users, color: "text-green-400", title: "Scalability without Burnout", desc: "Gyms and trainers should scale impact without increasing stress. DailyFit AI makes that possible." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="p-8 md:p-12 rounded-[2rem] bg-black border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 duration-300 group"
                            >
                                <item.icon className={`w-12 h-12 ${item.color} mb-8`} />
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FOUNDER BLOCK */}
            <section className="py-32 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-[3rem] p-8 md:p-20 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="mb-12 border-b border-white/10 pb-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-2">Founder & Team Ethos</h2>
                            <p className="text-xl text-blue-400 font-medium">Akhilesh Reddy — Founder, DailyFit AI</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16">
                            <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed">
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
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    {["Ship fast, but responsibly", "Build systems before scale", "Listen closely to gyms and trainers", "Optimize for long-term trust"].map((text, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-center gap-4 text-white text-lg bg-white/5 p-4 rounded-xl border border-white/5"
                                        >
                                            <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                            <span>{text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 6. PRODUCT PILLARS & JOURNEY */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                {/* PRODUCT PILLARS */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">What We're Built On</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: Zap, color: "blue", title: "Daily Guidance", desc: "Automated daily workout and diet plans delivered directly on WhatsApp." },
                            { icon: Brain, color: "purple", title: "Adaptive Intelligence", desc: "AI that learns from member behavior and trainer edits to improve plans over time." },
                            { icon: MessageSquare, color: "green", title: "WhatsApp-First", desc: "No apps. No friction. Just consistent engagement where users already are." },
                            { icon: Shield, color: "orange", title: "Trainer Empowerment", desc: "Trainers stay in control with dashboards, overrides, and deep insights." }
                        ].map((card, i) => (
                            <div key={i} className="group p-10 rounded-[2rem] bg-gradient-to-br from-gray-900/50 to-black border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl">
                                <div className={`w-14 h-14 bg-${card.color}-900/20 text-${card.color}-400 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-${card.color}-500/20 group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white">{card.title}</h3>
                                <p className="text-gray-400 text-lg leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* JOURNEY Timeline - Simplyfied & Clean */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 text-center">Our Build Journey</h2>
                    <div className="space-y-12 border-l-2 border-white/10 ml-4 md:ml-0 md:pl-0">
                        {[
                            { stage: "Stage 1", title: "Core Problems", desc: "Identified retention & trainer burnout as the enemies of growth." },
                            { stage: "Stage 2", title: "WhatsApp Testing", desc: "Verified that WhatsApp is the only channel with 100% open rates." },
                            { stage: "Stage 3", title: "AI Agents Live", desc: "Built the agents that generate workout and diet plans instantly." },
                            { stage: "Now", title: "Full Platform Scale", desc: "Expanding into a comprehensive automation suite for gyms worldwide." }
                        ].map((step, i) => (
                            <div key={i} className="relative pl-12 md:pl-0 md:flex md:items-center md:gap-12 group">
                                <div className="absolute left-[-5px] top-2 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-black z-10 group-last:bg-white"></div>
                                <div className="md:w-1/2 md:text-right md:pr-12 md:group-odd:order-1 md:group-even:order-2">
                                    <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">{step.stage}</span>
                                </div>
                                <div className="md:w-1/2 md:group-odd:order-2 md:group-even:order-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                                    <p className="text-gray-400">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. WHY WE'RE BUILDING THIS - REDESIGNED */}
            <section className="py-32 bg-black container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto relative group"
                >
                    {/* Glowing Border Background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-[#050505] rounded-[2.5rem] p-12 md:p-24 text-center border border-white/10 overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none"></div>

                        <div className="relative z-10 space-y-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                                <Heart className="w-4 h-4 fill-blue-400" /> Our Belief
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                Why We’re Building This
                            </h2>

                            <div className="space-y-6 text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
                                <p>Because fitness businesses deserve systems that work <span className="text-white font-medium italic">with</span> them, not against them.</p>
                                <p>Because trainers deserve leverage, not exhaustion.</p>
                                <p>Because daily habits matter more than perfect plans.</p>
                            </div>

                            <div className="pt-8">
                                <p className="text-2xl md:text-3xl text-white font-medium">
                                    DailyFit AI exists to make daily fitness <br className="hidden md:block" />
                                    guidance <span className="text-blue-500">effortless</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 8. FINAL CTA BANNER */}
            <section className="py-24 container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Build a smarter fitness system today.
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Start automating workouts, nutrition, and follow-ups on WhatsApp —
                        and let DailyFit AI handle consistency while you focus on growth.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/pricing">
                            <Button className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-16 px-12 rounded-full border-white/20 text-white hover:bg-white/10 text-xl">
                            Request Demo
                        </Button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
