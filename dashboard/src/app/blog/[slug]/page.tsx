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
