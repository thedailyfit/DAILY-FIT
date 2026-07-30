"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Users, DollarSign, Building, Settings, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminDashboard() {
    const [gyms, setGyms] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalRevenue: 0, activeGyms: 0, totalTrainers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAdminData() {
            try {
                const supabase = createClient();

                // Fetch gyms
                const { data: gymData } = await supabase
                    .from('gyms')
                    .select('*')
                    .order('created_at', { ascending: false });

                // Fetch total revenue
                const { data: payments } = await supabase
                    .from('payments')
                    .select('amount')
                    .eq('status', 'paid');
                const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

                // Fetch total trainers
                const { count: trainerCount } = await supabase
                    .from('staff')
                    .select('*', { count: 'exact', head: true });

                // Fetch member counts per gym
                const { data: members } = await supabase
                    .from('members')
                    .select('trainer_id');

                const mappedGyms = (gymData || []).map((gym: any) => ({
                    id: gym.gym_id || gym.id,
                    name: gym.gym_name || 'Unnamed Gym',
                    owner: gym.owner_id?.substring(0, 8) || 'Unknown',
                    status: gym.subscription_status === 'active' || gym.subscription_status === 'trial' ? 'Active' : 'Past Due',
                    trainers: 0,
                    revenue: `₹${(gym.monthly_revenue || 0).toLocaleString()}`
                }));

                setGyms(mappedGyms);
                setStats({
                    totalRevenue,
                    activeGyms: mappedGyms.filter((g: any) => g.status === 'Active').length,
                    totalTrainers: trainerCount || 0
                });
            } catch (err) {
                console.error("Error loading admin data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadAdminData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block">
                <div className="mb-8 flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-500 rounded flex items-center justify-center font-bold">A</div>
                    <span className="text-lg font-bold">DailyFit Admin</span>
                </div>
                <nav className="space-y-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-indigo-400 bg-white/10">
                            <Activity className="mr-2 h-4 w-4" /> Overview
                        </Button>
                    </Link>
                    <Link href="/admin/payments">
                        <Button variant="ghost" className="w-full justify-start hover:text-white hover:bg-white/10">
                            <DollarSign className="mr-2 h-4 w-4" /> Revenue
                        </Button>
                    </Link>
                    <Link href="/admin/support">
                        <Button variant="ghost" className="w-full justify-start hover:text-white hover:bg-white/10">
                            <Settings className="mr-2 h-4 w-4" /> Support
                        </Button>
                    </Link>
                </nav>
                <div className="mt-auto pt-8">
                    <button
                        onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            document.cookie = 'dailyfit_demo_auth=; path=/; max-age=0';
                            document.cookie = 'dailyfit_demo_email=; path=/; max-age=0';
                            document.cookie = 'dailyfit_role=; path=/; max-age=0';
                            window.location.href = '/admin/login';
                        }}
                        className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm"
                    >
                        <Settings className="h-4 w-4" /> Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
                        <p className="text-slate-500">Welcome back, Super Admin.</p>
                    </div>
                    <Button>+ Add New Gym</Button>
                </header>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (MRR)</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Gyms</CardTitle>
                            <Building className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeGyms}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTrainers}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Gyms Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Gyms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {gyms.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <Building className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p className="font-medium">No gyms registered yet</p>
                                <p className="text-sm">Gyms will appear here once they sign up</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Gym Name</TableHead>
                                        <TableHead>Owner ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gyms.map(gym => (
                                        <TableRow key={gym.id}>
                                            <TableCell className="font-medium">{gym.name}</TableCell>
                                            <TableCell className="text-muted-foreground font-mono text-xs">{gym.owner}</TableCell>
                                            <TableCell>
                                                <Badge variant={gym.status === "Active" ? "default" : "destructive"} className={gym.status === "Active" ? "bg-green-100 text-green-800" : ""}>
                                                    {gym.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{gym.revenue}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
