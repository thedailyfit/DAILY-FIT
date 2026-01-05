"use client";

import { CreateLeadFormDialog } from "@/components/gym/create-lead-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, UserPlus, Phone, Clock } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymLeadsPage() {
    // Mock Leads Data
    const leads = [
        { id: 1, name: "Rahul Sharma", phone: "+91 9876543210", query: "What is the annual membership fee?", source: "WhatsApp", status: "Replied by AI", time: "10m ago" },
        { id: 2, name: "Priya Singh", phone: "+91 9123456780", query: "Do you have Zumba classes?", source: "Instagram", status: "Pending", time: "2h ago" },
        { id: 3, name: "Amit Patel", phone: "+91 9988776655", query: "I want to join tomorrow.", source: "WhatsApp", status: "Converted", time: "1d ago" },
    ];

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Leads & Enquiries</h1>
                        <p className="text-muted-foreground font-medium">Capture and convert potential members.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <CreateLeadFormDialog />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Active Lead Forms */}
                    <SlideIn direction="left" delay={0.1}>
                        <Card className="md:col-span-1 shadow-lg border-border bg-card h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg text-foreground">Active Campaigns</CardTitle>
                                <CardDescription className="text-muted-foreground">Generated lead forms</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <PopupCard delay={0.2} className="p-3 bg-secondary rounded-lg border border-border flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm text-foreground">New Year Special</div>
                                        <div className="text-xs text-muted-foreground">12 clicks • 4 leads</div>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                                </PopupCard>
                                <PopupCard delay={0.3} className="p-3 bg-secondary rounded-lg border border-border flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm text-foreground">Summer Body</div>
                                        <div className="text-xs text-muted-foreground">45 clicks • 8 leads</div>
                                    </div>
                                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Ended</Badge>
                                </PopupCard>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Incoming Enquiries Stream */}
                    <SlideIn direction="right" delay={0.2} className="md:col-span-2">
                        <Card className="shadow-lg border-border bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Recent Enquiries
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Real-time messages from WhatsApp & Social</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {leads.map((lead, index) => (
                                        <PopupCard key={lead.id} delay={0.3 + index * 0.1} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-secondary hover:bg-accent transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                                {lead.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground">{lead.name}</h4>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {lead.phone} • {lead.source}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {lead.time}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-sm text-foreground bg-muted p-2 rounded-md w-fit">
                                                    "{lead.query}"
                                                </div>
                                                <div className="mt-2 flex gap-2 items-center">
                                                    {lead.status === 'Replied by AI' && (
                                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1">
                                                            <Bot className="h-3 w-3" /> Auto-Replied
                                                        </Badge>
                                                    )}
                                                    {lead.status === 'Converted' && (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                            Converted
                                                        </Badge>
                                                    )}
                                                    {lead.status === 'Pending' && (
                                                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                                            Action Needed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Button size="sm" variant="outline" className="border-border">Chat</Button>
                                            </div>
                                        </PopupCard>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>
            </div>
        </AnimatedPage>
    );
}
