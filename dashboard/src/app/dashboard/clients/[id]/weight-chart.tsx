"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
]

export function ClientWeightChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <XAxis
                    dataKey="date"
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
                    tickFormatter={(value) => `${value}kg`}
                    domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="currentColor"
                    strokeWidth={2}
                    dot={false}
                    className="stroke-primary"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
