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

    try {
        // Fetch client from members table
        const { data: member, error: memberError } = await supabase
            .from("members")
            .select("*")
            .eq("id", id)
            .single();

        if (memberError) {
            console.error("Error fetching member:", memberError);
            return null;
        }

        // Fetch active programs with plan details
        const { data: programs } = await supabase
            .from("client_programs")
            .select(`
                *,
                plan_programs (
                    id,
                    name,
                    diet_plan_id,
                    workout_plan_id,
                    diet_plans (id, name, goal, total_calories),
                    workout_plans (id, name, level, focus)
                )
            `)
            .eq("client_id", id)
            .eq("is_current", true);

        return {
            member,
            programs: programs || []
        };
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
}

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
    const data = await getClientProfile(params.id);

    if (!data || !data.member) {
        notFound();
    }

    const { member, programs } = data;

    // Extract active diet and workout plans
    const activeDietPlan = programs.find(p => p.plan_programs?.diet_plan_id)?.plan_programs?.diet_plans;
    const activeWorkoutPlan = programs.find(p => p.plan_programs?.workout_plan_id)?.plan_programs?.workout_plans;

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
                    <AssignPlanDialog clientId={member.id} clientName={member.name} />
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
                                    {activeDietPlan ? (
                                        <>
                                            <p className="text-sm text-muted-foreground">{activeDietPlan.name}</p>
                                            {activeDietPlan.total_calories && (
                                                <p className="text-xs text-muted-foreground">{activeDietPlan.total_calories} kcal/day</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No plan assigned</p>
                                    )}
                                </div>
                            </div>
                            {activeDietPlan && (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/clients/${member.id}/diet`}>
                                        Edit
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Workout Plan */}
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex items-start gap-3">
                                <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Workout Plan</p>
                                    {activeWorkoutPlan ? (
                                        <>
                                            <p className="text-sm text-muted-foreground">{activeWorkoutPlan.name}</p>
                                            {activeWorkoutPlan.level && (
                                                <p className="text-xs text-muted-foreground capitalize">{activeWorkoutPlan.level} • {activeWorkoutPlan.focus}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No plan assigned</p>
                                    )}
                                </div>
                            </div>
                            {activeWorkoutPlan && (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/clients/${member.id}/workout`}>
                                        Edit
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {!activeDietPlan && !activeWorkoutPlan && (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground mb-3">No plans assigned yet</p>
                                <AssignPlanDialog clientId={member.id} clientName={member.name} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info */}
            <Card>
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
            </Card>
        </div>
    );
}
