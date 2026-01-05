"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPage, PopupCard, SlideIn, AnimatedCounter, AnimatedList } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Target,
    Zap,
    BarChart3,
    PieChart
} from "lucide-react";
import { motion } from "framer-motion";

// Animated Progress Ring Component
function ProgressRing({ progress, size = 120, strokeWidth = 8, color = "var(--primary)" }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-muted"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <motion.circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    style={{ strokeDasharray: circumference }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                    className="text-2xl font-black text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {progress}%
                </motion.span>
            </div>
        </div>
    );
}

// Animated Bar Chart
function AnimatedBar({ value, maxValue, label, delay = 0 }: { value: number; maxValue: number; label: string; delay?: number }) {
    const percentage = (value / maxValue) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold text-foreground">{value}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

// Sparkline Component
function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - ((v - min) / range) * 100
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <svg className="w-24 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </svg>
    );
}

// Mock Analytics Data
const kpiData = [
    { label: "Monthly Revenue", value: 48500, prefix: "$", change: 12.5, trend: "up", sparkline: [35, 40, 38, 45, 42, 48, 52] },
    { label: "Active Members", value: 342, change: 8.2, trend: "up", sparkline: [280, 290, 300, 310, 320, 335, 342] },
    { label: "Retention Rate", value: 94.2, suffix: "%", change: 2.1, trend: "up", sparkline: [88, 90, 91, 92, 93, 93, 94] },
    { label: "Churn Rate", value: 5.8, suffix: "%", change: -1.2, trend: "down", sparkline: [8, 7.5, 7, 6.5, 6.2, 6, 5.8] },
];

const membershipBreakdown = [
    { plan: "Premium", count: 145, color: "#a855f7" },
    { plan: "Pro", count: 112, color: "#3b82f6" },
    { plan: "Starter", count: 85, color: "#22c55e" },
];

const weeklyActivity = [
    { day: "Mon", visits: 87 },
    { day: "Tue", visits: 92 },
    { day: "Wed", visits: 78 },
    { day: "Thu", visits: 95 },
    { day: "Fri", visits: 88 },
    { day: "Sat", visits: 120 },
    { day: "Sun", visits: 65 },
];

export default function GymAnalyticsPage() {
    const maxVisits = Math.max(...weeklyActivity.map(d => d.visits));

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Analytics Dashboard</h1>
                        <p className="text-muted-foreground font-medium">Real-time insights and performance metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <Button variant="outline" className="h-10 border-border">
                            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                        </Button>
                    </div>
                </div>

                {/* KPI Cards Row */}
                <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {kpiData.map((kpi, index) => (
                        <PopupCard key={kpi.label} delay={0.1 + index * 0.1} className="bg-card border border-border shadow-lg rounded-2xl p-6 relative overflow-hidden group">
                            {/* Background Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                                    <Sparkline data={kpi.sparkline} color={kpi.trend === 'up' ? '#22c55e' : '#ef4444'} />
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-black text-foreground">
                                        {kpi.prefix}<AnimatedCounter value={kpi.value} />{kpi.suffix}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {kpi.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                    {Math.abs(kpi.change)}% vs last month
                                </div>
                            </div>
                        </PopupCard>
                    ))}
                </AnimatedList>

                {/* Main Charts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Weekly Activity Chart */}
                    <SlideIn direction="left" delay={0.3} className="lg:col-span-2">
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-foreground flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-primary" /> Weekly Gym Visits
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground">Member check-ins by day</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                                        <Zap className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-bold text-primary">625 total</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between gap-4 h-48">
                                    {weeklyActivity.map((day, i) => (
                                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                            <motion.div
                                                className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(day.visits / maxVisits) * 100}%` }}
                                                transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {day.visits}
                                                </div>
                                            </motion.div>
                                            <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Membership Breakdown */}
                    <SlideIn direction="right" delay={0.4}>
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-primary" /> Plan Distribution
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Active memberships by tier</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    <ProgressRing progress={78} size={140} color="var(--primary)" />
                                </div>
                                <p className="text-center text-sm text-muted-foreground">Capacity Utilization</p>

                                <div className="space-y-4 pt-4 border-t border-border">
                                    {membershipBreakdown.map((plan, i) => (
                                        <div key={plan.plan} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                                                <span className="text-sm font-medium text-foreground">{plan.plan}</span>
                                            </div>
                                            <span className="font-bold text-foreground">{plan.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>

                {/* Goals & Performance */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Revenue Goals */}
                    <SlideIn direction="up" delay={0.5}>
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" /> Monthly Goals
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Track your targets</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <AnimatedBar value={48500} maxValue={60000} label="Revenue Target ($60k)" delay={0.6} />
                                <AnimatedBar value={342} maxValue={400} label="Member Target (400)" delay={0.7} />
                                <AnimatedBar value={28} maxValue={50} label="New Sign-ups (50)" delay={0.8} />
                                <AnimatedBar value={15} maxValue={20} label="PT Sessions Sold (20)" delay={0.9} />
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Quick Stats */}
                    <SlideIn direction="up" delay={0.6}>
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" /> Performance Highlights
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Key metrics this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Peak Hour", value: "6:00 PM", icon: Activity, color: "text-amber-400" },
                                        { label: "Avg. Visit Duration", value: "74 min", icon: TrendingUp, color: "text-emerald-400" },
                                        { label: "Class Attendance", value: "89%", icon: Users, color: "text-blue-400" },
                                        { label: "Equipment Usage", value: "High", icon: Zap, color: "text-purple-400" },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={stat.label}
                                            className="p-4 bg-secondary rounded-xl border border-border"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.7 + i * 0.1 }}
                                        >
                                            <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                                            <div className="text-xl font-black text-foreground">{stat.value}</div>
                                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>
            </div>
        </AnimatedPage>
    );
}
