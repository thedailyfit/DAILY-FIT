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
    // TODO: Replace with real Supabase query:
    // const supabase = createClient();
    // const { data } = await supabase.from("diet_plans_usage").select("*");
    // return data as DietPlan[];

    return [
        {
            id: "dp1",
            name: "Veg Fat Loss – 1500 kcal",
            goal: "fat_loss",
            totalCalories: 1500,
            dietPreference: "veg",
            planType: "template",
            tags: ["beginner", "south_indian"],
            isActive: true,
            activeClientsCount: 6,
        },
        {
            id: "dp2",
            name: "High Protein Cut – 1800 kcal",
            goal: "fat_loss",
            totalCalories: 1800,
            dietPreference: "non_veg",
            planType: "template",
            tags: ["high_protein"],
            isActive: true,
            activeClientsCount: 3,
        },
        {
            id: "dp3",
            name: "Custom Diet – Akhil",
            goal: "fat_loss",
            totalCalories: 1700,
            dietPreference: "veg",
            planType: "custom",
            tags: ["client_specific"],
            isActive: true,
            activeClientsCount: 1,
        },
    ];
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
