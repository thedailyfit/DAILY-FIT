import { Metadata } from "next";
import { DietPlansTable, DietPlan } from "@/components/plans/diet-plans-table-v2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Diet Plans | DailyFit Trainer Dashboard",
};

async function getDietPlans(): Promise<DietPlan[]> {
    const supabase = createClient();

    // Fetch all diet plans ordered by creation date
    const { data, error } = await supabase
        .from("diet_plans")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching diet plans:", error);
        return [];
    }

    if (!data) return [];

    // Map database fields to UI type
    return data.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        goal: plan.goal || "fat_loss",
        totalCalories: plan.total_calories || 0,
        protein: plan.protein || 0, // Map protein from DB
        dietPreference: plan.diet_preference || "any",
        planType: plan.plan_type || "template",
        tags: [], // Tags not yet in DB
        isActive: plan.is_active !== false,
        activeClientsCount: 0, // Usage count not yet implemented
    }));
}

export default async function DietPlansPage() {
    const plans = await getDietPlans();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Diet Plans
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create, manage, and reuse structured nutrition plans for your clients.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" asChild>
                        <Link href="/dashboard/plans/diets/new">
                            + New Diet Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Diet Plan Library
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DietPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
