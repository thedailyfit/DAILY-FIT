"use client";

import { CreateTicketDialog } from "@/components/gym/create-ticket-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AnimatedPage, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { HeadphonesIcon } from "lucide-react";

export default function GymSupportPage() {
    const tickets = [
        { id: 'T-101', subject: 'Payment failed for Oct', type: 'Billing', status: 'Resolved', date: '2024-10-05' },
        { id: 'T-102', subject: 'Feature request: Dark mode', type: 'Feature', status: 'In Progress', date: '2024-11-12' },
        { id: 'T-103', subject: 'Need trainer onboarding help', type: 'Support', status: 'Pending', date: '2024-12-01' },
    ];

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Support & Help</h1>
                        <p className="text-muted-foreground font-medium">Get assistance from the DailyFit team.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <CreateTicketDialog />
                    </div>
                </div>

                {/* Quick Help Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <SlideIn direction="up" delay={0.1}>
                        <Card className="bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer">
                            <CardContent className="p-6 flex items-center gap-4">
                                <HeadphonesIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-bold text-foreground">Live Chat</h3>
                                    <p className="text-sm text-muted-foreground">Talk to support instantly</p>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                    <SlideIn direction="up" delay={0.2}>
                        <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer">
                            <CardContent className="p-6 flex items-center gap-4">
                                <span className="text-3xl">📚</span>
                                <div>
                                    <h3 className="font-bold text-foreground">Documentation</h3>
                                    <p className="text-sm text-muted-foreground">Browse help articles</p>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                    <SlideIn direction="up" delay={0.3}>
                        <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer">
                            <CardContent className="p-6 flex items-center gap-4">
                                <span className="text-3xl">📧</span>
                                <div>
                                    <h3 className="font-bold text-foreground">Email Support</h3>
                                    <p className="text-sm text-muted-foreground">support@dailyfit.com</p>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>

                {/* Ticket History */}
                <SlideIn direction="up" delay={0.3}>
                    <Card className="bg-card border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-foreground">Ticket History</CardTitle>
                            <CardDescription className="text-muted-foreground">Track the status of your requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-muted-foreground font-bold text-xs uppercase">ID</TableHead>
                                        <TableHead className="text-muted-foreground font-bold text-xs uppercase">Subject</TableHead>
                                        <TableHead className="text-muted-foreground font-bold text-xs uppercase">Type</TableHead>
                                        <TableHead className="text-muted-foreground font-bold text-xs uppercase">Date Created</TableHead>
                                        <TableHead className="text-muted-foreground font-bold text-xs uppercase">Assigned To</TableHead>
                                        <TableHead className="text-right text-muted-foreground font-bold text-xs uppercase">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map((t) => (
                                        <TableRow key={t.id} className="border-border hover:bg-accent">
                                            <TableCell className="font-bold text-foreground">{t.id}</TableCell>
                                            <TableCell className="text-foreground">{t.subject}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-border text-muted-foreground">{t.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{t.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                    <span className="text-xs font-bold text-foreground">Super Admin</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={
                                                    t.status === 'Resolved'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        : t.status === 'In Progress'
                                                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                }>
                                                    {t.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
