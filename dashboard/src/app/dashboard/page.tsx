"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    Plus,
    UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TrainerDashboard() {
    const [loading, setLoading] = useState(true);
    const [trainerName, setTrainerName] = useState("");
    const [stats, setStats] = useState({
        clientCount: 0,
        workoutsDone: 0,
        revenue: 0,
        activeClients: 0
    });
    const [recentClients, setRecentClients] = useState<any[]>([]);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function loadDashboardData() {
            try {
                // 1. Get User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                // 2. Get Trainer Profile
                const { data: trainer } = await supabase
                    .from('trainers')
                    .select('full_name, name')
                    .eq('id', user.id)
                    .single();

                if (trainer) {
                    setTrainerName(trainer.full_name || trainer.name || "Coach");
                }

                // 3. Get Clients Count (Mocking real counts for now since tables might differ, but logic is ready)
                // In a real launch, we would query the 'clients' table linked to this trainer.
                // Assuming 'clients' table exists:
                const { count: clientCount } = await supabase
                    .from('clients')
                    .select('*', { count: 'exact', head: true })
                    .eq('trainer_id', user.id); // Adjust column name if needed

                setStats(prev => ({ ...prev, clientCount: clientCount || 0 }));

                // Stop loading
                setLoading(false);

            } catch (error) {
                console.error("Dashboard load error:", error);
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [router, supabase]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]"><div className="animate-pulse flex flex-col items-center"><Dumbbell className="h-10 w-10 text-zinc-400 animate-spin mb-4" /><p className="text-zinc-500 font-medium">Loading Dashboard...</p></div></div>;
    }

    const hasClients = stats.clientCount > 0;

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
                        {/* Notification Dot - Only show if real notifications exist (hidden for launch clean state) */}
                        {/* <span className="absolute top-2 right-2 w-2 h-2 bg-[#cbfe00] rounded-full animate-pulse border border-white"></span> */}
                    </Button>
                    <div className="h-8 w-[1px] bg-zinc-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-black">{trainerName}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Trainer</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${trainerName}&background=0D8ABC&color=fff`} />
                            <AvatarFallback>{trainerName.charAt(0)}</AvatarFallback>
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
                                    {hasClients ? "READY TO" : "WELCOME"} <br />
                                    <span className="text-[#cbfe00]">{hasClients ? "DOMINATE?" : "ABOARD!"}</span>
                                </h1>
                                <p className="text-zinc-400 font-medium text-lg flex items-center gap-2">
                                    {hasClients ? (
                                        <>
                                            <span className="w-2 h-2 rounded-full bg-[#cbfe00] animate-pulse"></span>
                                            {stats.activeClients} active clients waiting for check-in.
                                        </>
                                    ) : (
                                        "Let's set up your digital fitness business."
                                    )}
                                </p>
                            </div>
                            {!hasClients && (
                                <Link href="/dashboard/clients">
                                    <Button className="bg-[#cbfe00] text-black hover:bg-white font-bold rounded-xl">
                                        <UserPlus className="mr-2 h-4 w-4" /> Add First Client
                                    </Button>
                                </Link>
                            )}
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
                                    <h3 className="text-5xl font-black tracking-tighter mb-1 text-[#cbfe00]">{stats.workoutsDone}</h3>
                                    <p className="font-bold text-zinc-400 text-sm tracking-wide uppercase">Workouts Done</p>
                                </div>
                                {hasClients && (
                                    <div className="text-right">
                                        <p className="font-bold text-lg flex items-center gap-1 justify-end text-[#cbfe00]">
                                            <Activity className="h-4 w-4" /> --
                                        </p>
                                        <p className="text-sm opacity-70">Analytics pending</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Revenue: Black Block */}
                        <div className="p-6 rounded-[2rem] bg-[#212121] text-white border border-zinc-800 hover:border-[#cbfe00] transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <Trophy className="h-6 w-6 text-zinc-600 group-hover:text-[#cbfe00] transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">MRR</span>
                            </div>
                            <h3 className="text-3xl font-bold">₹{stats.revenue}</h3>
                            <p className="text-zinc-500 text-xs mt-1">Total Revenue</p>
                        </div>
                    </div>

                    {/* CLIENT LEADERBOARD - BLACK BLOCK */}
                    <div className="p-6 rounded-[2rem] bg-[#212121] border border-zinc-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#cbfe00]" /> Client Performance
                            </h3>
                            {hasClients && <Link href="/dashboard/clients"><Button variant="link" className="text-zinc-400 hover:text-white text-xs font-bold">VIEW DIRECTORY</Button></Link>}
                        </div>

                        {stats.clientCount > 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                                <div className="bg-zinc-800/50 p-4 rounded-full mb-3">
                                    <Activity className="h-6 w-6 text-[#cbfe00]" />
                                </div>
                                <p className="text-sm font-medium text-white">Analytics Active</p>
                                <p className="text-xs text-zinc-500 max-w-[200px] text-center mt-1">
                                    Performance usage data will appear here as your clients complete workouts.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-zinc-500">
                                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No clients active yet.</p>
                                <Link href="/dashboard/clients" className="text-[#cbfe00] text-xs hover:underline mt-2 inline-block">
                                    + Invite your first client
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN: ACTIONS (Span 4) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* QUICK ACTIONS STACK */}
                    <div className="p-6 rounded-[2rem] bg-[#212121] border border-zinc-800 shadow-sm">
                        <h3 className="font-black text-white text-lg mb-4 uppercase tracking-tight">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/dashboard/programs/builder" className="block w-full">
                                <Button className="w-full h-16 rounded-xl bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-black text-base justify-between px-6 group shadow-[0_0_20px_rgba(203,254,0,0.2)] hover:shadow-[0_0_30px_rgba(203,254,0,0.4)] transition-all border-none">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center text-black">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <span className="tracking-tight">CREATE PROGRAM</span>
                                    </span>
                                    <ChevronRight className="h-5 w-5 text-black/50 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Link href="/dashboard/clients" className="block w-full">
                                <Button variant="outline" className="w-full h-14 rounded-xl border-zinc-700 bg-[#2a2a2a] hover:bg-[#333] hover:border-zinc-500 text-white font-bold text-base justify-between px-6 group transition-all">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-zinc-400 group-hover:text-white">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        Schedule Session
                                    </span>
                                </Button>
                            </Link>

                            <Link href="/dashboard/chat" className="block w-full">
                                <Button variant="outline" className="w-full h-14 rounded-xl border-zinc-700 bg-[#2a2a2a] hover:bg-[#333] hover:border-zinc-500 text-white font-bold text-base justify-between px-6 group transition-all">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-zinc-400 group-hover:text-white">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        Broadcast Message
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* PRIORITY FEED */}
                    <div className="p-6 rounded-[2rem] bg-[#212121] text-white border border-zinc-800 h-fit min-h-[300px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg">Priority Feed</h3>
                            {hasClients && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                        </div>

                        {hasClients ? (
                            <div className="space-y-4">
                                {/* Only show if we actually have feed items. For now, empty state is safer for launch. */}
                                <div className="flex flex-col items-center justify-center h-48 text-zinc-600">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                                        <ClipboardCheck className="h-6 w-6 opacity-30" />
                                    </div>
                                    <p className="text-sm">All caught up!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-600">
                                <Bell className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">No notifications yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
