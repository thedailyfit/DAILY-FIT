"use client";

import { useParams, notFound } from "next/navigation"; // Correct hook for Next.js 13+ App Router in Client Components
import { BLOG_POSTS } from "@/data/blog-posts";
import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* --- CUSTOM VISUAL COMPONENTS --- */

// 1. Retention Chart SVG
const RetentionChart = () => (
    <div className="my-12 p-8 bg-[#0F0F0F] rounded-3xl border border-white/10 text-center">
        <h4 className="text-xl font-bold text-white mb-6">The "Month 1 Cliff" in Gym Retention</h4>
        <div className="relative h-64 w-full max-w-2xl mx-auto">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-4 gap-4">
                <div className="border-t border-white/5 w-full"></div>
                <div className="border-t border-white/5 w-full"></div>
                <div className="border-t border-white/5 w-full"></div>
                <div className="border-t border-white/5 w-full"></div>
            </div>

            {/* The Line Graph */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,20 Q150,20 200,80 T400,200"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                />
                <path
                    d="M0,20 Q150,20 200,80 T400,200 V250 H0 Z"
                    fill="url(#gradient)"
                    className="opacity-50"
                />
                {/* Points */}
                <circle cx="0" cy="20" r="6" fill="#fff" />
                <circle cx="200" cy="80" r="6" fill="#fff" />
                <circle cx="400" cy="200" r="6" fill="#ef4444" />

                {/* Labels */}
                <text x="10" y="50" fill="gray" fontSize="12">Week 1: High Motivation</text>
                <text x="210" y="70" fill="gray" fontSize="12">Week 3: Confusion</text>
                <text x="360" y="180" fill="#ef4444" fontSize="12" fontWeight="bold">Day 30: Dropout</text>
            </svg>
        </div>
        <p className="text-sm text-gray-500 mt-6 italic">A lack of daily feedback creates uncertainty, leading to dropouts.</p>
    </div>
);

// 2. Loop Cycle Visual
const LoopCycle = () => (
    <div className="my-12 p-8 bg-[#0F0F0F] rounded-3xl border border-white/10">
        <h4 className="text-center text-xl font-bold text-white mb-10">The DailyFit Engagement Loop</h4>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-4xl mx-auto">
            {["Plan", "Act", "Log", "Feedback", "Adapt"].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold border ${i === 0 ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-zinc-900 border-white/10 text-gray-400'}`}>
                            {step}
                        </div>
                        {i === 0 && <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Start</span>}
                    </div>
                    {i < 4 && <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-white/10 to-white/30"></div>}
                </div>
            ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8 max-w-lg mx-auto">
            This cycle happens <span className="text-white font-bold">every single day</span> on WhatsApp, creating a habit loop that human trainers can't sustain at scale.
        </p>
    </div>
);

// 3. Workload Comparison Chart (Bar Chart)
const WorkloadChart = () => (
    <div className="my-12 p-8 bg-[#0F0F0F] rounded-3xl border border-white/10">
        <h4 className="text-center text-xl font-bold text-white mb-8">Weekly Trainer Workload</h4>
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Manual Workload */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Manual Management (15 Clients)</span>
                    <span className="text-red-400 font-bold">25 Hours/Week</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "80%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500"
                    />
                </div>
                <p className="text-xs text-gray-500">Mostly admin, copy-pasting, and tracking.</p>
            </div>

            {/* AI Workload */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>With DailyFit AI (50 Clients)</span>
                    <span className="text-green-400 font-bold">5 Hours/Week</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "20%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    />
                </div>
                <p className="text-xs text-gray-500">Only coaching, relationships, and motivation.</p>
            </div>
        </div>
    </div>
);

// 4. WhatsApp Automation Flow
const WhatsappAutomation = () => (
    <div className="my-12 p-8 bg-[#0F0F0F] rounded-3xl border border-white/10 text-center">
        <h4 className="text-xl font-bold text-white mb-10">How DailyFit AI Automates Coaching</h4>
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <div className="font-bold text-white">1. Plan Generation</div>
                    <div className="text-xs text-gray-500">AI builds workout</div>
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-blue-900 to-purple-900 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-purple-900/30 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400">
                    <Share2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <div className="font-bold text-white">2. WhatsApp Delivery</div>
                    <div className="text-xs text-gray-500">Sent at 6:00 AM</div>
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-purple-900 to-green-900 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-green-900/30 border border-green-500/30 rounded-2xl flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <div className="font-bold text-white">3. Client Logs</div>
                    <div className="text-xs text-gray-500">Photo or Text Reply</div>
                </div>
            </div>
            {/* Arrow */}
            <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-green-900 to-orange-900 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500"></div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-orange-900/30 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400">
                    <Facebook className="w-8 h-8" /> {/* Placeholder for 'Dashboard' icon */}
                </div>
                <div className="space-y-1">
                    <div className="font-bold text-white">4. Trainer Dashboard</div>
                    <div className="text-xs text-gray-500">See progress stats</div>
                </div>
            </div>

        </div>
    </div>
);

// 5. Comparison Table (Traditional vs AI)
const ComparisonTable = () => (
    <div className="my-12 p-6 md:p-8 bg-[#0F0F0F] rounded-3xl border border-white/10 overflow-hidden">
        <h4 className="text-center text-xl font-bold text-white mb-8">Traditional Gym vs. DailyFit AI Automation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Traditional Gym
                </div>
                <ul className="space-y-3">
                    {[
                        "Follow-up depends on trainer mood",
                        "Workouts explained once",
                        "Diet advice is generic PDF",
                        "Members confused by Week 3",
                        "High dropout rate (30-45 days)"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-500 text-sm">
                            <span className="text-red-900 mt-0.5">✕</span> {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* AI Automation */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> AI Automation
                </div>
                <ul className="space-y-3">
                    {[
                        "Daily automated WhatsApp nudges",
                        "Workouts delivered every morning",
                        "Personalized diet adjustments",
                        "Consistency tracked daily",
                        "Higher retention & engagement"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);


export default function BlogPostPage() {
    const params = useParams();
    const post = BLOG_POSTS.find(p => p.slug === params.slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
                    <Link href="/blog" className="text-blue-500 hover:underline">Return to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <LandingHeader />

            {/* SCHEMA MARKUP */}
            {post.seo.schemaData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(post.seo.schemaData) }}
                />
            )}


            {/* HERO HERO */}
            <section className={`pt-40 pb-20 relative overflow-hidden ${post.heroImage}`}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Link>

                    <div className="mb-6 flex items-center justify-center gap-4 text-sm font-medium">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{post.category}</span>
                        <span className="text-gray-300">{post.readTime}</span>
                        <span className="text-gray-300">{post.date}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xm">DF</div>
                        <div className="text-left">
                            <div className="font-bold text-white">{post.author}</div>
                            <div className="text-xs text-gray-400">Team Editor</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Render Content Blocks */}
                    {post.content.map((block, i) => {
                        if (block.type === 'header') return <h2 key={i} className="text-3xl font-bold text-white mt-12 mb-6">{block.text}</h2>;

                        if (block.type === 'paragraph') return <p key={i} className="text-lg text-gray-300 leading-relaxed">{block.text}</p>;

                        if (block.type === 'list') return (
                            <ul key={i} className="space-y-4 my-6 bg-zinc-900/30 p-8 rounded-3xl border border-white/5">
                                {block.items?.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-lg text-gray-300">
                                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        );

                        if (block.type === 'visual') {
                            if (block.visualType === 'retention-chart') return <RetentionChart key={i} />;
                            if (block.visualType === 'loop-cycle') return <LoopCycle key={i} />;
                            if (block.visualType === 'workload-chart') return <WorkloadChart key={i} />;
                            if (block.visualType === 'whatsapp-automation') return <WhatsappAutomation key={i} />;
                            if (block.visualType === 'comparison-table') return <ComparisonTable key={i} />;
                        }

                        return null;
                    })}

                    {/* Share / CTA Footer */}
                    <div className="pt-16 border-t border-white/10 mt-16">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h4 className="text-xl font-bold text-white">Ready to fix retention?</h4>
                                <p className="text-gray-400">Start your 14-day free trial of DailyFit AI.</p>
                            </div>
                            <Link href="/pricing" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                Start Free Trial
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
