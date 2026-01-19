"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    MessageSquare,
    ArrowLeft,
    Mail,
    Phone,
    Activity,
    Dumbbell
} from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TrainerData {
    id: string;
    name: string;
    email: string;
    whatsapp_notification_number: string;
    created_at: string;
}

interface Client {
    member_id: string;
    name: string;
    phone_number: string;
    status: string;
    created_at: string;
}

export default function TrainerViewPage() {
    const params = useParams();
    const router = useRouter();
    const trainerId = params.id as string;

    const [trainer, setTrainer] = useState<TrainerData | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState({
        clientCount: 0,
        messagesThisWeek: 0,
        activeClients: 0
    });
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchTrainerData();
    }, [trainerId]);

    const fetchTrainerData = async () => {
        try {
            // Get trainer info
            const { data: trainerData } = await supabase
                .from('staff')
                .select('*')
                .eq('id', trainerId)
                .single();

            if (trainerData) {
                setTrainer(trainerData);

                // Get assigned clients
                const { data: members, count } = await supabase
                    .from('members')
                    .select('*', { count: 'exact' })
                    .eq('assigned_trainer_id', trainerId);

                setClients(members || []);

                // Get messages this week
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);

                const memberIds = members?.map(m => m.member_id) || [];

                let messageCount = 0;
                if (memberIds.length > 0) {
                    const { count: msgCount } = await supabase
                        .from('chat_history')
                        .select('*', { count: 'exact', head: true })
                        .in('member_id', memberIds)
                        .gte('created_at', weekAgo.toISOString());

                    messageCount = msgCount || 0;
                }

                setStats({
                    clientCount: count || 0,
                    messagesThisWeek: messageCount,
                    activeClients: members?.filter(m => m.status === 'active').length || 0
                });
            }
        } catch (error) {
            console.error('Error fetching trainer data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading trainer data...</div>;
    }

    if (!trainer) {
        return <div className="p-8">Trainer not found</div>;
    }

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Gym Dashboard
            </Button>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                            {trainer.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">{trainer.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> {trainer.email}
                                </span>
                                {trainer.whatsapp_notification_number && (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Phone className="h-3 w-3" /> {trainer.whatsapp_notification_number}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Pro Trainer
                </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Assigned Clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">{stats.clientCount}</span>
                            <span className="text-muted-foreground mb-1">/ 10 max</span>
                        </div>
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
                    </CardContent>
                </Card>
            </div>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Assigned Clients
                    </CardTitle>
                    <CardDescription>
                        Clients managed by {trainer.name}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {clients.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No clients assigned yet</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.member_id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.phone_number}</TableCell>
                                        <TableCell>
                                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                                                {client.status || 'active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
