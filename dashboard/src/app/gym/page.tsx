"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, Dumbbell, UserPlus, ShoppingBag, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GymOwnerDashboard() {
    // Mock Data
    const trainers = [
        { id: 1, name: "Alice Fit", clients: 15, active: true },
        { id: 2, name: "Bob Builder", clients: 8, active: true },
        { id: 3, name: "Charlie Cardio", clients: 0, active: false },
    ];

    return (
        <main className="p-8 space-y-8 bg-slate-50/50 min-h-full">
            {/* Intelligent Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/60 pb-6">
                <div>
                    <h2 className="text-lg font-medium text-violet-600 mb-1">Gym Overview</h2>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Iron Pump Fitness</h1>
                    <p className="text-slate-500 mt-1">Managing 3 Trainers and 50+ Members</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white">Invite Trainer</Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Trainer
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Trainers</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{trainers.length}</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> All systems go
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">23</div>
                        <p className="text-xs text-slate-400 mt-1">Across all trainers</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none shadow-lg shadow-violet-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">$4,250</div>
                        <p className="text-xs text-violet-200 mt-1 flex items-center">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Floor Members</CardTitle>
                        <Dumbbell className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">89</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> 5 new this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Data Section */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Trainers Table (Takes up 2 columns) */}
                <Card className="md:col-span-2 shadow-sm border-slate-100">
                    <CardHeader>
                        <CardTitle>Trainer Performance</CardTitle>
                        <CardDescription>Overview of your staff and their client load.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Trainer</TableHead>
                                    <TableHead>Client Load</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainers.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                                                    {t.name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{t.name}</div>
                                                    <div className="text-xs text-slate-500">PT Certified</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{t.clients}</span>
                                                <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(t.clients / 20) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={t.active ? "default" : "secondary"} className={t.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600"}>
                                                {t.active ? 'Active' : 'Offline'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <DashIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Actions / Notifications */}
                <div className="space-y-6">
                    <Card className="bg-indigo-900 text-white border-none shadow-lg image-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <CardHeader>
                            <CardTitle className="text-lg">Subscription Status</CardTitle>
                            <CardDescription className="text-indigo-200">Standard Plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="text-2xl font-bold">$299<span className="text-sm font-normal text-indigo-300">/mo</span></div>
                                <p className="text-xs text-indigo-300 mt-1">Next billing: Dec 25, 2024</p>
                            </div>
                            <Button variant="secondary" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white border-none">
                                Manage Billing
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-violet-500"></div>
                                    <div>
                                        <p className="text-sm text-slate-700 font-medium">New member joined</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

function DashIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
    )
}
