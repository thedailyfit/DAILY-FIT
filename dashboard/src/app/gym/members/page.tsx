"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Search, UserPlus } from "lucide-react";

export default function RegularMembersPage() {
    const members = [
        { id: 1, name: "Alice Blue", joined: "2024-01-01", expiry: "2025-01-01", status: "Active" },
        { id: 2, name: "Bob Green", joined: "2024-02-15", expiry: "2025-02-15", status: "Active" },
        { id: 3, name: "Charlie Red", joined: "2023-11-20", expiry: "2024-11-20", status: "Expired" },
    ];

    return (
        <main className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Regular Gym Members</h1>
                    <p className="text-slate-500">General Floor Access Members (Non-PT).</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700"><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
            </header>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input className="pl-9" placeholder="Search members by name or phone..." />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Member Directory</CardTitle>
                    <CardDescription>Total: {members.length} Members</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead>Membership Expiry</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                                {m.name[0]}
                                            </div>
                                            {m.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{m.joined}</TableCell>
                                    <TableCell>{m.expiry}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {m.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Sell Add-on</Button>
                                            <Button variant="ghost" size="sm">View Track</Button>
                                        </div>
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
