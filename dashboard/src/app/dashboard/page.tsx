import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Dumbbell, AlertCircle, ArrowRight, Plus, Sparkles } from 'lucide-react'
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        .select('id, name, phone_number, status, created_at')
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back to <span className="font-semibold text-primary">DailyFit AI</span>. Here's what's happening today.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Plans
                        </CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">
                            +5 new this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Alerts
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.alerts}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            AI Suggestions
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Plan optimizations
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Clients */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Clients</CardTitle>
                        <CardDescription>
                            You have {stats.totalClients} total clients.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentClients.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No clients yet.</p>
                            ) : (
                                stats.recentClients.map(client => (
                                    <div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="grid gap-1">
                                                <p className="text-sm font-medium leading-none">{client.name}</p>
                                                <p className="text-xs text-muted-foreground">{client.phone_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                                                {client.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/clients/${client.id}`}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start" asChild>
                            <Link href="/dashboard/clients">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Client
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/plans/diets/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Diet Template
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/plans/workouts/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Workout Template
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                            <Link href="/dashboard/settings">
                                Configure Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
