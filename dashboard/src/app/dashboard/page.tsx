"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
    CheckCircle,
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
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({
        clientCount: 0,
        workoutsDone: 0,
        revenue: 0,
        activeClients: 0
    });

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data: trainer } = await supabase
                    .from('trainers')
                    .select('full_name, name')
                    .eq('id', user.id)
                    .single();

                if (trainer) {
                    setTrainerName(trainer.full_name || trainer.name || "Coach");
                }

                // Get actual stats
                const { count: clientCount } = await supabase
                    .from('members')
                    .select('*', { count: 'exact', head: true })
                    .eq('trainer_id', user.id);

                // Fetch workouts done
                const { count: workoutsDone } = await supabase
                    .from('workout_history')
                    .select('*', { count: 'exact', head: true });

                const { data: payments } = await supabase
                    .from('payments')
                    .select('amount')
                    .eq('status', 'paid');
                const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

                setStats({
                    clientCount: clientCount || 0,
                    workoutsDone: workoutsDone || 0,
                    revenue: totalRevenue || (clientCount ? clientCount * 5000 : 0),
                    activeClients: clientCount || 0
                });

                // Load feed items
                const { data: recentChats } = await supabase
                    .from('chat_history')
                    .select('*, members!inner(name)')
                    .eq('sender', 'user')
                    .order('created_at', { ascending: false })
                    .limit(5);
                    
                if (recentChats) {
                    const formattedFeed = recentChats.map((chat: any) => ({
                        id: chat.id,
                        name: chat.members.name,
                        message: chat.message,
                        time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        member_id: chat.member_id
                    }));
                    setFeedItems(formattedFeed);
                }

                setLoading(false);

            } catch (error) {
                console.error("Dashboard load error:", error);
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [router, supabase]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse flex flex-col items-center"><Dumbbell className="h-10 w-10 text-muted-foreground animate-spin mb-4" /><p className="text-muted-foreground font-medium">Loading Dashboard...</p></div></div>;
    }

    const hasClients = stats.clientCount > 0;

    return (
        <main className="min-h-screen p-6 font-sans max-w-[1600px] mx-auto space-y-6">

            {/* 1. FLOATING HEADER */}
            <header className="flex justify-between items-center bg-card/80 border border-border p-3 rounded-2xl sticky top-4 z-40 backdrop-blur-md shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-4 pl-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <Input
                            placeholder="Search client, program..."
                            className="w-48 md:w-64 pl-10 h-10 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0 focus-visible:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    router.push(`/dashboard/clients?search=${encodeURIComponent(searchQuery.trim())}`);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                    <ThemeSwitcher />
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted relative">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-[1px] bg-border mx-1"></div>
                    <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-foreground">{trainerName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trainer</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
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

                    {/* HERO CARD */}
                    <div className="p-8 rounded-[2rem] bg-card text-card-foreground border border-border relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                                    WELCOME COACH <br />
                                    <span className="text-primary">READY TO DOMINATE?</span>
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
                                    You have <strong className="text-foreground">{stats.activeClients} active clients</strong> waiting for updates today.
                                </p>
                            </div>
                            {!hasClients && (
                                <Link href="/dashboard/clients">
                                    <Button className="bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-xl animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                        <UserPlus className="mr-2 h-4 w-4" /> Add Client
                                    </Button>
                                </Link>
                            )}
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                    </div>

                    {/* STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Highlights */}
                        <div className="md:col-span-2 p-6 rounded-[2rem] bg-card text-card-foreground relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 shadow-sm cursor-default border border-border hover:border-primary/30 mr-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="bg-primary/10 w-fit p-2 rounded-lg mb-4">
                                        <Dumbbell className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-5xl font-black tracking-tighter mb-1 text-primary">{stats.workoutsDone}</h3>
                                    <p className="font-bold text-muted-foreground text-sm tracking-wide uppercase">Workouts Done</p>
                                </div>
                                {hasClients && (
                                    <div className="text-right">
                                        <p className="font-bold text-lg flex items-center gap-1 justify-end text-primary">
                                            <Activity className="h-4 w-4" /> {stats.workoutsDone > 0 ? `${Math.min(100, Math.round((stats.workoutsDone / (stats.clientCount * 12)) * 100))}%` : '0%'}
                                        </p>
                                        <p className="text-sm opacity-70">Completion rate</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Revenue */}
                        <div className="p-6 rounded-[2rem] bg-card text-card-foreground border border-border hover:border-primary transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <Trophy className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded">MRR</span>
                            </div>
                            <h3 className="text-3xl font-bold">₹{stats.revenue}</h3>
                            <p className="text-muted-foreground text-xs mt-1">Total Revenue</p>
                        </div>
                    </div>

                    {/* CLIENT LEADERBOARD */}
                    <div className="p-6 rounded-[2rem] bg-card border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-card-foreground text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Client Performance
                            </h3>
                            {hasClients && <Link href="/dashboard/clients"><Button variant="link" className="text-muted-foreground hover:text-foreground text-xs font-bold">VIEW DIRECTORY</Button></Link>}
                        </div>

                        {stats.clientCount > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-1">
                                    <p className="text-3xl font-black text-primary">
                                        {stats.workoutsDone > 0 ? `${Math.min(100, Math.round((stats.workoutsDone / Math.max(stats.clientCount * 12, 1)) * 100))}%` : '0%'}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Completion Rate</p>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-1">
                                    <p className="text-3xl font-black text-foreground">{stats.workoutsDone}</p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Workouts Logged</p>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-1">
                                    <p className="text-3xl font-black text-foreground">
                                        {(stats.clientCount > 0 ? (stats.workoutsDone / stats.clientCount).toFixed(1) : '0')}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Avg Workouts / Client</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No clients active yet.</p>
                                <Link href="/dashboard/clients" className="text-primary text-xs hover:underline mt-2 inline-block">
                                    + Invite your first client
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN: ACTIONS (Span 4) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* QUICK ACTIONS STACK */}
                    <div className="p-6 rounded-[2rem] bg-card border border-border shadow-sm">
                        <h3 className="font-black text-card-foreground text-lg mb-4 uppercase tracking-tight">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/dashboard/programs/builder" className="block w-full">
                                <Button className="w-full h-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base justify-between px-6 group shadow-lg hover:shadow-xl transition-all border-none">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center text-inherit">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <span className="tracking-tight">CREATE PROGRAM</span>
                                    </span>
                                    <ChevronRight className="h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Link href="/dashboard/sessions" className="block w-full">
                                <Button variant="outline" className="w-full h-14 rounded-xl border-border bg-muted hover:bg-muted/80 text-foreground font-bold text-base justify-between px-6 group transition-all">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        Schedule Session
                                    </span>
                                </Button>
                            </Link>

                            <Link href="/dashboard/chat" className="block w-full">
                                <Button variant="outline" className="w-full h-14 rounded-xl border-border bg-muted hover:bg-muted/80 text-foreground font-bold text-base justify-between px-6 group transition-all">
                                    <span className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        Broadcast Message
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* PRIORITY FEED */}
                    <div className="p-6 rounded-[2rem] bg-card text-card-foreground border border-border h-fit min-h-[300px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Priority Feed</h3>
                            {hasClients && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>}
                        </div>

                        {hasClients ? (
                            feedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground animate-in fade-in zoom-in duration-500">
                                    <CheckCircle className="h-8 w-8 mb-2 opacity-50 text-green-500" />
                                    <p className="text-sm">All caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {feedItems.map((item) => (
                                        <div key={item.id} className="p-3 bg-muted/50 rounded-xl flex items-start gap-3 border border-border">
                                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                <MessageSquare className="h-4 w-4 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">New Message from {item.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">"{item.message}"</p>
                                                <Link href={`/dashboard/chat?client=${item.member_id}`}>
                                                    <span className="text-[10px] font-bold text-primary mt-2 inline-block hover:underline">REPLY NOW</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground animate-in fade-in zoom-in duration-500">
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
