"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, Dumbbell, UserPlus, ArrowUpRight, ShieldCheck, Activity, CreditCard, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard, AnimatedList } from "@/components/gym/animated-components";

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
            <AnimatedList className="grid gap-4 md:grid-cols-5">
                <AnimatedCard delay={0.1} className="bg-[#212121] text-white shadow-xl rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Revenue</span>
                        <DollarSign className="h-4 w-4 text-[#cbfe00] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">$12,450</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 text-[#cbfe00]">+12.5% vs last month</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="bg-[#212121] text-white shadow-xl rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Due</span>
                        <AlertCircle className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">$1,800</div>
                        <p className="text-[10px] text-red-400 font-bold mt-1">15 Members Pending</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="bg-[#212121] text-white shadow-xl rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active Members</span>
                        <Users className="h-4 w-4 text-[#cbfe00] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">128</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">+8 new this week</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.4} className="bg-[#212121] text-white shadow-xl rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Cardio Only</span>
                        <Activity className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">45</div>
                        <p className="text-[10px] text-blue-400 font-bold mt-1">Treadmill/Cycle Plan</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.5} className="bg-[#cbfe00] text-black shadow-xl rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                        <span className="text-sm font-bold text-black uppercase tracking-wider">New Leads</span>
                        <ShieldCheck className="h-4 w-4 text-black group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-black">24</div>
                        <p className="text-[10px] text-black/70 font-bold mt-1">12 unread enquiries</p>
                    </div>
                </AnimatedCard>
            </AnimatedList>
            <Card className="bg-white border-none shadow-xl">
                <div className="flex items-center justify-between p-4">
                    <div>
                        <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Activity className="h-4 w-4 text-black" /> Broadcast
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Reach all 128 active members.</p>
                    </div>
                    <Button className="bg-black text-white hover:bg-zinc-800 h-8 text-xs font-bold px-6">
                        Send Message
                    </Button>
                </div>
            </Card>

            {/* Main Data Section */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Trainer Performance Table */}
                <Card className="md:col-span-2 border-none shadow-xl bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-[#212121]">Trainer Performance</CardTitle>
                            <CardDescription>Real-time oversight of staff metrics.</CardDescription>
                        </div>
                        <Link href="/gym/trainers" className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">View All</Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-100">
                                    <TableHead className="w-[200px] text-[10px] uppercase font-bold text-zinc-400">Trainer</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-400">Status</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-400">Clients</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-zinc-400">Est. Revenue</TableHead>
                                    <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-400">Last Active</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainers.map((trainer) => (
                                    <TableRow key={trainer.id} className="hover:bg-zinc-50 border-zinc-100 group cursor-pointer">
                                        <TableCell className="font-bold flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                                                {trainer.name[0]}
                                            </div>
                                            <div>
                                                <span className="block text-sm">{trainer.name}</span>
                                                <span className="text-[10px] text-zinc-400 font-normal">Certified L3</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                trainer.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                    : "bg-zinc-100 text-zinc-400 border-zinc-200"
                                            }>
                                                {trainer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{trainer.clients}</span>
                                                <div className="h-1 flex-1 bg-zinc-100 rounded-full w-12 overflow-hidden">
                                                    <div className="h-full bg-black" style={{ width: `${(trainer.clients / 30) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-600 font-mono text-xs">{trainer.revenue}</TableCell>
                                        <TableCell className="text-right text-zinc-400 text-xs">{trainer.lastActive}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Actions / Notifications */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#212121] to-black border-none shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard className="w-24 h-24 text-[#cbfe00]" />
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-[#cbfe00]" />
                                <span className="text-xs font-bold text-[#cbfe00] uppercase tracking-wider">Subscription</span>
                            </div>
                            <CardTitle className="text-lg font-bold">Gym SaaS Plan</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-black">PRO</span> <span className="text-xl font-light text-zinc-400">Plan</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Next billing: Dec 25, 2024</p>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">Manage Billing</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-xl h-fit">
                        <CardHeader>
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Recent Alerts</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-3 items-start pb-4 border-b border-zinc-50 last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-[#cbfe00]" />
                                    <div>
                                        <p className="text-sm font-bold text-black leading-tight">New Trainer Application</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">John Doe wants to join.</p>
                                        <p className="text-[10px] text-zinc-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardContent className="pt-0">
                            <Button className="w-full bg-[#111] text-white h-8 text-xs">View All Alerts</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
