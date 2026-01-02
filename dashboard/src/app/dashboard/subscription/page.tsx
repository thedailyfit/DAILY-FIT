'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck, Zap } from "lucide-react"

export default function SubscriptionPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 bg-background min-h-screen text-foreground transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
                        Subscription
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage your DailyFit AI plan and billing.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan Card */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-card border-border shadow-xl overflow-hidden rounded-[2rem]">
                        <div className="h-2 w-full bg-gradient-to-r from-primary to-green-500"></div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                                        <Zap className="h-3 w-3" /> Active Plan
                                    </div>
                                    <CardTitle className="text-3xl font-black text-card-foreground mb-2">Pro Trainer</CardTitle>
                                    <CardDescription className="text-muted-foreground text-base">
                                        You are currently on the professional tier.
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-card-foreground">₹2,999</span>
                                    <span className="text-muted-foreground font-medium">/month</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Unlimited Clients</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Advanced AI Program Builder</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Priority WhatsApp Integration</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="bg-foreground text-background hover:bg-foreground/80 font-bold h-12 px-8 rounded-xl w-full md:w-auto">
                                    Manage Billing
                                </Button>
                                <Button variant="outline" className="border-red-900/30 text-red-500 hover:bg-red-950/30 hover:text-red-400 font-bold h-12 px-8 rounded-xl w-full md:w-auto">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History Placeholder */}
                    <Card className="bg-card border-border shadow-md overflow-hidden rounded-[2rem]">
                        <CardHeader className="p-6 border-b border-border bg-muted/30">
                            <CardTitle className="text-lg font-bold text-card-foreground">Invoice History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                <div className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-card-foreground">Dec 01, 2025</p>
                                        <p className="text-xs text-muted-foreground">Invoice #INV-2025-001</p>
                                    </div>
                                    <span className="text-muted-foreground font-mono">₹2,999.00</span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-card-foreground">Nov 01, 2025</p>
                                        <p className="text-xs text-muted-foreground">Invoice #INV-2025-001</p>
                                    </div>
                                    <span className="text-muted-foreground font-mono">₹2,999.00</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secure Badge */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-card to-background border-border shadow-xl rounded-[2rem] p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground text-lg mb-2">Secure Billing</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Your payments are processed securely via Stripe. We do not store your card details.
                        </p>
                        <Button variant="link" className="text-primary">Contact Support</Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
