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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, Trainer!</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/dashboard/clients">Manage Clients</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">Workout plans active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attention Needed</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.alerts}</div>
                        <p className="text-xs text-muted-foreground">Clients with low adherence</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Clients Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentClients.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No clients found.</p>
                            ) : (
                                stats.recentClients.map((client) => (
                                    <div key={client.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} alt="Avatar" />
                                            <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{client.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {client.goal?.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/dashboard/clients/${client.id}`}>
                                                    View <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Tips - Placeholder for now could be refined later */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/plans/diets/new">
                                + Create New Diet Template
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" isDisabled>
                            + Create New Workout Template (Coming Soon)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
