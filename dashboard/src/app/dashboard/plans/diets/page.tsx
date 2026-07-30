import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Apple, Plus, Search, Users, MoreVertical, Edit } from "lucide-react"
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { createClient } from "@/lib/supabase"

export const metadata: Metadata = {
    title: "Diet Plans | DailyFit Trainer Dashboard",
};

export default async function DietPlansLibraryPage() {
    const supabase = createClient();

    // Fetch all diet plans ordered by creation date
    const { data, error } = await supabase
        .from("diet_plans")
        .select("*")
        .order("created_at", { ascending: false });

    let plans: any[] = [];
    
    if (!error && data) {
        plans = data.map((plan: any) => ({
            id: plan.id,
            title: plan.name,
            macros: `${plan.protein || 0}P / ${plan.total_calories || 0} Cal`,
            clientsActive: 0, // Usage count not yet implemented
            type: plan.goal?.replace('_', ' ') || "General",
            lastUpdated: new Date(plan.created_at).toLocaleDateString(),
        }));
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <Apple className="h-8 w-8 text-green-500" /> Diet Plans
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage and assign your nutrition plans.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                        <Input 
                            placeholder="Search diet plans..." 
                            className="pl-10 h-10 w-64 bg-card border-border"
                        />
                    </div>
                    <Link href="/dashboard/plans/diets/new">
                        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-md">
                            <Plus className="h-4 w-4 mr-2" /> Create Diet Plan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Grid */}
            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed">
                    <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <Apple className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Diet Plans Yet</h3>
                    <p className="text-muted-foreground max-w-md mb-6">Create nutrition templates to quickly assign to your clients.</p>
                    <Link href="/dashboard/plans/diets/new">
                        <Button className="font-bold bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" /> Create First Plan</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan: any) => (
                        <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden flex flex-col">
                            <CardHeader className="border-b bg-green-500/10 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-bold line-clamp-1 capitalize" title={plan.title}>{plan.title}</CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-2">
                                            <span className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-bold capitalize">{plan.type}</span>
                                            <span className="font-mono text-xs">{plan.macros}</span>
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground -mt-2 -mr-2">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 flex-1">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Active Clients</span>
                                        <span className="font-black text-2xl flex items-center gap-2">
                                            {plan.clientsActive} <Users className="h-5 w-5 text-muted-foreground opacity-50" />
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Created On</span>
                                        <span className="font-medium text-foreground">{plan.lastUpdated}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 border-t bg-muted/10 gap-2">
                                <Button className="w-full font-bold bg-green-600 hover:bg-green-700 text-white">
                                    Assign to Client
                                </Button>
                                <Button variant="outline" size="icon" title="Edit Plan">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
