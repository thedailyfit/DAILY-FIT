"use client";

import { AnalyticsCharts } from "@/components/gym/analytics-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, DollarSign, Dumbbell, CreditCard, Activity } from "lucide-react";
import { AnimatedPage, AnimatedCard } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymAnalyticsPage() {
    // Mock data for demo
    const totalMembers = 128;
    const totalRevenue = 12450;
    const netProfit = 8200;
    const totalExpenses = 4250;

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Business Analytics</h1>
                        <p className="text-muted-foreground font-medium">Financial health and growth tracking.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher variant="gym" />
                        <Button variant="outline" className="h-10">
                            <Calendar className="mr-2 h-4 w-4" /> Last 90 Days
                        </Button>
                        <Button className="bg-primary text-primary-foreground hover:opacity-90 h-10">Export Report</Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <AnimatedCard delay={0.1}>
                        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-primary">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                    </AnimatedCard>

                    <AnimatedCard delay={0.2}>
                        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                                <CreditCard className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-500">${netProfit.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">65% Profit Margin</p>
                            </CardContent>
                        </Card>
                    </AnimatedCard>

                    <AnimatedCard delay={0.3}>
                        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                                <Activity className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Maintenance + Utilities</p>
                            </CardContent>
                        </Card>
                    </AnimatedCard>

                    <AnimatedCard delay={0.4}>
                        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
                                <Users className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{totalMembers}</div>
                                <p className="text-xs text-muted-foreground">+8 new this week</p>
                            </CardContent>
                        </Card>
                    </AnimatedCard>
                </div>

                {/* Charts */}
                <AnalyticsCharts />
            </div>
        </AnimatedPage>
    );
}
