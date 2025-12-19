import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, Target, Calendar, Dumbbell, Utensils, Clock, CreditCard, Bell, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { AssignPlanDialog } from "@/components/clients/assign-plan-dialog";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Client Profile | DailyFit Trainer Dashboard",
};

async function getClientProfile(id: string) {
    const supabase = createClient();

    console.log('[ClientProfile] Fetching profile for ID:', id);

    try {
        // Fetch client from members table using member_id
        const { data: member, error: memberError } = await supabase
            .from("members")
            .select("*")
            .eq("member_id", id)
            .single();

        console.log('[ClientProfile] Query result:', { member, error: memberError });

        if (memberError) {
            console.error("[ClientProfile] Error fetching member:", memberError);
            return null;
        }

        if (!member) {
            console.error("[ClientProfile] No member found for ID:", id);
            return null;
        }

        console.log('[ClientProfile] Successfully found member:', member.name);

        // Fetch active assigned programs
        const { data: programs, error: programsError } = await supabase
            .from("client_programs")
            .select(`
                *,
                program:plan_programs (
                    id,
                    name,
                    diet_plan_id,
                    workout_plan_id,
                    status
                )
            `)
            .eq("client_id", id)
            // .eq("is_current", true) // Fetch all history
            .order("created_at", { ascending: false });

        if (programsError) {
            console.error("[ClientProfile] Error fetching programs:", programsError);
        }

        // Fetch chat history
        const { data: messages, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("whatsapp_id", member.whatsapp_id?.replace('whatsapp:', ''))
            .order("created_at", { ascending: true })
            .limit(50);

        if (messagesError) console.error("[ClientProfile] Warning fetching messages:", messagesError);

        return {
            member,
            programs: programs || [],
            messages: messages || []
        };
    } catch (error) {
        console.error("[ClientProfile] Unexpected error:", error);
        return null;
    }
}

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // In Next.js 16, params is a Promise and must be awaited
    const { id } = await params;

    const data = await getClientProfile(id);

    if (!data || !data.member) {
        notFound();
    }

    const { member, programs, messages } = data;

    // Identify active diet and workout plans
    // Identify active diet and workout plans (explicitly check is_current)
    const activeDietProgram = programs.find((p: any) => p.is_current && p.program?.diet_plan_id);
    const activeWorkoutProgram = programs.find((p: any) => p.is_current && p.program?.workout_plan_id);

    return (
        <div className="space-y-6 max-w-6xl mx-auto min-h-screen p-6 bg-[#e6e6e6]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="hover:bg-black/10">
                        <Link href="/dashboard/clients">
                            <ArrowLeft className="h-5 w-5 text-black" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black text-[#212121] uppercase tracking-tighter">{member.name}</h1>
                        <Badge variant="outline" className="border-black/20 text-black/60 font-mono mt-1">Client Profile</Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-red-500/20 text-red-600 hover:bg-red-50 hover:border-red-500">
                        <span className="flex items-center gap-2">
                            Delete Client
                        </span>
                    </Button>
                    <AssignPlanDialog clientId={member.member_id} clientName={member.name} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column (Stats & Info) */}
                <div className="space-y-6">
                    <Card className="bg-[#212121] border-none shadow-xl text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#cbfe00]">
                                <User className="h-5 w-5" />
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Phone className="h-4 w-4 text-zinc-400" />
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase">WhatsApp</p>
                                    <p className="text-sm font-bold text-white">{member.whatsapp_id || "Not provided"}</p>
                                </div>
                            </div>
                            {member.email && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase">Email</p>
                                        <p className="text-sm font-bold text-white">{member.email}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Target className="h-4 w-4 text-zinc-400" />
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase">Goal</p>
                                    <p className="text-sm font-bold text-[#cbfe00] mt-1">
                                        {member.goal?.replace('_', ' ').toUpperCase() || "NOT SET"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-black flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Billing & Fees
                            </CardTitle>
                            <CardDescription>Monthly Retainer Management</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Monthly Fee</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-black text-[#212121]">₹5,000</span>
                                    <Badge className="bg-[#cbfe00] text-black hover:bg-[#b0dc00]">Active</Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100">
                                <Button className="w-full bg-[#212121] text-white hover:bg-black font-bold h-12 shadow-lg">
                                    <Bell className="h-4 w-4 mr-2 text-[#cbfe00]" />
                                    Send Payment Reminder
                                </Button>
                                <p className="text-[10px] text-center text-zinc-400 mt-2">Sends a template message via WhatsApp</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle/Right Column (Plans & Content) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Assigned Plans Card */}
                    <Card className="bg-[#212121] border-none shadow-xl text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#cbfe00]">
                                <Target className="h-5 w-5" />
                                Active Program Strategy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="p-6 border border-white/10 rounded-2xl bg-black/20 hover:border-[#cbfe00]/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-lg flex items-center gap-2 text-white">
                                        <Utensils className="h-5 w-5 text-[#cbfe00]" /> Diet
                                    </h3>
                                    {activeDietProgram ? (
                                        <Badge className="bg-[#cbfe00] text-black">Active</Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-zinc-700 text-zinc-500">None</Badge>
                                    )}
                                </div>
                                {activeDietProgram ? (
                                    <div>
                                        <p className="text-xl font-bold text-white mb-1">{activeDietProgram.program.name}</p>
                                        <p className="text-xs text-zinc-500 mb-4">Started {activeDietProgram.start_date}</p>
                                        <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-white h-9 text-xs" asChild>
                                            <Link href={`/dashboard/plans/diets/${activeDietProgram.program.diet_plan_id}`}>
                                                View Protocol
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">No nutrition protocol assigned.</p>
                                )}
                            </div>

                            <div className="p-6 border border-white/10 rounded-2xl bg-black/20 hover:border-[#cbfe00]/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-lg flex items-center gap-2 text-white">
                                        <Dumbbell className="h-5 w-5 text-[#cbfe00]" /> Workout
                                    </h3>
                                    {activeWorkoutProgram ? (
                                        <Badge className="bg-[#cbfe00] text-black">Active</Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-zinc-700 text-zinc-500">None</Badge>
                                    )}
                                </div>
                                {activeWorkoutProgram ? (
                                    <div>
                                        <p className="text-xl font-bold text-white mb-1">{activeWorkoutProgram.program.name}</p>
                                        <p className="text-xs text-zinc-500 mb-4">Started {activeWorkoutProgram.start_date}</p>
                                        <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-white h-9 text-xs" asChild>
                                            <Link href={`/dashboard/plans/workouts/${activeWorkoutProgram.program.workout_plan_id}`}>
                                                View Protocol
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">No training protocol assigned.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat History */}
                    <Card className="flex flex-col h-[500px] bg-white border-none shadow-xl">
                        <CardHeader className="border-b border-zinc-100">
                            <CardTitle className="flex items-center gap-2 text-[#212121]">
                                <MessageSquare className="h-5 w-5" />
                                Communication History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50">
                            {messages && messages.length > 0 ? (
                                messages.map((msg: any) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === 'user'
                                                ? 'bg-white text-black rounded-tl-none'
                                                : 'bg-[#212121] text-white rounded-tr-none'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <div className={`text-[10px] mt-1 opacity-70 font-bold ${msg.role === 'user' ? 'text-zinc-400' : 'text-[#cbfe00]'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-full items-center justify-center text-zinc-400 flex-col gap-2">
                                    <MessageSquare className="h-8 w-8 opacity-20" />
                                    <p className="font-medium text-sm">No messages exchanged yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
