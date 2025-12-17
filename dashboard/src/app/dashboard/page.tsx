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
    ClipboardCheck,
    Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function TrainerDashboard() {
    return (
        <main className="min-h-screen p-6 font-sans max-w-[1600px] mx-auto space-y-8">

            {/* 1. COMPACT HEADER */}
            <header className="flex justify-between items-center bg-[#09090B] border border-zinc-900/50 p-3 rounded-full sticky top-4 z-40 backdrop-blur-md bg-opacity-80 shadow-2xl">
                <div className="flex items-center gap-4 pl-4">
                    {/* Search - Compact */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" />
                        <Input
                            placeholder="Search..."
                            className="w-48 md:w-64 pl-10 h-10 bg-transparent border-none text-white placeholder:text-zinc-600 focus:ring-0"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                    <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white rounded-full hover:bg-white/10 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></span>
                    </Button>
                    <div className="h-8 w-[1px] bg-zinc-800 mx-1"></div>
                    <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">Coach Mike</p>
                            <p className="text-[10px] text-[#CCFF00]">Pro Trainer</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-[#CCFF00]/20">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* HERO SECTION */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                            READY TO <br />
                            <span className="text-[#CCFF00]">DOMINATE?</span>
                        </h1>
                        <p className="text-zinc-400 mt-3 font-medium text-lg">
                            You have <span className="text-white font-bold border-b border-[#CCFF00]">5 active clients</span> waiting.
                        </p>
                    </div>

                    {/* STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Highlight Card */}
                        <div className="col-span-1 md:col-span-2 p-6 rounded-[2rem] bg-[#CCFF00] text-black relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 shadow-[0_0_40px_rgba(204,255,0,0.15)] cursor-default">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="bg-black/10 w-fit p-2 rounded-lg mb-4">
                                        <Dumbbell className="h-5 w-5 text-black" />
                                    </div>
                                    <h3 className="text-5xl font-black tracking-tighter mb-1">142</h3>
                                    <p className="font-bold text-black/70 text-sm tracking-wide uppercase">Workouts Done</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">High Engagement 🔥</p>
                                    <p className="text-sm opacity-70">+12% vs last week</p>
                                </div>
                            </div>
                            <Dumbbell className="absolute -right-6 -bottom-6 h-40 w-40 text-black/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>

                        {/* Mini Stats */}
                        <div className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-zinc-900 group hover:border-[#CCFF00]/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <Users className="h-6 w-6 text-zinc-600 group-hover:text-[#CCFF00] transition-colors" />
                                <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded">TOTAL</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white">24</h3>
                            <p className="text-zinc-500 text-xs mt-1">Active Clients</p>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-zinc-900 group hover:border-[#CCFF00]/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <Trophy className="h-6 w-6 text-zinc-600 group-hover:text-[#CCFF00] transition-colors" />
                                <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded">MRR</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white">₹1.2L</h3>
                            <p className="text-zinc-500 text-xs mt-1">Revenue</p>
                        </div>
                    </div>

                    {/* LEADERBOARD */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-white text-lg">Client Performance</h3>
                            <Button variant="link" className="text-[#CCFF00] text-xs font-bold">VIEW ALL</Button>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0A0A] border border-zinc-900/50 hover:bg-[#111] hover:border-[#CCFF00]/30 transition-all group cursor-pointer">
                                    <span className="font-mono text-zinc-600 font-bold group-hover:text-[#CCFF00]">0{i}</span>
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 50}`} />
                                        <AvatarFallback>C{i}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-white group-hover:text-[#CCFF00] transition-colors">Client Name</h4>
                                        <p className="text-xs text-zinc-500">Last workout: Leg Day</p>
                                    </div>
                                    <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#CCFF00] w-[80%] shadow-[0_0_10px_#CCFF00]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Actions) */}
                <div className="space-y-8">

                    {/* QUICK ACTIONS SECTION (Stacked) */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 px-2">Quick Actions</h3>
                        <div className="flex flex-col gap-3">
                            {/* Create Program - Primary Neon */}
                            <Button className="h-16 rounded-2xl bg-[#CCFF00] hover:bg-[#bbf000] text-black font-bold text-lg justify-start px-6 relative overflow-hidden group shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all">
                                <Zap className="mr-3 h-5 w-5" />
                                Create Program
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                            </Button>

                            {/* Schedule - Secondary Dark */}
                            <Button variant="outline" className="h-16 rounded-2xl bg-[#0A0A0A] border-zinc-800 text-white font-bold text-lg justify-start px-6 hover:bg-[#111] hover:text-white hover:border-[#CCFF00] transition-all group">
                                <Calendar className="mr-3 h-5 w-5 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" />
                                Schedule Session
                            </Button>

                            {/* Broadcast - Secondary Dark */}
                            <Button variant="outline" className="h-16 rounded-2xl bg-[#0A0A0A] border-zinc-800 text-white font-bold text-lg justify-start px-6 hover:bg-[#111] hover:text-white hover:border-[#CCFF00] transition-all group">
                                <MessageSquare className="mr-3 h-5 w-5 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" />
                                Broadcast Message
                            </Button>
                        </div>
                    </div>

                    {/* PRIORITY FEED */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 px-2">Priority Feed</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-zinc-900 border-l-4 border-l-red-500 hover:bg-[#111] transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4 text-red-500" />
                                    <span className="text-red-400 font-bold text-xs uppercase">Expiring Soon</span>
                                </div>
                                <p className="text-sm font-medium text-white">Mike's Plan expires in 24h.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-zinc-900 border-l-4 border-l-blue-500 hover:bg-[#111] transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <ClipboardCheck className="h-4 w-4 text-blue-500" />
                                    <span className="text-blue-400 font-bold text-xs uppercase">Check In</span>
                                </div>
                                <p className="text-sm font-medium text-white">Sarah updated progress photos.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
