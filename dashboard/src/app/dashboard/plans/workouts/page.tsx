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
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Workout Plans
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Build structured training programs you can reuse.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm rounded-lg" asChild>
                        <Link href="/dashboard/plans/workouts/new">
                            + New Workout Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                        Workout Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <WorkoutPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
