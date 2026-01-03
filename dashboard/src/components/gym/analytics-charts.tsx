"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const revData = [
    { name: "Oct", revenue: 4000, expenses: 2400 },
    { name: "Nov", revenue: 3000, expenses: 1398 },
    { name: "Dec", revenue: 2000, expenses: 9800 },
    { name: "Jan", revenue: 2780, expenses: 3908 },
    { name: "Feb", revenue: 1890, expenses: 4800 },
    { name: "Mar", revenue: 2390, expenses: 3800 },
    { name: "Apr", revenue: 3490, expenses: 4300 },
];

const growthData = [
    { name: "Oct", members: 20, trainers: 2 },
    { name: "Nov", members: 35, trainers: 2 },
    { name: "Dec", members: 50, trainers: 3 },
    { name: "Jan", members: 65, trainers: 3 },
    { name: "Feb", members: 80, trainers: 4 },
    { name: "Mar", members: 95, trainers: 4 },
    { name: "Apr", members: 120, trainers: 5 },
];

const expenseData = [
    { name: "Rent", value: 2500 },
    { name: "Salaries", value: 4500 },
    { name: "Equipment", value: 1200 },
    { name: "Utilities", value: 800 },
    { name: "Marketing", value: 600 },
];

const COLORS = ["#212121", "#cbfe00", "#7f7f7f", "#e5e5e5", "#000000"];

export function AnalyticsCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 shadow-sm border-zinc-200">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly income vs expenses (Past 6 Months)</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={revData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#cbfe00" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#cbfe00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#cbfe00" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="expenses" stroke="#ff4d4d" strokeWidth={2} fillOpacity={0} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-1 shadow-sm border-zinc-200">
                <CardHeader>
                    <CardTitle>Expense Split</CardTitle>
                    <CardDescription>Breakdown by category</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={expenseData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 shadow-sm border-zinc-200">
                <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                    <CardDescription>Member acquisition rate</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={growthData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend />
                            <Bar dataKey="members" name="Active Members" fill="#212121" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="trainers" name="Trainers" fill="#cbfe00" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
