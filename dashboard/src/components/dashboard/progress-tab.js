"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTab = ProgressTab;
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
function ProgressTab({ member }) {
    // Mock data for charts
    const weightData = [
        { date: 'Week 1', weight: 85 },
        { date: 'Week 2', weight: 84.5 },
        { date: 'Week 3', weight: 83.8 },
        { date: 'Week 4', weight: 83.2 },
        { date: 'Week 5', weight: 82.5 },
        { date: 'Week 6', weight: 82.1 },
    ];
    return (<div className="space-y-6">
            {/* Snapshot Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">Adherence Score</card_1.CardTitle>
                        <lucide_react_1.Activity className="h-4 w-4 text-green-500"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+2% from last week</p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">Weight Change</card_1.CardTitle>
                        <lucide_react_1.TrendingDown className="h-4 w-4 text-green-500"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">-2.9 kg</div>
                        <p className="text-xs text-muted-foreground">Last 6 weeks</p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">Workouts Done</card_1.CardTitle>
                        <lucide_react_1.CheckCircle className="h-4 w-4 text-blue-500"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">22/24</div>
                        <p className="text-xs text-muted-foreground">91% completion rate</p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">Last Check-in</card_1.CardTitle>
                        <lucide_react_1.Calendar className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">2d ago</div>
                        <p className="text-xs text-muted-foreground">Status: On Track</p>
                    </card_1.CardContent>
                </card_1.Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Weight Chart */}
                <card_1.Card className="col-span-1">
                    <card_1.CardHeader>
                        <card_1.CardTitle>Weight Trend</card_1.CardTitle>
                        <card_1.CardDescription>Consistent progress over the last 6 weeks.</card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <recharts_1.ResponsiveContainer width="100%" height="100%">
                                <recharts_1.LineChart data={weightData}>
                                    <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <recharts_1.XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }}/>
                                    <recharts_1.YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} tick={{ fontSize: 12 }}/>
                                    <recharts_1.Tooltip />
                                    <recharts_1.Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                                </recharts_1.LineChart>
                            </recharts_1.ResponsiveContainer>
                        </div>
                    </card_1.CardContent>
                </card_1.Card>

                {/* Check-in Timeline */}
                <card_1.Card className="col-span-1">
                    <card_1.CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <card_1.CardTitle>Check-in History</card_1.CardTitle>
                            <card_1.CardDescription>Weekly reviews and status updates.</card_1.CardDescription>
                        </div>
                        <button_1.Button size="sm" variant="outline">Add Manual Check-in</button_1.Button>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <scroll_area_1.ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"/>
                                        <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -z-10"/>
                                    </div>
                                    <div className="flex-1 pb-6 border-b last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Weekly Review</p>
                                            <span className="text-xs text-muted-foreground">Dec 04, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Great week! Hit all protein targets. Weight is dropping steadily. No issues reported."
                                        </p>
                                        <badge_1.Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</badge_1.Badge>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full ring-4 ring-yellow-100"/>
                                        <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -z-10"/>
                                    </div>
                                    <div className="flex-1 pb-6 border-b last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Weekly Review</p>
                                            <span className="text-xs text-muted-foreground">Nov 27, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Missed 2 workouts due to work stress. Diet was okay but snacks were high."
                                        </p>
                                        <badge_1.Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">At Risk</badge_1.Badge>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm">Initial Plan Setup</p>
                                            <span className="text-xs text-muted-foreground">Nov 20, 2025</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            "Assigned 1500 kcal Veg plan + 4 Day Split. Goal: Lose 5kg."
                                        </p>
                                        <badge_1.Badge variant="outline">Plan Started</badge_1.Badge>
                                    </div>
                                </div>
                            </div>
                        </scroll_area_1.ScrollArea>
                    </card_1.CardContent>
                </card_1.Card>
            </div>
        </div>);
}
