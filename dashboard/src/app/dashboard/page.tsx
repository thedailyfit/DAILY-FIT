"use client";

import { Button } from "@/components/ui/button";
import {
    Users,
    Calendar,
    Activity,
    MessageSquare,
    Zap,
    Dumbbell,
    Trophy,
    Search,
    Bell,
    Clock,
    ChevronRight,
    AlertTriangle,
    CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function TrainerDashboard() {
    return (
        <main className="min-h-screen p-6 md:p-10 font-sans max-w-[1600px] mx-auto">

            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-12">
                <div className="hidden md:block">
                    <p className="text-zinc-500 text-sm">Welcome back,</p>
                    <h2 className="text-white font-bold text-xl">Trainer Account</h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search..."
                            className="w-64 pl-10 bg-[#111] border-zinc-800 text-white placeholder:text-zinc-600 rounded-full focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition-all"
                        />
                    </div>
                    <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white rounded-full bg-[#111] hover:bg-[#222]">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <div className="h-10 w-10 bg-[#CCFF00] rounded-full flex items-center justify-center text-black font-bold">
                        TR
                    </div>
                </div>
            </div>

            {/* HERO SECTION - "READY TO DOMINATE" */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h2 className="text-[#CCFF00] text-sm font-bold tracking-widest uppercase mb-2">DailyFit Trainer OS</h2>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                        READY TO <br />
                        <span className="text-[#CCFF00]">DOMINATE?</span>
                    </h1>
                    <p className="text-zinc-400 mt-4 text-lg">
                        You have <span className="text-white font-bold">5 active clients</span> waiting for updates today.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 px-6 rounded-full border-zinc-700 bg-transparent text-white hover:bg-white hover:text-black font-medium transition-all">
                        <Calendar className="mr-2 h-4 w-4" /> Calendar
                    </Button>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                {/* 1. Dark Minimal Card */}
                <StatsCard
                    title="Total Clients"
                    value="24"
                    sub="+12% vs last month"
                    icon={Users}
                />

                {/* 2. THE HIGHLIGHT CARD (Neon Green) */}
                <div className="p-8 rounded-[2rem] bg-[#CCFF00] text-black relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_50px_rgba(204,255,0,0.1)]">
                    <div className="absolute top-4 right-4 p-2 bg-black/10 rounded-xl">
                        <Dumbbell className="h-6 w-6 text-black" />
                    </div>
                    <div className="mt-8">
                        <p className="text-black/70 text-xs font-black tracking-widest uppercase mb-1">WORKOUTS DONE</p>
                        <h3 className="text-5xl font-black text-black tracking-tight mb-2">142</h3>
                        <p className="text-sm font-bold text-black flex items-center gap-1">
                            High Engagement
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <Dumbbell className="absolute -bottom-4 -right-4 h-32 w-32 text-black/5 rotate-12" />
                </div>

                {/* 3. Dark Minimal Card */}
                <StatsCard
                    title="Revenue (MRR)"
                    value="₹1.2L"
                    sub="On Track"
                    icon={Trophy}
                />

                {/* 4. Dark Minimal Card with Alert */}
                <StatsCard
                    title="Messages"
                    value="5"
                    sub="2 Unread Priority"
                    icon={MessageSquare}
                    alert
                />
            </div>

            {/* LOWER SECTION: Priority Feed & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Client Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-[#CCFF00]" /> Client Leaderboard
                        </h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-zinc-900 rounded-[2rem] p-2 space-y-1">
                        {[
                            { name: "Sarah Jenkins", phase: "Shred Phase", score: 98, img: 1 },
                            { name: "Mike Ross", phase: "Hypertrophy", score: 92, img: 2 },
                            { name: "Jessica Pearson", phase: "Maintenance", score: 89, img: 3 },
                            { name: "Harvey Specter", phase: "Strength", score: 85, img: 4 },
                        ].map((client, i) => (
                            <div key={i} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-[#111] transition-all cursor-pointer border border-transparent hover:border-zinc-800">
                                <span className="font-mono text-zinc-600 font-bold text-xl group-hover:text-[#CCFF00] transition-colors">0{i + 1}</span>
                                <Avatar className="h-12 w-12 border border-zinc-800">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${client.img + 20}`} />
                                    <AvatarFallback>{client.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white group-hover:text-[#CCFF00] transition-colors">{client.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold text-black bg-zinc-700 px-2 py-0.5 rounded group-hover:bg-[#CCFF00] transition-colors">{client.phase}</span>
                                        <span className="text-xs text-zinc-500">• Last active 2h ago</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-mono font-bold">{client.score}%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Adherence</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Priority Feed (Restored Feature) */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Priority Feed</h3>

                    <div className="space-y-4">
                        {/* Plan Expiring Card */}
                        <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-zinc-900 hover:border-red-900/50 transition-colors group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-400 text-sm mb-1">Plan Expiring Soon</h4>
                                    <p className="text-zinc-400 text-sm">Mike's plan expires in <span className="text-white font-bold">48h</span>. Send renewal reminder?</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs uppercase tracking-wide border border-zinc-800">
                                Renew Plan
                            </Button>
                        </div>

                        {/* New Check-in Card */}
                        <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-zinc-900 hover:border-blue-900/50 transition-colors group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <ClipboardCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-400 text-sm mb-1">New Check-in</h4>
                                    <p className="text-zinc-400 text-sm">Jessica updated her weight log and progress photos.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs uppercase tracking-wide border border-zinc-800">
                                Review Progress
                            </Button>
                        </div>
                    </div>

                    {/* Create Program CTA */}
                    <div className="bg-[#111] p-6 rounded-[2rem] border border-zinc-800 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#CCFF00]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap className="h-8 w-8 text-[#CCFF00] mx-auto mb-3" />
                        <h4 className="font-bold text-white text-lg">Create Master Program</h4>
                        <p className="text-zinc-500 text-sm mb-4">Combine diet, workouts & recovery.</p>
                        <Button className="w-full bg-[#CCFF00] hover:bg-[#b3e600] text-black font-bold rounded-xl">
                            Open Builder
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Minimal Stats Card Component
function StatsCard({ title, value, sub, icon: Icon, alert }: any) {
    return (
        <div className="p-8 rounded-[2rem] bg-[#0A0A0A] border border-zinc-900 hover:border-[#CCFF00]/50 transition-all duration-300 group relative">
            {alert && <div className="absolute top-8 right-8 h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>}

            <div className="bg-[#111] w-10 h-10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#CCFF00] transition-colors duration-300">
                <Icon className="h-5 w-5 text-zinc-400 group-hover:text-black transition-colors duration-300" />
            </div>

            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1 group-hover:text-[#CCFF00] transition-colors">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tight mb-2">{value}</h3>
            <p className="text-sm font-medium text-zinc-400 flex items-center gap-1">
                {sub}
            </p>
        </div>
    )
}

function ClipboardCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
    )
}
