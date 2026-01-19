"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase";
import {
    Users,
    MessageSquare,
    TrendingUp,
    Calendar,
    Trophy,
    Target,
    Activity,
    Dumbbell
} from "lucide-react";
import Link from "next/link";

export default function TrainerDashboard() {
    const [stats, setStats] = useState({
        clientCount: 0,
        clientLimit: 20,
        messagesThisWeek: 0,
        activeClients: 0,
        workoutsAssigned: 0
    });
    const [trainerName, setTrainerName] = useState("Trainer");
    const [gymName, setGymName] = useState("");
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer info
            const { data: staff } = await supabase
                .from('staff')
                .select('name, id, gym_id')
                .eq('auth_id', user.id)
                .single();

            if (staff) {
                setTrainerName(staff.name || 'Trainer');

                // Get gym name
                const { data: gym } = await supabase
                    .from('gyms')
                    .select('gym_name')
                    .eq('gym_id', staff.gym_id)
                    .single();

                if (gym) setGymName(gym.gym_name);

                // Count clients
                const { count: clientCount } = await supabase
                    .from('members')
                    .select('*', { count: 'exact', head: true })
                    .eq('assigned_trainer_id', staff.id);

                // Count messages this week
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);

                const { count: messageCount } = await supabase
                    .from('chat_history')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', weekAgo.toISOString());

                setStats({
                    clientCount: clientCount || 0,
                    clientLimit: 10, // Pro Plan trainer limit
                    messagesThisWeek: messageCount || 0,
                    activeClients: clientCount || 0,
                    workoutsAssigned: 12 // Mock for now
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Welcome back, {trainerName}! 💪
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {gymName && <Badge variant="outline" className="mr-2">{gymName}</Badge>}
                        Here's your performance overview
                    </p>
                </div>
                <Link href="/trainer/clients">
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Users className="h-4 w-4" />
                        View My Clients
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Assigned Clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">{stats.clientCount}</span>
                            <span className="text-muted-foreground mb-1">/ {stats.clientLimit}</span>
                        </div>
                        {stats.clientCount >= stats.clientLimit ? (
                            <p className="text-xs text-destructive mt-1">Limit reached</p>
                        ) : (
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.clientLimit - stats.clientCount} slots available
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Messages This Week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.messagesThisWeek}</div>
                        <p className="text-xs text-green-600 mt-1">↑ Active engagement</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Active Clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.activeClients}</div>
                        <p className="text-xs text-muted-foreground mt-1">Messaged this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            Workouts Assigned
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.workoutsAssigned}</div>
                        <p className="text-xs text-muted-foreground mt-1">This month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <Link href="/trainer/clients">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Manage Clients
                            </CardTitle>
                            <CardDescription>
                                View and manage your assigned clients
                            </CardDescription>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <Link href="/trainer/messages">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-green-500" />
                                WhatsApp Inbox
                            </CardTitle>
                            <CardDescription>
                                Reply to client messages
                            </CardDescription>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <Link href="/trainer/workouts">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-orange-500" />
                                Workout Plans
                            </CardTitle>
                            <CardDescription>
                                Create and assign workout plans
                            </CardDescription>
                        </CardHeader>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
