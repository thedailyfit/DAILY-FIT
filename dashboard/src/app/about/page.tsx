"use client";

import { motion, useInView, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, Zap, TrendingUp, Users, Brain, Shield, ArrowRight, Heart, Star, Fingerprint, Layers, Cpu, Network, Workflow } from "lucide-react";
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
        <div ref={ref} className="space-y-1">
            <div className="text-4xl md:text-5xl font-bold text-white tabular-nums tracking-tight">
                {displayValue}{suffix}
            </div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">{label}</div>
        </div>
    );
}

export default function AboutPage() {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            <LandingHeader />

            {/* 1. HERO SECTION - Updated Text */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 container mx-auto px-4 md:px-6 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-5xl mx-auto space-y-6 relative z-10"
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

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.15] max-w-[90vw] mx-auto">
                        Building the future of daily fitness <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">engagement for gyms and trainers</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto pt-4">
                        We’re building a WhatsApp-first AI platform that helps gyms deliver daily guidance, consistency, and measurable progress — without the burnout.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link href="/pricing" className="w-full sm:w-auto">
                            <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-transform hover:scale-105">
                                Start Free <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Button variant="ghost" className="h-12 px-8 rounded-full text-gray-400 hover:text-white text-lg w-full sm:w-auto border border-transparent hover:border-white/10">
                            View How It Works
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. METRICS STRIP */}
            <section className="py-12 relative border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <AnimatedCounter value={1000} suffix="+" label="Daily Interactions" />
                        <AnimatedCounter value={40} suffix="K+" label="Messages Delivered" />
                        <AnimatedCounter value={99} suffix="%+" label="Open Rate" />
                        <AnimatedCounter value={500} suffix="+" label="Built for Gyms" />
                    </div>
                </div>
            </section>

            {/* 3. ABOUT NARRATIVE */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">About <span className="text-blue-500">DailyFit AI</span></h2>
                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                            <p>
                                DailyFit AI was created to solve a simple but costly problem:
                            </p>
                            <div className="border-l-4 border-blue-500 pl-6 py-1 my-4">
                                <p className="text-white text-xl font-medium italic">
                                    "Most gyms lose members not because of equipment, but because there is no system for daily guidance."
                                </p>
                            </div>
                            <p>
                                Gyms and trainers work hard, yet members still feel confused about what to eat or do. DailyFit AI bridges this gap with <strong>WhatsApp-first AI agents</strong> that automate the heavy lifting.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 blur-[80px] opacity-20 rounded-full" />
                        <div className="bg-[#0A0A0A] p-10 md:p-12 rounded-[2.5rem] border border-white/10 relative z-10 shadow-2xl overflow-hidden group">
                            {/* Light effect */}
                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-2xl md:text-3xl font-extralight text-white leading-tight">
                                    To make daily engagement <span className="text-blue-400 font-normal">effortless</span> for every gym and trainer.
                                </p>
                                <div className="mt-8 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">Consistency &gt; Intensity</div>
                                        <div className="text-gray-400 text-sm">Small daily actions win.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. CORE PHILOSOPHY - Fixed Scrollbar Issue */}
            <section className="py-20 bg-white/[0.02]">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Removing friction from operations</h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            <span className="text-blue-500 font-semibold">DailyFit AI</span> is built on three core principles that drive our product decisions.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: TrendingUp, color: "text-blue-400", title: "Consistency over Intensity", desc: "Daily results come from small actions done consistently. We focus on daily clarity, not extreme programs." },
                            { icon: Brain, color: "text-purple-400", title: "Automation with Control", desc: "AI handles repetition. Trainers handle judgment, motivation, and personalization." },
                            { icon: Users, color: "text-green-400", title: "Scalability without Burnout", desc: "Gyms and trainers should scale impact without increasing stress. DailyFit AI makes that possible." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="p-8 rounded-3xl bg-black border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 duration-300 group"
                            >
                                <item.icon className={`w-10 h-10 ${item.color} mb-6`} />
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FOUNDER BLOCK - Dark Card Replica */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto bg-gradient-to-br from-[#0c1220] to-[#000000] rounded-[2rem] p-8 md:p-16 border border-white/5 relative overflow-hidden shadow-2xl"
                >
                    {/* Subtle light leak matching screenshot direction */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[130px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="mb-10 border-b border-white/5 pb-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Founder & Team Ethos</h2>
                            <p className="text-lg text-blue-500 font-medium">Akhilesh Reddy — Founder, DailyFit AI</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 text-sm md:text-base">
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
                            <div className="space-y-4">
                                {["Ship fast, but responsibly", "Build systems before scale", "Listen closely to gyms and trainers", "Optimize for long-term trust"].map((text, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 text-gray-200 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="bg-blue-500/10 rounded-full p-1 shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="font-medium text-gray-200">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 6. PRODUCT PILLARS */}
            <section className="py-20 container mx-auto px-4 md:px-6 intro-y">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">What We're Built On</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
                    {[
                        { icon: Zap, color: "blue", title: "Daily Guidance", desc: "Automated daily workout and diet plans delivered directly on WhatsApp." },
                        { icon: Brain, color: "purple", title: "Adaptive Intelligence", desc: "AI that learns from member behavior and trainer edits to improve plans over time." },
                        { icon: MessageSquare, color: "green", title: "WhatsApp-First", desc: "No apps. No friction. Just consistent engagement where users already are." },
                        { icon: Shield, color: "orange", title: "Trainer Empowerment", desc: "Trainers stay in control with dashboards, overrides, and deep insights." }
                    ].map((card, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-zinc-900/20 border border-white/10 hover:bg-zinc-900/40 transition-all hover:shadow-lg">
                            <div className={`w-12 h-12 bg-${card.color}-900/20 text-${card.color}-400 rounded-xl flex items-center justify-center mb-4 ring-1 ring-${card.color}-500/20`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. UNDER THE HOOD - VISUAL GRAPHICS/MOTION */}
            <section className="py-32 bg-[#030303] relative overflow-hidden">
                {/* Cyber Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]"></div>

                <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Cpu className="w-3 h-3" /> Architecture
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Under the Hood</h2>
                        <p className="text-lg text-gray-400">
                            Modular AI-agent architecture designed for reliability at scale.
                        </p>
                    </motion.div>

                    {/* Visual Network Graphic */}
                    <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
                        {/* Connecting Lines (Simulated with absolute divs) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="w-[300px] h-[300px] border border-blue-500/30 rounded-full animate-pulse"></div>
                            <div className="absolute w-[450px] h-[200px] border border-purple-500/20 rounded-[100%] rotate-12"></div>
                        </div>

                        {/* Central Brain Node */}
                        <div className="relative z-20 flex flex-col items-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)] relative">
                                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <div className="mt-4 font-bold text-white">Core Orchestrator</div>
                        </div>

                        {/* Satellite Nodes */}
                        {[
                            { icon: Layers, label: "Plan Generation", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-6 md:-translate-y-12" },
                            { icon: Fingerprint, label: "Personalization", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-6 md:translate-y-12" },
                            { icon: Network, label: "Scheduling", pos: "top-1/2 left-0 -translate-x-4 md:-translate-x-12 -translate-y-1/2" },
                            { icon: Workflow, label: "Learning Loops", pos: "top-1/2 right-0 translate-x-4 md:translate-x-12 -translate-y-1/2" },
                        ].map((node, i) => (
                            <div key={i} className={`absolute ${node.pos} flex flex-col items-center z-20 group`}>
                                <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-900/20 transition-all duration-300 shadow-lg">
                                    <node.icon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <div className="mt-2 text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                                    {node.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. BUILD JOURNEY */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold">Our Build Journey</h2>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2"></div>

                    <div className="space-y-24">
                        <div className="relative flex flex-col md:flex-row items-center md:items-start w-full group">
                            <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#000] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 mt-6"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pr-16 md:text-right hidden md:block"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pl-16">
                                <div className="p-8 rounded-2xl border border-white/10 bg-[#080808] hover:border-blue-500/50 transition-colors">
                                    <span className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 block">Stage 1</span>
                                    <h3 className="text-xl font-bold text-white mb-2">Core Problems Identified</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Identified retention & trainer burnout as the enemies of growth.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center md:items-start w-full group">
                            <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#000] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10 mt-6"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pr-16 md:text-right w-full">
                                <div className="p-8 rounded-2xl border border-white/10 bg-[#080808] hover:border-purple-500/50 transition-colors">
                                    <span className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 block">Stage 2</span>
                                    <h3 className="text-xl font-bold text-white mb-2">WhatsApp Testing</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Verified that WhatsApp is the only channel with 100% open rates.</p>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-16 hidden md:block"></div>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center md:items-start w-full group">
                            <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#000] border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 mt-6"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pr-16 md:text-right hidden md:block"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pl-16">
                                <div className="p-8 rounded-2xl border border-white/10 bg-[#080808] hover:border-green-500/50 transition-colors">
                                    <span className="text-green-500 text-xs font-bold uppercase tracking-widest mb-2 block">Stage 3</span>
                                    <h3 className="text-xl font-bold text-white mb-2">AI Agents Live</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Built the agents that generate workout and diet plans instantly.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center md:items-start w-full group">
                            <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-10 mt-6"></div>
                            <div className="ml-12 md:ml-0 md:w-1/2 md:pr-16 md:text-right w-full">
                                <div className="p-8 rounded-2xl border border-white/10 bg-[#080808] hover:border-white/50 transition-colors">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest mb-2 block">Now</span>
                                    <h3 className="text-xl font-bold text-white mb-2">Full Platform Scale</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Expanding into a comprehensive automation suite for gyms worldwide.</p>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-16 hidden md:block"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. WHY WE'RE BUILDING THIS */}
            <section className="py-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-[#050505] rounded-[2rem] p-10 md:p-16 text-center border border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <Heart className="w-3 h-3 fill-blue-400" /> Our Belief
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Why We’re Building This
                            </h2>

                            <div className="space-y-4 text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                                <p>Because fitness businesses deserve systems that work with them, not against them.</p>
                                <p>Because trainers deserve leverage, not exhaustion.</p>
                                <p>Because daily habits matter more than perfect plans.</p>
                            </div>

                            <div className="pt-4">
                                <p className="text-xl md:text-2xl text-white font-medium">
                                    DailyFit AI exists to make daily fitness guidance <span className="text-blue-500">effortless</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 10. FINAL CTA BANNER */}
            <section className="py-24 container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Build a smarter fitness system today.
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                        Start automating workouts, nutrition, and follow-ups on WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/pricing">
                            <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 text-white hover:bg-white/10 text-lg">
                            Request Demo
                        </Button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
