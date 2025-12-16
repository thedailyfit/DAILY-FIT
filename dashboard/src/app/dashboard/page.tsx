"use client";

import { Button } from "@/components/ui/button";
import {
    Users,
    TrendingUp,
    Calendar,
    Activity,
    ArrowUpRight,
    MoreHorizontal,
    MessageSquare,
    Zap,
    CheckCircle2,
    AlertCircle,
    Dumbbell,
    Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TrainerDashboard() {
    return (
        <main className="min-h-screen bg-[#09090B] text-white p-8 font-sans selection:bg-[#CCFF00] selection:text-black">

            {/* 1. High-Impact Hero */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-[#CCFF00] font-mono text-sm tracking-wider uppercase mb-2">DailyFit Trainer OS</h2>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#AAFF00]">DOMINATE?</span>
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-lg">
                        You have <span className="text-white font-bold">5 active clients</span> waiting for updates today. Let's get to work.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-6">
                        <Calendar className="mr-2 h-4 w-4" /> Calendar
                    </Button>
                    <Button className="bg-[#CCFF00] hover:bg-[#bbe600] text-black font-bold rounded-full px-8 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all">
                        <Zap className="mr-2 h-4 w-4" /> Quick Action
                    </Button>
                </div>
            </header>

            {/* 2. Neon Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <NeonCard
                    title="TOTAL CLIENTS"
                    value="24"
                    trend="+12% vs last month"
                    icon={Users}
                />
                <NeonCard
                    title="WORKOUTS DONE"
                    value="142"
                    trend="High Engagement"
                    icon={Dumbbell}
                    highlight
                />
                <NeonCard
                    title="REVENUE (MRR)"
                    value="₹1.2L"
                    trend="On Track"
                    icon={Trophy}
                />
                <NeonCard
                    title="MESSAGES"
                    value="5"
                    trend="2 Unread Priority"
                    icon={MessageSquare}
                    alert
                />
            </div>

            {/* 3. Dashboard Core Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Client Leaderboard (Authenticity & Competition) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Activity className="h-5 w-5 text-[#CCFF00]" /> Client Leaderboard
                        </h3>
                        <Button variant="link" className="text-gray-400 hover:text-[#CCFF00]">View All Clients</Button>
                    </div>

                    <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-5 flex items-center gap-5 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer relative">
                                <span className="font-mono text-2xl font-bold text-gray-700 group-hover:text-[#CCFF00] transition-colors">0{i}</span>
                                <Avatar className="h-12 w-12 border-2 border-[#121214] ring-2 ring-white/10 group-hover:ring-[#CCFF00] transition-all">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} />
                                    <AvatarFallback>CL</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white group-hover:text-[#CCFF00] transition-colors">Sarah Jenkins</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#CCFF00]/10 text-[#CCFF00]">SHRED PHASE</span>
                                        <span className="text-xs text-gray-500">• Last active 2h ago</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-mono font-bold">98%</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Adherence</p>
                                </div>
                                <div className="w-1 h-8 bg-[#CCFF00] rounded-full absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions & Notes */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">Priority Feed</h3>

                    <div className="space-y-4">
                        <AlertBox
                            title="Plan Expiring Soon"
                            desc="Mike's plan expires in 48h. Renew?"
                            type="urgent"
                        />
                        <AlertBox
                            title="New Check-in"
                            desc="Jessica updated her weight log."
                            type="info"
                        />
                    </div>

                    <div className="bg-gradient-to-br from-[#1A1A1C] to-[#0A0A0A] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <h4 className="font-bold text-lg mb-2">Create New Program</h4>
                        <p className="text-sm text-gray-400 mb-6">Build a master training protocol combining diet, workouts & recovery.</p>
                        <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl">
                            Open Builder
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

// -- Components --

function NeonCard({ title, value, trend, icon: Icon, highlight, alert }: any) {
    return (
        <div className={`p-6 rounded-2xl border ${highlight ? 'bg-[#CCFF00] border-[#CCFF00] text-black' : 'bg-[#121214] border-white/5 text-white'} relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
            {alert && <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>}

            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${highlight ? 'bg-black/10' : 'bg-white/5'}`}>
                    <Icon className={`h-6 w-6 ${highlight ? 'text-black' : 'text-[#CCFF00]'}`} />
                </div>
                {highlight && <Zap className="h-12 w-12 text-black/5 absolute -right-2 -top-2 rotate-12" />}
            </div>

            <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${highlight ? 'text-black/60' : 'text-gray-500'}`}>{title}</p>
            <h3 className="text-3xl font-black mb-2">{value}</h3>
            <p className={`text-xs font-bold ${highlight ? 'text-black' : 'text-[#CCFF00]'}`}>
                {trend}
            </p>
        </div>
    )
}

function AlertBox({ title, desc, type }: any) {
    const isUrgent = type === 'urgent';
    return (
        <div className={`p-4 rounded-xl border ${isUrgent ? 'border-red-500/20 bg-red-500/5' : 'border-blue-500/20 bg-blue-500/5'} flex gap-4 items-center`}>
            <div className={`h-2 w-2 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div>
                <h4 className={`font-bold text-sm ${isUrgent ? 'text-red-400' : 'text-blue-400'}`}>{title}</h4>
                <p className="text-xs text-gray-400">{desc}</p>
            </div>
        </div>
    )
}
