import { Metadata } from "next";
import {
    WorkoutPlansTable,
    WorkoutPlan,
} from "@/components/plans/workout-plans-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Workout Plans | DailyFit Trainer Dashboard",
};

async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const supabase = createClient();

    // Fetch all workout plans
    const { data, error } = await supabase
        .from("workout_plans")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching workout plans:", error);
        return [];
    }

    if (!data) return [];

    return data.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        level: plan.level || "beginner",
        frequencyPerWeek: plan.frequency_per_week || 3,
        focus: plan.focus || "general",
        planType: plan.plan_type || "template",
        tags: [], // Tags not yet in DB
        isActive: plan.is_active !== false,
        activeClientsCount: 0, // Usage count not yet implemented
    }));
}

export default async function WorkoutPlansPage() {
    const plans = await getWorkoutPlans();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Workout Plans
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Build structured training programs you can reuse and customize for clients.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" asChild>
                        <Link href="/dashboard/plans/workouts/new">
                            + New Workout Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Workout Plan Library
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <WorkoutPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
