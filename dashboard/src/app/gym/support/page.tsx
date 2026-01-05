"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AnimatedPage, SlideIn, PopupCard, AnimatedList } from "@/components/animated-components";
import { LifeBuoy, Plus, MessageSquare, FileText, CheckCircle2, Clock, AlertCircle, Search, ChevronRight } from "lucide-react";

// Mock Data
const initialTickets = [
    { id: "TKT-001", subject: "Payment gateway error on checkout", category: "Technical", status: "Open", date: "2 mins ago", priority: "High" },
    { id: "TKT-002", subject: "Request for invoice adjustment - Oct", category: "Billing", status: "In Progress", date: "2 days ago", priority: "Medium" },
    { id: "TKT-003", subject: "How to add new trainer profile?", category: "General", status: "Resolved", date: "1 week ago", priority: "Low" },
];

const faqs = [
    { question: "How do I add a new trainer?", answer: "Go to the Trainers page via the sidebar, click on 'Add New Trainer' at the top right, fill in the details and send the invite." },
    { question: "Can I export member data?", answer: "Yes, navigate to the Members page and click the 'Export CSV' button above the member table." },
    { question: "How is billing calculated?", answer: "Billing is based on your active member count at the start of each billing cycle. See the Subscription page for details." },
    { question: "My dashboard is loading slowly", answer: "Please check your internet connection. If issues persist, clear your browser cache or try a different browser." },
];

export default function GymSupportPage() {
    const [tickets, setTickets] = useState(initialTickets);
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: "", category: "", description: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmitTicket = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const ticket = {
                id: `TKT-00${tickets.length + 1}`,
                subject: newTicket.subject,
                category: newTicket.category,
                status: "Open",
                date: "Just now",
                priority: "Medium"
            };
            setTickets([ticket, ...tickets]);
            setLoading(false);
            setIsNewTicketOpen(false);
            setNewTicket({ subject: "", category: "", description: "" });
        }, 1500);
    };

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Gym Support Center</h1>
                        <p className="text-muted-foreground font-medium">Get help, manage tickets, and find answers.</p>
                    </div>
                    <ThemeSwitcher variant="gym" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Tickets) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search tickets or help articles..." className="pl-9 bg-card border-border" />
                            </div>
                            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-primary-foreground font-bold shadow-lg hover:opacity-90">
                                        <Plus className="mr-2 h-4 w-4" /> Create Ticket
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
                                    <DialogHeader>
                                        <DialogTitle>Create Support Ticket</DialogTitle>
                                        <DialogDescription>
                                            Describe your issue clearly. Our team usually responds within 2 hours.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Subject</Label>
                                            <Input
                                                placeholder="Brief summary of the issue"
                                                value={newTicket.subject}
                                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                                className="bg-secondary border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select
                                                onValueChange={(val) => setNewTicket({ ...newTicket, category: val })}
                                            >
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Technical">Technical Issue</SelectItem>
                                                    <SelectItem value="Billing">Billing & Subscription</SelectItem>
                                                    <SelectItem value="Account">Account Management</SelectItem>
                                                    <SelectItem value="General">General Inquiry</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                placeholder="Provide more details..."
                                                value={newTicket.description}
                                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                                className="bg-secondary border-border min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSubmitTicket} disabled={loading} className="bg-primary text-primary-foreground">
                                            {loading ? "Submitting..." : "Submit Ticket"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Tickets List */}
                        <Card className="bg-card border-border shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <LifeBuoy className="h-5 w-5 text-primary" /> Your Tickets
                                </CardTitle>
                                <CardDescription>Track status of your support requests.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnimatedList className="space-y-3">
                                    {tickets.map((ticket, index) => (
                                        <PopupCard key={ticket.id} delay={index * 0.1}>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer">
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-1 h-2 w-2 rounded-full ${ticket.status === 'Open' ? 'bg-emerald-500 animate-pulse' :
                                                            ticket.status === 'In Progress' ? 'bg-amber-500' :
                                                                'bg-muted-foreground'
                                                        }`} />
                                                    <div>
                                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.subject}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                            <span className="font-mono">{ticket.id}</span>
                                                            <span>•</span>
                                                            <span>{ticket.category}</span>
                                                            <span>•</span>
                                                            <span>{ticket.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge variant="outline" className={`
                                                ${ticket.status === 'Open' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' :
                                                            ticket.status === 'In Progress' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' :
                                                                'border-border text-muted-foreground'}
                                            `}>
                                                        {ticket.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </PopupCard>
                                    ))}
                                </AnimatedList>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar (FAQs & Contact) */}
                    <div className="space-y-6">
                        <SlideIn direction="left" delay={0.2}>
                            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <AlertCircle className="h-5 w-5" /> Need Urgent Help?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-foreground/80">
                                        For critical system outages affecting operations, please call our 24/7 emergency line.
                                    </p>
                                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 font-bold">
                                        Call +1 (800) 123-4567
                                    </Button>
                                </CardContent>
                            </Card>
                        </SlideIn>

                        <SlideIn direction="up" delay={0.3}>
                            <Card className="bg-card border-border shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg">Common Questions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                                            <h4 className="font-bold text-sm text-foreground flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                                                {faq.question}
                                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                            </h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <Button variant="link" className="w-full text-primary">View Knowledge Base</Button>
                                </CardFooter>
                            </Card>
                        </SlideIn>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
