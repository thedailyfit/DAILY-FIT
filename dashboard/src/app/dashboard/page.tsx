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
        <main className="min-h-screen p-6 font-sans max-w-[1600px] mx-auto space-y-6">

            {/* 1. FLOATING HEADER */}
            <header className="flex justify-between items-center bg-white/80 border border-white/50 p-3 rounded-2xl sticky top-4 z-40 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-4 pl-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" />
                        <Input
                            placeholder="Search client, program..."
                            className="w-48 md:w-64 pl-10 h-10 bg-transparent border-none text-black placeholder:text-zinc-400 focus:ring-0"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                    <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-black rounded-full hover:bg-black/5 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#cbfe00] rounded-full animate-pulse border border-white"></span>
                    </Button>
                    <div className="h-8 w-[1px] bg-zinc-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-black">Coach Mike</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Pro Trainer</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* 2. MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

                {/* LEFT COLUMN: HERO & STATS (Span 8) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* HERO CARD - BLACK */}
                    <div className="p-8 rounded-[2rem] bg-[#212121] text-white relative overflow-hidden group hover:shadow-[0_10px_40px_rgba(33,33,33,0.3)] transition-all duration-500">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                                    READY TO <br />
                                    <span className="text-[#cbfe00]">DOMINATE?</span>
                                </h1>
                                <p className="text-zinc-400 font-medium text-lg flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#cbfe00] animate-pulse"></span>
                                    5 active clients waiting for check-in.
                                </p>
                            </div>
                            {/* Removed 'Review it' button as per user request */}
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#cbfe00]/5 to-transparent pointer-events-none"></div>
                    </div>

                    {/* STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Highlights: Black Block with Neon Text */}
                        <div className="md:col-span-2 p-6 rounded-[2rem] bg-[#212121] text-white relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 shadow-xl cursor-default border border-zinc-800 hover:border-[#cbfe00]/30 mr-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="bg-[#cbfe00]/10 w-fit p-2 rounded-lg mb-4">
                                        <Dumbbell className="h-5 w-5 text-[#cbfe00]" />
                                    </div>
                                    <h3 className="text-5xl font-black tracking-tighter mb-1 text-[#cbfe00]">142</h3>
                                    <p className="font-bold text-zinc-400 text-sm tracking-wide uppercase">Workouts Done</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg flex items-center gap-1 justify-end text-[#cbfe00]">
                                        <Activity className="h-4 w-4" /> +12%
                                    </p>
                                    <p className="text-sm opacity-70">vs last week</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue: Black Block */}
                        <div className="p-6 rounded-[2rem] bg-[#212121] text-white border border-zinc-800 hover:border-[#cbfe00] transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <Trophy className="h-6 w-6 text-zinc-600 group-hover:text-[#cbfe00] transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">MRR</span>
                            </div>
                            <h3 className="text-3xl font-bold">₹1.2L</h3>
                            <p className="text-zinc-500 text-xs mt-1">Total Revenue</p>
                        </div>
                    </div>

                    {/* CLIENT LEADERBOARD - BLACK BLOCK */}
                    <div className="p-6 rounded-[2rem] bg-[#212121] border border-zinc-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#cbfe00]" /> Client Performance
                            </h3>
                            <Button variant="link" className="text-zinc-400 hover:text-white text-xs font-bold">VIEW ALL</Button>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#cbfe00]/30 transition-all group cursor-pointer">
                                    <span className="font-mono text-zinc-600 font-bold group-hover:text-[#cbfe00]">0{i}</span>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 50}`} />
                                        <AvatarFallback>C{i}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-white group-hover:text-[#cbfe00] transition-colors">Client Name</h4>
                                        <p className="text-xs text-zinc-500">Last workout: Leg Day</p>
                                    </div>
                                    <div className="w-24 h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                                        <div className="h-full bg-[#cbfe00] w-[80%] shadow-[0_0_10px_#cbfe00]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: ACTIONS (Span 4) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* QUICK ACTIONS STACK */}
                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm">
                        <h3 className="font-black text-[#212121] text-lg mb-4 uppercase tracking-tight">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button className="w-full h-14 rounded-xl bg-[#212121] hover:bg-black text-white font-bold text-base justify-between px-6 group shadow-lg hover:shadow-xl transition-all">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#cbfe00] flex items-center justify-center text-[#212121]">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    Create Program
                                </span>
                                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-[#cbfe00]" />
                            </Button>

                            <Button variant="outline" className="w-full h-14 rounded-xl border-zinc-200 hover:border-[#212121] hover:bg-zinc-50 text-[#212121] font-bold text-base justify-between px-6 group transition-all">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-[#212121]">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    Schedule Session
                                </span>
                            </Button>

                            <Button variant="outline" className="w-full h-14 rounded-xl border-zinc-200 hover:border-[#212121] hover:bg-zinc-50 text-[#212121] font-bold text-base justify-between px-6 group transition-all">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-[#212121]">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    Broadcast Message
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* PRIORITY FEED */}
                    <div className="p-6 rounded-[2rem] bg-[#212121] text-white border border-zinc-800 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg">Priority Feed</h3>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        </div>
                        <div className="space-y-4">
                            {/* Alert Item */}
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/50 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-red-400 mb-1">Plan Expiring</p>
                                        <p className="text-xs text-zinc-300">Mike's "Hypertrophy A" ends in 24h.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Check-in Item */}
                            <div className="p-4 rounded-xl bg-[#cbfe00]/5 border border-[#cbfe00]/20 hover:border-[#cbfe00]/50 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <ClipboardCheck className="h-5 w-5 text-[#cbfe00] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-[#cbfe00] mb-1">New Check-in</p>
                                        <p className="text-xs text-zinc-300">Sarah updated progress photos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
