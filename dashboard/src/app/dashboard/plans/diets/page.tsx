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
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Diet Plans
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Create, manage, and reuse structured nutrition plans.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm rounded-lg" asChild>
                        <Link href="/dashboard/plans/diets/new">
                            + New Diet Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                        Diet Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DietPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
