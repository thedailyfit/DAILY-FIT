import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

async function getDashboardStats() {
    const supabase = createClient()

    // 1. Total Clients
    const { count: totalClients } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })

    // 2. Active Plans (approximation for now)
    const { count: activePlans } = await supabase
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // 3. Alerts (Clients with low adherence)
    const { count: lowAdherenceCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .lt('adherence_score', 70)

    // 4. Recent Clients
    const { data: recentClients } = await supabase
        .from('members')
        .select('id, name, goal, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalClients: totalClients || 0,
        activePlans: activePlans || 0,
        alerts: lowAdherenceCount || 0,
        recentClients: recentClients || []
    }
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()
}
