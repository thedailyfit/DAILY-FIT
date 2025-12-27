"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck, TrendingUp, Dumbbell, Utensils, Zap, Activity, Trophy } from "lucide-react";
import Image from "next/image";

const WhatsappBubble = ({ isUser, message, time, isImage = false, delay }: { isUser: boolean, message: React.ReactNode, time: string, isImage?: boolean, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay }}
        className={`flex flex-col mb-4 ${isUser ? "items-end" : "items-start"}`}
    >
        <div className={`max-w-[85%] rounded-lg p-3 relative shadow-sm ${isUser ? "bg-[#005c4b] text-[#e9edef]" : "bg-[#202c33] text-[#e9edef]"}`}>
            {!isImage ? (
                <div className="text-sm leading-relaxed">{message}</div>
            ) : (
                <div className="rounded-md overflow-hidden bg-black/20">
                    {message}
                </div>
            )}
            <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-400">{time}</span>
                {isUser && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
            </div>
        </div>
    </motion.div>
);

export function FeatureShowcase() {
    return (
        <section className="py-24 container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Your entire gym, inside <span className="text-green-500">WhatsApp</span>.</h2>
                <p className="text-gray-400 text-lg">No new apps to download. It just works.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {/* CARD 1: DAILY PLAN */}
                <div className="bg-[#111b21] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-[#00a884]/30 transition-all duration-300 shadow-2xl">
                    {/* Header with Gym Logo */}
                    <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#2a3942]">
                        {/* Mimic Gold's Gym Logo with generic assets if needed, or stick to consistent icon style */}
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black shadow-md border-2 border-yellow-600">
                            <Dumbbell className="w-6 h-6 fill-black" />
                        </div>
                        <div>
                            <div className="font-semibold text-white">Gold's Gym Venice</div>
                            <div className="text-xs text-[#00a884] font-medium">online</div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="p-4 flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d706cded50.png')] bg-repeat bg-opacity-5">
                        <WhatsappBubble isUser={true} time="06:30 AM" message="Start today's plan" delay={0.2} />
                        <WhatsappBubble isUser={false} time="06:30 AM" delay={1.5} message={
                            <div className="space-y-2">
                                <p className="font-bold text-[#e9edef] mb-1">🚀 Day 14: Pull Day</p>
                                <div className="p-2 bg-white/5 rounded flex items-center gap-2 border border-white/5">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs">Deadlifts: 3 x 8 (140kg)</span>
                                </div>
                                <div className="p-2 bg-white/5 rounded flex items-center gap-2 border border-white/5">
                                    <Utensils className="w-4 h-4 text-orange-400" />
                                    <span className="text-xs">Breakfast: Oats + 2 Scoops Whey</span>
                                </div>
                            </div>
                        } />
                    </div>
                    <div className="p-6 bg-[#111b21] border-t border-[#202c33] z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Instant Routines</h3>
                        <p className="text-gray-400 text-sm">Clients get their personalized workout & meal plans delivered instantly every morning.</p>
                    </div>
                </div>

                {/* CARD 2: FEE REMINDER */}
                <div className="bg-[#111b21] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-[#00a884]/30 transition-all duration-300 shadow-2xl">
                    <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#2a3942]">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-md border-2 border-red-700">
                            <Zap className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-white">MetroFlex London</div>
                            <div className="text-xs text-[#00a884] font-medium">online</div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d706cded50.png')] bg-repeat bg-opacity-5">
                        <WhatsappBubble isUser={false} time="10:00 AM" delay={0.5} message={
                            <div>
                                <span>👋 Hi James, your membership expires in <b>3 days</b>.</span>
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
                                    <span className="text-red-400 text-xs font-bold uppercase">Due: £45.00</span>
                                </div>
                            </div>
                        } />
                        <WhatsappBubble isUser={true} time="10:05 AM" message="Paid via Card. Check pls." delay={2.5} />
                        <WhatsappBubble isUser={false} time="10:06 AM" delay={4} message={
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>Payment Verified! Receipt #992 generated.</span>
                            </div>
                        } />
                    </div>
                    <div className="p-6 bg-[#111b21] border-t border-[#202c33] z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Automated Collections</h3>
                        <p className="text-gray-400 text-sm">Stop chasing payments. The AI reminds members and generates receipts automatically.</p>
                    </div>
                </div>

                {/* CARD 3: REALISTIC DASHBOARD GRAPH */}
                <div className="bg-[#0f1115] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-300 shadow-2xl">
                    {/* Dark Dashboard Header */}
                    <div className="bg-[#181b21] p-4 flex items-center justify-between border-b border-[#262a33]">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white text-sm">Performance</div>
                                <div className="text-[10px] text-gray-500">Last 30 Days</div>
                            </div>
                        </div>
                        <div className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </div>
                    </div>

                    {/* Realistic Graph Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#0f1115] to-[#0a0c10]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Total Active Clients</div>
                                <div className="text-3xl font-bold text-white flex items-end gap-2">
                                    1,248 <span className="text-sm font-medium text-green-500 mb-1">+12%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-500 text-xs mb-1">Retention Rate</div>
                                <div className="text-xl font-bold text-white">96.4%</div>
                            </div>
                        </div>

                        {/* SVG Area Chart */}
                        <div className="relative h-40 w-full">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                <line x1="0" y1="10" x2="100" y2="10" stroke="#333" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2" />
                                <line x1="0" y1="20" x2="100" y2="20" stroke="#333" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2" />
                                <line x1="0" y1="30" x2="100" y2="30" stroke="#333" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2" />

                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,35 C10,35 15,30 25,25 C35,20 40,28 50,15 C60,2 65,10 75,12 C85,14 90,5 100,2"
                                    fill="url(#gradient)"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    d="M0,35 C10,35 15,30 25,25 C35,20 40,28 50,15 C60,2 65,10 75,12 C85,14 90,5 100,2"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="1.5"
                                />

                                {/* Points */}
                                <motion.circle cx="25" cy="25" r="1.5" fill="#60a5fa" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                                <motion.circle cx="50" cy="15" r="1.5" fill="#60a5fa" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.0 }} />
                                <motion.circle cx="100" cy="2" r="2" fill="#fff" stroke="#3b82f6" strokeWidth="1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                            </svg>

                            {/* Tooltip Mockup */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.8 }}
                                className="absolute -top-6 right-0 bg-[#2d3748] border border-white/10 px-2 py-1 rounded text-[10px] text-white shadow-lg"
                            >
                                All Time High 🚀
                            </motion.div>
                        </div>

                        <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                            <span>Jan 1</span>
                            <span>Today</span>
                        </div>
                    </div>

                    <div className="p-6 bg-[#0f1115] border-t border-[#202c33] z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Owner Analytics</h3>
                        <p className="text-gray-400 text-sm">Visualize client retention, revenue, and active members in real-time. No spreadsheets.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
