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
        <div className="p-4 md:p-8 space-y-8 bg-background min-h-screen text-foreground">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
                        Diet Plans
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Create, manage, and reuse structured nutrition plans.
                    </p>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg rounded-xl" asChild>
                    <Link href="/dashboard/plans/diets/new">
                        + New Diet Plan
                    </Link>
                </Button>
            </div>

            <Card className="border-border shadow-xl bg-card overflow-hidden rounded-[1.5rem]">
                <CardHeader className="bg-muted/30 border-b border-border p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-card-foreground">
                        Diet Plan Library
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-sm"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DietPlansTable plans={plans} />
                </CardContent>
            </Card>
        </div>
    );
}
