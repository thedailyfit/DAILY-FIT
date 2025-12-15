"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeightChart = ClientWeightChart;
const recharts_1 = require("recharts");
const data = [
    {
        date: "Jan 01",
        weight: 82,
    },
    {
        date: "Jan 15",
        weight: 81.5,
    },
    {
        date: "Feb 01",
        weight: 80.8,
    },
    {
        date: "Feb 15",
        weight: 79.5,
    },
    {
        date: "Mar 01",
        weight: 79.0,
    },
    {
        date: "Mar 15",
        weight: 78.2,
    },
    {
        date: "Apr 01",
        weight: 77.5,
    },
];
function ClientWeightChart() {
    return (<recharts_1.ResponsiveContainer width="100%" height={350}>
            <recharts_1.LineChart data={data}>
                <recharts_1.XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <recharts_1.YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} domain={['dataMin - 2', 'dataMax + 2']}/>
                <recharts_1.Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--foreground)' }}/>
                <recharts_1.Line type="monotone" dataKey="weight" stroke="currentColor" strokeWidth={2} dot={false} className="stroke-primary"/>
            </recharts_1.LineChart>
        </recharts_1.ResponsiveContainer>);
}
