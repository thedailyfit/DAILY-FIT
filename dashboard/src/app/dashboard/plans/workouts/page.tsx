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
    // TODO: Replace with Supabase from workout_plans_usage
    return [
        {
            id: "wp1",
            name: "3 Day Beginner Upper/Lower Split",
            level: "beginner",
            frequencyPerWeek: 3,
            focus: "strength",
            planType: "template",
            tags: ["beginner"],
            isActive: true,
            activeClientsCount: 4,
        },
        {
            id: "wp2",
            name: "5 Day Hypertrophy Pro",
            level: "advanced",
            frequencyPerWeek: 5,
            focus: "hypertrophy",
            planType: "template",
            tags: ["high_volume"],
            isActive: true,
            activeClientsCount: 2,
        },
        {
            id: "wp3",
            name: "Custom Workout – Akhil",
            level: "intermediate",
            frequencyPerWeek: 4,
            focus: "fat_loss",
            planType: "custom",
            tags: ["client_specific"],
            isActive: true,
            activeClientsCount: 1,
        },
    ];
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
                    <Button variant="outline" size="sm">
                        Import from AI
                    </Button>
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
