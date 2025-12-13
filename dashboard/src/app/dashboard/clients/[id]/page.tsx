import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, Target, Calendar, Dumbbell, Utensils, Clock } from "lucide-react";
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
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/clients">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{member.name}</h1>
                        <p className="text-muted-foreground">Client Profile</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <AssignPlanDialog clientId={member.member_id} clientName={member.name} />
                </div>
            </div>

            {/* Client Info Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Assigned Plans Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Current Plan Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Utensils className="h-4 w-4" /> Diet Plan
                                </h3>
                                {activeDietProgram ? (
                                    <Badge variant="default" className="bg-green-600">Active</Badge>
                                ) : (
                                    <Badge variant="secondary">Not Assigned</Badge>
                                )}
                            </div>
                            {activeDietProgram ? (
                                <div>
                                    <p className="text-lg font-medium">{activeDietProgram.program.name}</p>
                                    <p className="text-xs text-muted-foreground">Started: {activeDietProgram.start_date}</p>
                                    <Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                                        <Link href={`/dashboard/plans/diets/${activeDietProgram.program.diet_plan_id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No diet plan currently assigned.</p>
                            )}
                        </div>

                        <div className="p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Dumbbell className="h-4 w-4" /> Workout Plan
                                </h3>
                                {activeWorkoutProgram ? (
                                    <Badge variant="default" className="bg-blue-600">Active</Badge>
                                ) : (
                                    <Badge variant="secondary">Not Assigned</Badge>
                                )}
                            </div>
                            {activeWorkoutProgram ? (
                                <div>
                                    <p className="text-lg font-medium">{activeWorkoutProgram.program.name}</p>
                                    <p className="text-xs text-muted-foreground">Started: {activeWorkoutProgram.start_date}</p>
                                    <Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                                        <Link href={`/dashboard/plans/workouts/${activeWorkoutProgram.program.workout_plan_id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No workout plan currently assigned.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Assignment History - NEW SECTION */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Assignment History (Last 7 Days)
                        </CardTitle>
                        <CardDescription>Recent plan updates and assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {programs && programs.length > 0 ? (
                                programs.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {p.program?.diet_plan_id ? (
                                                <Utensils className="h-4 w-4 text-orange-500" />
                                            ) : (
                                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                            )}
                                            <div>
                                                <p className="font-medium">{p.program?.name || 'Unknown Plan'}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Assigned: {new Date(p.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>Start: {p.start_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {p.is_current ? (
                                                <Badge variant="default" className="bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">History</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No assignment history found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">WhatsApp Number</p>
                                <p className="text-sm text-muted-foreground">{member.whatsapp_id || "Not provided"}</p>
                            </div>
                        </div>
                        {member.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Goal</p>
                                <Badge variant="outline" className="mt-1">
                                    {member.goal?.replace('_', ' ').toUpperCase() || "Not set"}
                                </Badge>
                            </div>
                        </div>
                        {member.gender && (
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Gender</p>
                                    <p className="text-sm text-muted-foreground capitalize">{member.gender}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chat History */}
                <Card className="flex flex-col h-[500px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            WhatsApp History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                        {messages && messages.length > 0 ? (
                            messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                            ? 'bg-muted text-foreground'
                                            : 'bg-primary text-primary-foreground'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                <p>No messages yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Additional Info */}
            < Card >
                <CardHeader>
                    <CardTitle>Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {member.weight_kg && (
                            <div>
                                <p className="text-sm font-medium">Weight</p>
                                <p className="text-2xl font-bold">{member.weight_kg} kg</p>
                            </div>
                        )}
                        {member.height_cm && (
                            <div>
                                <p className="text-sm font-medium">Height</p>
                                <p className="text-2xl font-bold">{member.height_cm} cm</p>
                            </div>
                        )}
                        {member.age && (
                            <div>
                                <p className="text-sm font-medium">Age</p>
                                <p className="text-2xl font-bold">{member.age} years</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card >
        </div >
    );
}
