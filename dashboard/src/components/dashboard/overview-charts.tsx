"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData = [
    { name: "Jan", total: 15000 },
    { name: "Feb", total: 22000 },
    { name: "Mar", total: 28000 },
    { name: "Apr", total: 35000 },
    { name: "May", total: 42000 },
    { name: "Jun", total: 48500 },
]

const growthData = [
    { name: "Jan", active: 5 },
    { name: "Feb", active: 8 },
    { name: "Mar", active: 12 },
    { name: "Apr", active: 15 },
    { name: "May", active: 22 },
    { name: "Jun", active: 28 },
]

export function OverviewCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gradient-to-br from-card to-secondary/20">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                        Monthly revenue for the last 6 months
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={revenueData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar
                                dataKey="total"
                                fill="var(--color-primary)"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-3 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                    <CardTitle>Client Growth</CardTitle>
                    <CardDescription>
                        Active clients trend
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="active"
                                stroke="var(--color-primary)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorActive)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
