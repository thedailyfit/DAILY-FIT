"use client";

import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ArrowRight, Calendar, Clock, User, TrendingUp, Zap, BrainCircuit, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import Image from "next/image";

const getPostIcon = (category: string) => {
    let src = "/blog-thumbs/real-growth.png"; // Default
    if (category.includes("Retention")) src = "/blog-thumbs/real-retention.png";
    if (category.includes("Productivity")) src = "/blog-thumbs/real-ai.png"; // Trainer Image
    if (category.includes("AI")) src = "/blog-thumbs/real-tech.png"; // New Tech Image
    if (category.includes("WhatsApp")) src = "/blog-thumbs/real-whatsapp.png";
    if (category.includes("Marketing")) src = "/blog-thumbs/real-whatsapp.png";
    if (category.includes("Software")) src = "/blog-thumbs/real-software.png"; // Unique Software Image

    return (
        <Image
            src={src}
            alt={category}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
        />
    );
};

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <LandingHeader />

            {/* HEADER */}
            <section className="pt-32 pb-20 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        DailyFit AI Insights
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Strategies for the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Future of Fitness</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Deep dives into gym retention, AI automation, and building habit-forming fitness businesses.
                    </p>
                </motion.div>
            </section>

            {/* BLOG GRID */}
            <section className="pb-32 container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {BLOG_POSTS.map((post, i) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="group block h-full">
                                <article className="h-full bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                                    {/* Image Placeholder / Gradient */}
                                    {/* Image Placeholder / Gradient */}
                                    <div className="h-64 w-full relative overflow-hidden">
                                        {/* Full Cover Image */}
                                        {getPostIcon(post.category)}

                                        {/* Gradient Overlay for Text Readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                        </div>

                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center text-blue-500 font-bold text-sm">
                                            Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
