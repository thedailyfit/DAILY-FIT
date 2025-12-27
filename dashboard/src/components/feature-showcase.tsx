"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck, TrendingUp, Dumbbell, Utensils } from "lucide-react";

const WhatsappBubble = ({ isUser, message, time, isImage = false }: { isUser: boolean, message: React.ReactNode, time: string, isImage?: boolean }) => (
    <div className={`flex flex-col mb-4 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`max-w-[85%] rounded-lg p-3 relative ${isUser ? "bg-[#005c4b] text-[#e9edef]" : "bg-[#202c33] text-[#e9edef]"}`}>
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
    </div>
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
                <div className="bg-[#111b21] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-[#00a884]/30 transition-all duration-300">
                    {/* WhatsApp Header Mockup */}
                    <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#2a3942]">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">AI</div>
                        <div>
                            <div className="font-semibold text-white">DailyFit Coach</div>
                            <div className="text-xs text-[#00a884] font-medium">online</div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="p-4 flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d706cded50.png')] bg-repeat bg-opacity-5">
                        <WhatsappBubble isUser={true} time="06:30 AM" message="Start today's plan" />
                        <WhatsappBubble isUser={false} time="06:30 AM" message={
                            <div className="space-y-2">
                                <p className="font-bold text-[#e9edef] mb-1">🚀 Day 14: Pull Day</p>
                                <div className="p-2 bg-white/5 rounded flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs">Deadlifts: 3 x 8 (100kg)</span>
                                </div>
                                <div className="p-2 bg-white/5 rounded flex items-center gap-2">
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
                <div className="bg-[#111b21] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-[#00a884]/30 transition-all duration-300">
                    <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#2a3942]">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">AI</div>
                        <div>
                            <div className="font-semibold text-white">DailyFit Billing</div>
                            <div className="text-xs text-[#00a884] font-medium">online</div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d706cded50.png')] bg-repeat bg-opacity-5">
                        <WhatsappBubble isUser={false} time="10:00 AM" message={
                            <div>
                                <span>👋 Hi Rahul, your membership expires in <b>3 days</b>.</span>
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
                                    <span className="text-red-400 text-xs font-bold">Due: ₹5,000</span>
                                </div>
                            </div>
                        } />
                        <WhatsappBubble isUser={true} time="10:05 AM" message="Paid via UPI. Screenshot sent." />
                        <WhatsappBubble isUser={false} time="10:06 AM" message={
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

                {/* CARD 3: DASHBOARD GRAPH */}
                <div className="bg-[#0b141a] rounded-[30px] border border-[#202c33] overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-300">
                    {/* Dark Dashboard Header */}
                    <div className="bg-[#202c33] p-4 flex items-center justify-between border-b border-[#2a3942]">
                        <div className="font-semibold text-white">Client Performance</div>
                        <div className="text-xs bg-blue-600 px-2 py-1 rounded text-white">Live</div>
                    </div>

                    {/* Graph Area */}
                    <div className="p-6 flex-1 flex flex-col justify-center relative">
                        <div className="absolute inset-0 bg-blue-500/5" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="text-gray-400 text-xs text-left">Squat PR</div>
                                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                                        140kg <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-xs">Body Weight</div>
                                    <div className="text-xl font-bold text-white">72kg <span className="text-xs text-red-400 font-normal">(-2kg)</span></div>
                                </div>
                            </div>

                            {/* CSS Graph */}
                            <div className="h-32 flex items-end justify-between gap-2 mt-4">
                                {[30, 45, 40, 60, 55, 75, 80, 90].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-900/40 rounded-t relative group overflow-hidden">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="w-full absolute bottom-0 bg-blue-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                                <span>Week 1</span>
                                <span>Week 8</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-[#0b141a] border-t border-[#202c33] z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Trainer Dashboard</h3>
                        <p className="text-gray-400 text-sm">Visualize client progress with zero manual data entry. Track PRs, weight, and consistency.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
