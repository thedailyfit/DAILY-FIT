"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, Dumbbell, UserPlus, ShoppingBag } from "lucide-react";

export default function GymOwnerDashboard() {
    // Mock Data (Connect to 'trainers' table with gym_id filter)
    const trainers = [
        { id: 1, name: "Alice Fit", clients: 15, active: true },
        { id: 2, name: "Bob Builder", clients: 8, active: true },
        { id: 3, name: "Charlie Cardio", clients: 0, active: false },
    ];

    return (
        <main className="flex-1 p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gym Dashboard</h1>
                    <p className="text-slate-500">Manage your trainers and organization.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Invite Trainer</Button>
                    <Button className="bg-violet-600 hover:bg-violet-700">Add New Trainer</Button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                        <Users className="h-4 w-4 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{trainers.length}</div>
                        <p className="text-xs text-muted-foreground">Standard Plan limit: 5</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">Across all trainers</p>
                    </CardContent>
                </Card>
                <Card className="border-indigo-200 bg-indigo-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-900">Gym Subscription</CardTitle>
                        <DollarSign className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-indigo-700">Active (Standard)</div>
                        <p className="text-xs text-indigo-600">Next payment: Dec 25</p>
                    </CardContent>
                </Card>
            </div>

            {/* Trainers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Trainers</CardTitle>
                    <CardDescription>People authorized to access your gym's client data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Active Clients</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainers.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                                {t.name[0]}
                                            </div>
                                            {t.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{t.clients}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${t.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {t.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
