"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Users, Search, UserPlus, MessageSquare, MoreHorizontal, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TrainerClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [staffId, setStaffId] = useState<string | null>(null);
    const clientLimit = 20;

    const supabase = createClient();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get staff ID
            const { data: staff } = await supabase
                .from('staff')
                .select('id')
                .eq('auth_id', user.id)
                .single();

            if (staff) {
                setStaffId(staff.id);

                // Fetch only assigned clients
                const { data: members } = await supabase
                    .from('members')
                    .select('*')
                    .eq('assigned_trainer_id', staff.id)
                    .order('created_at', { ascending: false });

                setClients(members || []);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery)
    );

    const isAtLimit = clients.length >= clientLimit;

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        My Clients
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2">{clients.length} / {clientLimit}</Badge>
                        Assigned to you
                    </p>
                </div>

                {isAtLimit ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">Client limit reached</span>
                    </div>
                ) : (
                    <Button disabled className="gap-2 font-bold opacity-50 cursor-not-allowed">
                        <UserPlus className="h-4 w-4" />
                        Request More Clients
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search clients by name or phone..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Assigned Clients</CardTitle>
                    <CardDescription>
                        Clients assigned to you by the gym owner
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">Loading clients...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No clients yet</h3>
                            <p className="text-muted-foreground">
                                Ask your gym owner to assign clients to you.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.member_id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                                                    {client.name?.charAt(0) || '?'}
                                                </div>
                                                {client.name || 'Unknown'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{client.phone || client.whatsapp_id || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                                                {client.status || 'active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    Chat
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
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
