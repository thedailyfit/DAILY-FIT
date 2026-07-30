"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { createClient } from "@/lib/supabase"

export function ClientWeightChart({ memberId }: { memberId: string }) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchWeightData() {
            const supabase = createClient()
            let chartData: { date: string; weight: number }[] = []

            // Fetch from weight_logs
            const { data: weightLogs, error: weightError } = await supabase
                .from('weight_logs')
                .select('*')
                .eq('member_id', memberId)
                .order('logged_at', { ascending: true })

            if (weightLogs && weightLogs.length > 0) {
                chartData = weightLogs.map((log: any) => ({
                    date: log.logged_at ? new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '',
                    weight: log.weight
                }))
            } else {
                // Try check_ins table as fallback
                const { data: checkInLogs, error: checkInError } = await supabase
                    .from('check_ins')
                    .select('created_at, current_weight')
                    .eq('member_id', memberId)
                    .order('created_at', { ascending: true })

                if (checkInLogs && checkInLogs.length > 0) {
                    chartData = checkInLogs
                        .filter((log: any) => log.current_weight)
                        .map((log: any) => ({
                            date: log.created_at ? new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '',
                            weight: log.current_weight
                        }))
                }
            }

            setData(chartData)
            setLoading(false)
        }

        if (memberId) {
            fetchWeightData()
        } else {
            setLoading(false)
        }
    }, [memberId])

    if (loading) {
        return <div className="flex h-[350px] items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
    }

    if (data.length === 0) {
        return (
            <div className="flex h-[350px] flex-col items-center justify-center text-muted-foreground">
                <p className="text-sm font-medium">No weight data recorded yet</p>
                <p className="text-xs mt-1">Weight logs or check-ins will appear here.</p>
            </div>
        )
    }

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
                    dot={{ r: 3 }}
                    className="stroke-primary"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export { ClientWeightChart as WeightChart }
export default ClientWeightChart
