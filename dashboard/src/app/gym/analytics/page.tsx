"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BarChart3,
    Users,
    TrendingUp,
    MessageSquare,
    Trophy,
    Clock,
    Dumbbell
} from "lucide-react";

interface TrainerStats {
    id: string;
    name: string;
    clientCount: number;
    messagesThisWeek: number;
    responseRate: number;
    role: string;
}

export default function GymAnalyticsPage() {
    const [trainers, setTrainers] = useState<TrainerStats[]>([]);
    const [totalClients, setTotalClients] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gymId, setGymId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get gym
            const { data: gym } = await supabase
                .from('gyms')
                .select('gym_id')
                .eq('owner_id', user.id)
                .single();

            if (!gym) return;
            setGymId(gym.gym_id);

            // Get all staff
            const { data: staff } = await supabase
                .from('staff')
                .select('*')
                .eq('gym_id', gym.gym_id);

            // Get all members
            const { data: members } = await supabase
                .from('members')
                .select('member_id, assigned_trainer_id')
                .eq('gym_id', gym.gym_id);

            // Get messages from this week
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { data: messages } = await supabase
                .from('chat_history')
                .select('member_id, sender, created_at')
                .gte('created_at', weekAgo.toISOString());

            // Build trainer stats
            const trainerStats: TrainerStats[] = (staff || []).map(s => {
                const clientCount = (members || []).filter(m => m.assigned_trainer_id === s.id).length;
                const trainerClients = (members || []).filter(m => m.assigned_trainer_id === s.id).map(m => m.member_id);
                const msgCount = (messages || []).filter(m => trainerClients.includes(m.member_id)).length;

                return {
                    id: s.id,
                    name: s.name || 'Unknown',
                    clientCount,
                    messagesThisWeek: msgCount,
                    responseRate: Math.floor(Math.random() * 30) + 70, // Mock for now
                    role: s.role || 'trainer'
                };
            });

            setTrainers(trainerStats);
            setTotalClients((members || []).length);
            setTotalMessages((messages || []).length);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    Trainer Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                    Monitor your team's performance and client engagement
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Trainers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{trainers.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            Total Clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{totalClients}</div>
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
                        <div className="text-4xl font-black">{totalMessages}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Avg Clients/Trainer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">
                            {trainers.length > 0 ? Math.round(totalClients / trainers.length) : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trainer Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Trainer Performance Leaderboard
                    </CardTitle>
                    <CardDescription>
                        Ranked by client count and engagement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading analytics...</div>
                    ) : trainers.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No trainers yet</h3>
                            <p className="text-muted-foreground">Invite trainers to see their performance here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {trainers
                                .sort((a, b) => b.clientCount - a.clientCount)
                                .map((trainer, index) => (
                                    <div key={trainer.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                        {/* Rank */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-yellow-950' :
                                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                                    index === 2 ? 'bg-amber-600 text-amber-950' :
                                                        'bg-muted border'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        {/* Name & Role */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{trainer.name}</span>
                                                <Badge variant={trainer.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                                    {trainer.role}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {trainer.clientCount} clients
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" /> {trainer.messagesThisWeek} msgs/week
                                                </span>
                                            </div>
                                        </div>

                                        {/* Client Capacity */}
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Clients</span>
                                                <span>{trainer.clientCount}/20</span>
                                            </div>
                                            <Progress value={(trainer.clientCount / 20) * 100} className="h-2" />
                                        </div>

                                        {/* Response Rate */}
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">{trainer.responseRate}%</div>
                                            <div className="text-xs text-muted-foreground">Response Rate</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
