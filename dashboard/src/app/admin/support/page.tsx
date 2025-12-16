import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function AdminSupportPage() {
    // Mock Data: In real app, fetch from 'support_tickets' table
    const tickets = [
        { id: "T-101", subject: "Payment Failed for Pro Plan", user: "John Doe (Gold's Gym)", status: "Open", priority: "High", date: "2 hrs ago" },
        { id: "T-102", subject: "How to add new trainer?", user: "Sarah Smith", status: "Closed", priority: "Low", date: "1 day ago" },
        { id: "T-103", subject: "Bug in Diet Plan Editor", user: "Mike Tyson", status: "In Progress", priority: "Medium", date: "3 days ago" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Support Center</h1>
                        <p className="text-slate-500">Manage inquiries from Gym Owners and Trainers.</p>
                    </div>
                    <Button>+ Create Ticket</Button>
                </header>

                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                            <MessageSquare className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.4 hrs</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>User / Gym</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <Badge variant={t.status === 'Open' ? 'destructive' : t.status === 'Closed' ? 'secondary' : 'default'} className="uppercase">
                                                {t.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-bold ${t.priority === 'High' ? 'text-red-500' : 'text-slate-500'}`}>
                                                {t.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{t.subject}</TableCell>
                                        <TableCell>{t.user}</TableCell>
                                        <TableCell>{t.date}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">Reply</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
