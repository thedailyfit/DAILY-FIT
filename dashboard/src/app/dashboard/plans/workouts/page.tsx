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
        <div className="flex flex-col gap-6 bg-[#e6e6e6] min-h-screen p-8 text-black">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-[#212121] uppercase tracking-tighter mb-2">
                        Workout Plans
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        Build structured training programs you can reuse.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="lg" className="bg-[#212121] hover:bg-black text-white font-bold shadow-xl rounded-xl" asChild>
                        <Link href="/dashboard/plans/workouts/new">
                            + New Workout Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white rounded-[1.5rem] overflow-hidden">
                <CardHeader className="bg-[#212121] text-white p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        Workout Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-[#cbfe00] animate-pulse"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <WorkoutPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
