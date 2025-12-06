"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, TrendingDown, Activity, Calendar, CheckCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressTabProps {
    member: any
}

export function ProgressTab({ member }: ProgressTabProps) {
    // Mock data for charts
    const weightData = [
        { date: 'Week 1', weight: 85 },
        { date: 'Week 2', weight: 84.5 },
        { date: 'Week 3', weight: 83.8 },
        { date: 'Week 4', weight: 83.2 },
        { date: 'Week 5', weight: 82.5 },
        { date: 'Week 6', weight: 82.1 },
    ]

    return (
        <div className="space-y-6">
            {/* Snapshot Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Adherence Score</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+2% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-2.9 kg</div>
                        <p className="text-xs text-muted-foreground">Last 6 weeks</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Workouts Done</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22/24</div>
                        <p className="text-xs text-muted-foreground">91% completion rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Check-in</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2d ago</div>
                        <p className="text-xs text-muted-foreground">Status: On Track</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Weight Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Weight Trend</CardTitle>
                        <CardDescription>Consistent progress over the last 6 weeks.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Check-in Timeline */}
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Check-in History</CardTitle>
                            <CardDescription>Weekly reviews and status updates.</CardDescription>
                        </div>
                        <Button size="sm" variant="outline">Add Manual Check-in</Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100" />
                                        <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -z-10" />
                                    </div>
                                    <div className="flex-1 pb-6 border-b last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Weekly Review</p>
                                            <span className="text-xs text-muted-foreground">Dec 04, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Great week! Hit all protein targets. Weight is dropping steadily. No issues reported."
                                        </p>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full ring-4 ring-yellow-100" />
                                        <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -z-10" />
                                    </div>
                                    <div className="flex-1 pb-6 border-b last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Weekly Review</p>
                                            <span className="text-xs text-muted-foreground">Nov 27, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Missed 2 workouts due to work stress. Diet was okay but snacks were high."
                                        </p>
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">At Risk</Badge>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Initial Plan Setup</p>
                                            <span className="text-xs text-muted-foreground">Nov 20, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Assigned 1500 kcal Veg plan + 4 Day Split. Goal: Lose 5kg."
                                        </p>
                                        <Badge variant="outline">Plan Started</Badge>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
