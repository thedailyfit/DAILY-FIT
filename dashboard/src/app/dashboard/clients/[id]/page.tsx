import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, Target, Calendar, Dumbbell, Utensils } from "lucide-react";
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

        // Simplified: Just return member data for now
        // We'll fetch plans separately if needed
        return {
            member,
            programs: []
        };
    } catch (error) {
        console.error("[ClientProfile] Unexpected error:", error);
        return null;
    }
}

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // In Next.js 16, params is a Promise and must be awaited
    const { id } = await params;

    console.log('[ClientProfilePage] Received ID from params:', id);

    const data = await getClientProfile(id);

    if (!data || !data.member) {
        console.error('[ClientProfilePage] No data returned, showing 404');
        notFound();
    }

    const { member, programs } = data;

    // Plans will be null for now since we simplified the query
    const activeDietPlan = null;
    const activeWorkoutPlan = null;

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

                {/* Active Plans */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Plans</CardTitle>
                        <CardDescription>Current diet and workout assignments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Diet Plan */}
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex items-start gap-3">
                                <Utensils className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Diet Plan</p>
                                    <p className="text-sm text-muted-foreground">No plan assigned</p>
                                </div>
                            </div>
                        </div>

                        {/* Workout Plan */}
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex items-start gap-3">
                                <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Workout Plan</p>
                                    <p className="text-sm text-muted-foreground">No plan assigned</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground mb-3">No plans assigned yet</p>
                            <AssignPlanDialog clientId={member.member_id} clientName={member.name} />
                        </div>
                    </CardContent>
                </Card >
            </div >

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
