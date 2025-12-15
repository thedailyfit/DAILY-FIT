import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Dumbbell, AlertCircle, ArrowRight, Plus, Sparkles, TrendingUp, IndianRupee } from 'lucide-react'
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OverviewCharts } from "@/components/dashboard/overview-charts"

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

    // 5. Total Revenue (New)
    const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')

    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

    return {
        totalClients: totalClients || 0,
        activePlans: activePlans || 0,
        alerts: lowAdherenceCount || 0,
        recentClients: recentClients || [],
        totalRevenue
    }
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{greeting}, Coach</h2>
                    <p className="text-muted-foreground">
                        Here's your DailyFit AI command center summary.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Download Report</Button>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Sparkles className="mr-2 h-4 w-4" /> AI Insights
                    </Button>
                </div>
            </div>

            {/* KPI Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-card to-primary/5 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 new this week
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Plans
                        </CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">
                            98% adherence rate
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-red-200 dark:border-red-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Alerts
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.alerts}</div>
                        <p className="text-xs text-muted-foreground">
                            Clients need attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <OverviewCharts />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Clients */}
                <Card className="col-span-4 hover:shadow-md transition-shadow">
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
                                    <div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="grid gap-1">
                                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{client.name}</p>
                                                <p className="text-xs text-muted-foreground">{client.phone_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={client.status === 'Active' ? 'default' : 'secondary'} className={client.status === 'Active' ? "bg-green-500 hover:bg-green-600" : ""}>
                                                {client.status || 'Active'}
                                            </Badge>
                                            <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                <Card className="col-span-3 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start shadow-sm" asChild>
                            <Link href="/dashboard/clients">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Client
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start hover:border-primary/50 transition-colors" asChild>
                            <Link href="/dashboard/plans/diets/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Diet Template
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start hover:border-primary/50 transition-colors" asChild>
                            <Link href="/dashboard/plans/workouts/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Workout Template
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" asChild>
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
