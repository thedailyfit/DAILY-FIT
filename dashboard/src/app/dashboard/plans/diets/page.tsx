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
        <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        Diet Plans
                    </h1>
                    <p className="text-zinc-400 mt-2 font-medium">
                        Create, manage, and reuse structured nutrition plans.
                    </p>
                </div>
                <Button size="lg" className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold shadow-[0_0_20px_rgba(203,254,0,0.2)] rounded-xl" asChild>
                    <Link href="/dashboard/plans/diets/new">
                        + New Diet Plan
                    </Link>
                </Button>
            </div>

            <Card className="border-zinc-800 shadow-xl bg-[#141414] overflow-hidden rounded-[1.5rem]">
                <CardHeader className="bg-[#1a1a1a] border-b border-zinc-800 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                        Diet Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-[#cbfe00] animate-pulse shadow-[0_0_10px_#cbfe00]"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DietPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
