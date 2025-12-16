"use client";

import { Button } from "@/components/ui/button";
import {
    Users,
    Calendar,
    Activity,
    ArrowUpRight,
    MessageSquare,
    Zap,
    Dumbbell,
    Trophy,
    Search,
    Bell
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function TrainerDashboard() {
    return (
        <main className="min-h-screen text-white p-8 font-sans">

            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search clients, plans, or messages..."
                        className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-lime-400 rounded-full"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-white">Coach Mike</p>
                            <p className="text-xs text-lime-400">Pro Trainer</p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-zinc-800">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Hero Text */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                    DASHBOARD
                </h1>
                <div className="h-1 w-20 bg-lime-400 rounded-full"></div>
            </div>

            {/* Stats Grid - implementing the specific designs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Standard Dark Card */}
                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 rounded-2xl bg-zinc-800 text-white group-hover:bg-zinc-700 transition-colors">
                            <Users className="h-6 w-6" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Active Clients</p>
                        <h3 className="text-4xl font-black text-white">24</h3>
                    </div>
                </div>

                {/* THE HIGHLIGHT CARD - Matches User Screenshot */}
                <div className="p-6 rounded-[2rem] bg-[#CCFF00] text-black relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_40px_rgba(204,255,0,0.15)]">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Dumbbell className="h-32 w-32 rotate-12" />
                    </div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-3 rounded-2xl bg-black/10 text-black">
                            <Dumbbell className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-black/60 text-xs font-black tracking-widest uppercase mb-1">WORKOUTS DONE</p>
                        <h3 className="text-4xl font-black text-black tracking-tight">142</h3>
                        <p className="text-sm font-bold mt-1 text-black">High Engagement</p>
                    </div>
                </div>

                {/* Standard Dark Card */}
                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 rounded-2xl bg-zinc-800 text-white group-hover:bg-zinc-700 transition-colors">
                            <Trophy className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Revenue MRR</p>
                        <h3 className="text-4xl font-black text-white">₹1.2L</h3>
                    </div>
                </div>

                {/* Alert Card */}
                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group relative">
                    <div className="absolute top-6 right-6 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 rounded-2xl bg-zinc-800 text-white group-hover:bg-zinc-700 transition-colors">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Messages</p>
                        <h3 className="text-4xl font-black text-white">5</h3>
                        <p className="text-xs text-zinc-400 mt-1">2 Urgent</p>
                    </div>
                </div>
            </div>

            {/* Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold">Client Performance</h3>
                        <Button variant="link" className="text-lime-400">View All</Button>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] p-4 space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-zinc-800/50 rounded-2xl transition-colors group cursor-pointer">
                                <span className="font-mono text-zinc-600 font-bold text-xl group-hover:text-lime-400 transition-colors">0{i}</span>
                                <Avatar className="h-12 w-12 border border-zinc-700">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 20}`} />
                                    <AvatarFallback>CL</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                    <p className="text-xs text-zinc-500">Last workout: Leg Day (High Volume)</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-white font-bold">98%</p>
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Adherence</p>
                                    </div>
                                    <Activity className="h-5 w-5 text-zinc-600 group-hover:text-lime-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold">Quick Actions</h3>
                    </div>
                    <div className="grid gap-4">
                        <Button className="h-auto py-6 bg-lime-400 hover:bg-lime-500 text-black font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.2)] justify-start px-6">
                            <Zap className="mr-3 h-6 w-6" />
                            Create Program
                        </Button>
                        <Button variant="outline" className="h-auto py-6 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white font-bold text-lg rounded-2xl justify-start px-6">
                            <Calendar className="mr-3 h-6 w-6" />
                            Schedule Session
                        </Button>
                        <Button variant="outline" className="h-auto py-6 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white font-bold text-lg rounded-2xl justify-start px-6">
                            <MessageSquare className="mr-3 h-6 w-6" />
                            Broadcast Message
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
