"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, Dumbbell, UserPlus, ArrowUpRight, ShieldCheck, Activity, CreditCard, AlertCircle, Bell, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard, AnimatedList, AnimatedPage, PopupCard, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymOwnerDashboard() {
    // Mock Data
    const trainers = [
        { id: 1, name: "Alice Fit", clients: 15, status: "Active", revenue: "$1,200", lastActive: "2m ago" },
        { id: 2, name: "Bob Builder", clients: 8, status: "Active", revenue: "$850", lastActive: "1h ago" },
        { id: 3, name: "Charlie Cardio", clients: 0, status: "Offline", revenue: "$0", lastActive: "2d ago" },
        { id: 4, name: "Dana Lift", clients: 22, status: "Active", revenue: "$2,100", lastActive: "5m ago" },
    ];

    return (
        <AnimatedPage>
            <main className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px] uppercase tracking-wider">Gym Owner Admin</Badge>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">DailyFit Fitness</h1>
                        <p className="text-muted-foreground font-medium">Flagship Location • New York, NY</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background"></span>
                        </Button>
                        <div className="h-8 w-[1px] bg-border mx-1"></div>
                        <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-accent font-bold transition-all h-10 px-6">
                            Invite Staff
                        </Button>
                        <Button className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-10 px-6 shadow-lg transition-all">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add New Trainer
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <AnimatedList className="grid gap-4 md:grid-cols-5">
                    <PopupCard delay={0.1} className="bg-card border border-border shadow-xl rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</span>
                            <DollarSign className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-foreground">$12,450</div>
                            <p className="text-[10px] text-primary font-bold mt-1">+12.5% vs last month</p>
                        </div>
                    </PopupCard>

                    <PopupCard delay={0.2} className="bg-card border border-border shadow-xl rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Due</span>
                            <AlertCircle className="h-4 w-4 text-destructive group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-foreground">$1,800</div>
                            <p className="text-[10px] text-destructive font-bold mt-1">15 Members Pending</p>
                        </div>
                    </PopupCard>

                    <PopupCard delay={0.3} className="bg-card border border-border shadow-xl rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Members</span>
                            <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-foreground">128</div>
                            <p className="text-[10px] text-muted-foreground font-bold mt-1">+8 new this week</p>
                        </div>
                    </PopupCard>

                    <PopupCard delay={0.4} className="bg-card border border-border shadow-xl rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cardio Only</span>
                            <Activity className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-foreground">45</div>
                            <p className="text-[10px] text-blue-400 font-bold mt-1">Treadmill/Cycle Plan</p>
                        </div>
                    </PopupCard>

                    <PopupCard delay={0.5} className="bg-primary text-primary-foreground shadow-xl rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                            <span className="text-sm font-bold text-primary-foreground uppercase tracking-wider">New Leads</span>
                            <ShieldCheck className="h-4 w-4 text-primary-foreground group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-primary-foreground">24</div>
                            <p className="text-[10px] text-primary-foreground/70 font-bold mt-1">12 unread enquiries</p>
                        </div>
                    </PopupCard>
                </AnimatedList>

                {/* Broadcast Card */}
                <SlideIn direction="up" delay={0.3}>
                    <Card className="bg-card border-border shadow-xl">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" /> Broadcast
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Reach all 128 active members.</p>
                            </div>
                            <Button className="bg-primary text-primary-foreground hover:opacity-90 h-8 text-xs font-bold px-6">
                                Send Message
                            </Button>
                        </div>
                    </Card>
                </SlideIn>

                {/* Main Data Section */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Trainer Performance Table */}
                    <SlideIn direction="left" delay={0.2} className="md:col-span-2">
                        <Card className="border-border shadow-xl bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">Trainer Performance</CardTitle>
                                    <CardDescription className="text-muted-foreground">Real-time oversight of staff metrics.</CardDescription>
                                </div>
                                <Link href="/gym/trainers" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">View All</Link>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border">
                                            <TableHead className="w-[200px] text-[10px] uppercase font-bold text-muted-foreground">Trainer</TableHead>
                                            <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Clients</TableHead>
                                            <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Est. Revenue</TableHead>
                                            <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground">Last Active</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trainers.map((trainer) => (
                                            <TableRow key={trainer.id} className="hover:bg-accent border-border group cursor-pointer">
                                                <TableCell className="font-bold flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">
                                                        {trainer.name[0]}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm text-foreground">{trainer.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-normal">Certified L3</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={
                                                        trainer.status === "Active"
                                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    }>
                                                        {trainer.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground">{trainer.clients}</span>
                                                        <div className="h-1 flex-1 bg-muted rounded-full w-12 overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${(trainer.clients / 30) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-xs">{trainer.revenue}</TableCell>
                                                <TableCell className="text-right text-muted-foreground text-xs">{trainer.lastActive}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Recent Alerts */}
                    <SlideIn direction="right" delay={0.3}>
                        <div className="space-y-6">
                            <Card className="bg-card border-border shadow-xl h-fit">
                                <CardHeader>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Recent Alerts</h3>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-3 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground leading-tight">New Trainer Application</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">John Doe wants to join.</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardContent className="pt-0">
                                    <Button className="w-full bg-primary text-primary-foreground h-8 text-xs">View All Alerts</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </SlideIn>
                </div>
            </main>
        </AnimatedPage>
    );
}
