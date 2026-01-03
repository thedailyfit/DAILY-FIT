"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, Dumbbell, UserPlus, ArrowUpRight, ShieldCheck, Activity, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GymOwnerDashboard() {
    // Mock Data - More Realistic
    const trainers = [
        { id: 1, name: "Alice Fit", clients: 15, status: "Active", revenue: "$1,200", lastActive: "2m ago" },
        { id: 2, name: "Bob Builder", clients: 8, status: "Active", revenue: "$850", lastActive: "1h ago" },
        { id: 3, name: "Charlie Cardio", clients: 0, status: "Offline", revenue: "$0", lastActive: "2d ago" },
        { id: 4, name: "Dana Lift", clients: 22, status: "Active", revenue: "$2,100", lastActive: "5m ago" },
    ];

    return (
        <main className="p-8 space-y-8 bg-[#e6e6e6] min-h-screen text-black">
            {/* Intelligent Header - Glassmorphism */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sticky top-0 z-10 bg-[#e6e6e6]/80 backdrop-blur-md py-4 border-b border-black/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-black/20 text-black/60 font-mono text-[10px] uppercase tracking-wider">Gym Owner Admin</Badge>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <h1 className="text-4xl font-black text-[#212121] tracking-tighter uppercase">Iron Pump Fitness</h1>
                    <p className="text-zinc-500 font-medium">Flagship Location • New York, NY</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-transparent border-black text-black hover:bg-black hover:text-white font-bold transition-all h-10 px-6">
                        Invite Staff
                    </Button>
                    <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold h-10 px-6 shadow-lg shadow-[#cbfe00]/20 transition-all">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Trainer
                    </Button>
                </div>
            </div>

            {/* Stats Overview - High Contrast Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[#212121] border-none shadow-xl text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-[#cbfe00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">$12,450</div>
                        <p className="text-xs text-[#cbfe00] flex items-center mt-1 font-bold">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-[#212121] border-none shadow-xl text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active Members</CardTitle>
                        <Users className="h-4 w-4 text-[#cbfe00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">128</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            +8 new this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-[#cbfe00] border-none shadow-xl text-black">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-black/60 uppercase tracking-wider">New Leads</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-black">24</div>
                        <p className="text-xs text-black/70 flex items-center mt-1 font-bold">
                            12 unread enquiries
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-xl text-black">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Broadcast</CardTitle>
                        <Activity className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-black text-white hover:bg-zinc-800 h-8 text-xs font-bold">
                            Send Message
                        </Button>
                        <p className="text-[10px] text-zinc-400 mt-2">
                            Reach all 128 active members.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Data Section */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Trainers Table (Takes up 2 columns) */}
                <Card className="md:col-span-2 shadow-sm border-none bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-bold text-black">Trainer Performance</CardTitle>
                                <CardDescription>Real-time oversight of staff metrics.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-black">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-100 hover:bg-transparent">
                                    <TableHead className="w-[200px] text-xs font-bold uppercase text-zinc-400">Trainer</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-zinc-400">Status</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-zinc-400">Clients</TableHead>
                                    <TableHead className="text-xs font-bold uppercase text-zinc-400">Est. Revenue</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase text-zinc-400">Last Active</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainers.map((t) => (
                                    <TableRow key={t.id} className="border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer group">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-[#cbfe00] transition-all">
                                                    {t.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-black">{t.name}</div>
                                                    <div className="text-xs text-zinc-500">Certified L3</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={
                                                t.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                                                    : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                            }>
                                                {t.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-black">{t.clients}</span>
                                                <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-black rounded-full" style={{ width: `${(t.clients / 30) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-zinc-600 font-medium">
                                            {t.revenue}
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-zinc-400">
                                            {t.lastActive}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Actions / Notifications */}
                <div className="space-y-6">
                    <Card className="bg-[#212121] text-white border-none shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#cbfe00] rounded-full -mr-16 -mt-16 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-[#cbfe00]" />
                                Subscription
                            </CardTitle>
                            <CardDescription className="text-zinc-400">Gym SaaS Plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <div className="text-3xl font-black text-white">PRO<span className="text-lg font-medium text-zinc-500 ml-2">Plan</span></div>
                                <p className="text-sm text-zinc-500 mt-1">Next billing: Dec 25, 2024</p>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-[#cbfe00] hover:text-black font-bold h-12 transition-all">
                                Manage Billing
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 pb-4 border-b border-zinc-50 last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-[#cbfe00] shadow-[0_0_8px_#cbfe00]"></div>
                                    <div>
                                        <p className="text-sm font-bold text-black">New Trainer Application</p>
                                        <p className="text-xs text-zinc-500">John Doe wants to join.</p>
                                        <p className="text-[10px] text-zinc-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-4 pt-0">
                            <Button variant="outline" className="w-full border-zinc-200 text-zinc-600 hover:text-black hover:border-black text-xs h-8">View All Alerts</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
