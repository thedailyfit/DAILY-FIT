
import { AnalyticsCharts } from "@/components/gym/analytics-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, DollarSign, Dumbbell, CreditCard, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default async function GymAnalyticsPage() {
    const supabase = createClient();

    // Fetch aggregated metrics
    const { data: members } = await supabase.from('members').select('*');
    const { count: totalTrainers } = await supabase.from('trainers').select('*', { count: 'exact', head: true });

    const totalMembers = members?.length || 0;
    // Calculate stats
    // Assuming pt clients are identified by goal or status or distinct list
    const ptClients = members?.filter(m => m.goal && m.goal.toLowerCase().includes('muscle'))?.length || 0; // Mock logic 
    const newJoinees = 12; // Mock
    const totalCardio = members?.filter(m => m.goal === 'Endurance' || (m.cardio_fee && m.cardio_fee > 0))?.length || 0;

    const totalRevenue = members?.reduce((sum, m) => sum + (m.monthly_fee || 0) + (m.cardio_fee || 0), 0) || 0;

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Business Analytics</h1>
                    <p className="text-zinc-500 font-medium">Financial health and growth tracking.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10">
                        <Calendar className="mr-2 h-4 w-4" /> Last 90 Days
                    </Button>
                    <Button className="bg-[#212121] text-white hover:bg-black h-10">Export Report</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">$8,200</div>
                        <p className="text-xs text-muted-foreground">65% Profit Margin</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">$4,250</div>
                        <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Joinees</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">+2 since yesterday</p>
                    </CardContent>
                </Card>
            </div>

            <AnalyticsCharts />
        </div>
    );
}
