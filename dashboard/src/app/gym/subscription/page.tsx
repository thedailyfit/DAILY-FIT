"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Calendar, Zap, Shield, Star } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn, AnimatedCard } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymSubscriptionPage() {
    const currentPlan = "pro";

    const plans = [
        {
            id: "starter",
            name: "Starter",
            price: 29,
            description: "Perfect for small gyms",
            features: [
                "Up to 50 members",
                "Basic analytics",
                "Email support",
                "1 trainer account"
            ]
        },
        {
            id: "pro",
            name: "Pro",
            price: 79,
            description: "Most popular for growing gyms",
            features: [
                "Up to 200 members",
                "Advanced analytics",
                "Priority support",
                "5 trainer accounts",
                "WhatsApp integration",
                "Custom branding"
            ],
            popular: true
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: 199,
            description: "For multi-location gyms",
            features: [
                "Unlimited members",
                "Real-time analytics",
                "24/7 phone support",
                "Unlimited trainers",
                "API access",
                "White-label solution",
                "Dedicated account manager"
            ]
        }
    ];

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Subscription Management</h1>
                        <p className="text-muted-foreground font-medium">Manage your DailyFit plan and billing.</p>
                    </div>
                    <ThemeSwitcher variant="gym" />
                </div>

                {/* Current Plan Status */}
                <SlideIn direction="down" delay={0.1}>
                    <Card className="bg-gradient-to-br from-card to-secondary border-border shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <CreditCard className="w-32 h-32 text-primary" />
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Current Plan</span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Pro Plan</CardTitle>
                            <CardDescription className="text-muted-foreground">You're on the most popular plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-6 items-center">
                                <div>
                                    <span className="text-5xl font-black text-foreground">$79</span>
                                    <span className="text-xl text-muted-foreground">/month</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Next billing: Jan 25, 2026
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4 text-emerald-500" />
                                        Auto-renew active
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" className="border-border">Cancel Subscription</Button>
                                <Button className="bg-primary text-primary-foreground">Update Payment Method</Button>
                            </div>
                        </CardContent>
                    </Card>
                </SlideIn>

                {/* Plans Grid */}
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Available Plans</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {plans.map((plan, index) => (
                            <PopupCard key={plan.id} delay={0.2 + index * 0.1}>
                                <Card className={`border-border shadow-xl relative overflow-hidden h-full ${plan.popular ? 'ring-2 ring-primary' : ''
                                    }`}>
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0">
                                            <Badge className="bg-primary text-primary-foreground rounded-none rounded-bl-lg">
                                                <Star className="h-3 w-3 mr-1" /> Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-foreground">{plan.name}</CardTitle>
                                        <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                                        <div className="pt-4">
                                            <span className="text-4xl font-black text-foreground">${plan.price}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className={`w-full ${currentPlan === plan.id
                                                ? 'bg-muted text-muted-foreground cursor-default'
                                                : 'bg-primary text-primary-foreground hover:opacity-90'
                                                }`}
                                            disabled={currentPlan === plan.id}
                                        >
                                            {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </PopupCard>
                        ))}
                    </div>
                </div>

                {/* Billing History */}
                <SlideIn direction="up" delay={0.4}>
                    <Card className="border-border shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-foreground">Billing History</CardTitle>
                            <CardDescription className="text-muted-foreground">Download invoices for your records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { date: "Dec 25, 2025", amount: "$79.00", status: "Paid" },
                                    { date: "Nov 25, 2025", amount: "$79.00", status: "Paid" },
                                    { date: "Oct 25, 2025", amount: "$79.00", status: "Paid" },
                                ].map((invoice, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                                            <p className="text-xs text-muted-foreground">Pro Plan - Monthly</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-foreground">{invoice.amount}</span>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">{invoice.status}</Badge>
                                            <Button variant="ghost" size="sm" className="text-xs">Download</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
