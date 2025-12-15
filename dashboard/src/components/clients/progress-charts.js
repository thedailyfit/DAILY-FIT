"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCharts = ProgressCharts;
const recharts_1 = require("recharts");
const card_1 = require("@/components/ui/card");
function ProgressCharts({ data }) {
    // Sort data by date ascending
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Format date for display
    const chartData = sortedData.map(entry => (Object.assign(Object.assign({}, entry), { displayDate: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })));
    if (data.length === 0) {
        return (<div className="flex h-48 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No progress data logged yet.
            </div>);
    }
    return (<div className="grid gap-4 md:grid-cols-2">
            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-sm font-medium">Weight Trend</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="h-[250px] w-full">
                        <recharts_1.ResponsiveContainer width="100%" height="100%">
                            <recharts_1.LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <recharts_1.XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 12 }}/>
                                <recharts_1.YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12 }}/>
                                <recharts_1.Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                <recharts_1.Line type="monotone" dataKey="weight_kg" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }}/>
                            </recharts_1.LineChart>
                        </recharts_1.ResponsiveContainer>
                    </div>
                </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-sm font-medium">Body Fat %</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="h-[250px] w-full">
                        <recharts_1.ResponsiveContainer width="100%" height="100%">
                            <recharts_1.AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorBodyFat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <recharts_1.XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 12 }}/>
                                <recharts_1.YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'auto']} tick={{ fontSize: 12 }}/>
                                <recharts_1.Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                <recharts_1.Area type="monotone" dataKey="body_fat_percentage" stroke="#10b981" fillOpacity={1} fill="url(#colorBodyFat)"/>
                            </recharts_1.AreaChart>
                        </recharts_1.ResponsiveContainer>
                    </div>
                </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="md:col-span-2">
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-sm font-medium">Adherence Score (1-10)</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="h-[250px] w-full">
                        <recharts_1.ResponsiveContainer width="100%" height="100%">
                            <recharts_1.BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <recharts_1.XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 12 }}/>
                                <recharts_1.YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 10]} tick={{ fontSize: 12 }}/>
                                <recharts_1.Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                <recharts_1.Bar dataKey="adherence_score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40}/>
                            </recharts_1.BarChart>
                        </recharts_1.ResponsiveContainer>
                    </div>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
}
