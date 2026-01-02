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
        <div className="p-4 md:p-8 space-y-8 bg-background min-h-screen text-foreground">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
                        Workout Plans
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Build structured training programs you can reuse.
                    </p>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg rounded-xl" asChild>
                    <Link href="/dashboard/plans/workouts/new">
                        + New Workout Plan
                    </Link>
                </Button>
            </div>

            <Card className="border-border shadow-xl bg-card overflow-hidden rounded-[1.5rem]">
                <CardHeader className="bg-muted/30 border-b border-border p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-card-foreground">
                        Workout Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-sm"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <WorkoutPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
