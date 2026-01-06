"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Calendar, Zap, Shield, Star } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn, AnimatedCard } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScanLine, Smartphone } from "lucide-react"

export default function GymSubscriptionPage() {
    const currentPlan = "pro";
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [logo, setLogo] = useState<string | null>(null)
    const [paymentStep, setPaymentStep] = useState<'method' | 'qr' | 'confirm'>('method')

    const handleUpgradeClick = () => {
        setPaymentStep('method')
        setIsUpgradeOpen(true)
    }

    const handlePaymentComplete = () => {
        // Simulate Success
        setTimeout(() => {
            setIsUpgradeOpen(false)
            // Here you would typically update the plan state or refresh
        }, 1500)
    }

    const plans = [
        {
            id: "starter",
            name: "Starter",
            price: 29,
            description: "Perfect for small gyms",
            features: [
                "Up to 10 members",
                "Basic analytics",
                "Email support",
                "1 trainer account"
            ]
        },
        {
            id: "pro",
            name: "Pro",
            price: 59,
            description: "Most popular for growing gyms",
            features: [
                "Up to 20 members",
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



                {/* Wallet & Credits Section */}
                <SlideIn direction="down" delay={0.15}>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Current Plan Card (Reduced width if grid) */}
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
                                <CardDescription className="text-muted-foreground">Monthly Included Credits</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-5xl font-black text-foreground">$79</span>
                                            <span className="text-xl text-muted-foreground">/mo</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-emerald-500 flex items-center gap-1 justify-end"><Shield className="w-3 h-3" /> Active</div>
                                            <div className="text-xs text-muted-foreground">Renews Jan 25</div>
                                        </div>
                                    </div>



                                    <div className="flex gap-3">
                                        <Button variant="outline" className="border-border flex-1">Downgrade</Button>
                                        <Button className="bg-primary text-primary-foreground flex-1">Upgrade Plan</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top-Up Wallet Card */}
                        <Card className="bg-card border-primary/20 shadow-xl relative overflow-hidden ring-1 ring-primary/20">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Star className="w-32 h-32 text-yellow-500" />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Overage Wallet</span>
                                </div>
                                <CardTitle className="text-2xl font-bold text-foreground">Balance: 450 Credits</CardTitle>
                                <CardDescription className="text-muted-foreground">For Marketing & Limit Overages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex gap-2">
                                            <Shield className="w-4 h-4 shrink-0" />
                                            When daily limits (e.g. 20 chats per user) are exceeded, extra charge will be deducted from here.
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-border pb-2">
                                            <span className="text-muted-foreground">Marketing Broadcast</span>
                                            <span className="font-mono font-bold">1.5 credits</span>
                                        </div>
                                        <div className="flex justify-between border-b border-border pb-2">
                                            <span className="text-muted-foreground">Limit Overage (Chat)</span>
                                            <span className="font-mono font-bold">1 credit / msg</span>
                                        </div>
                                        <div className="flex justify-between border-b border-border pb-2">
                                            <span className="text-muted-foreground">Extra Meal Scan</span>
                                            <span className="font-mono font-bold">5 credits</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <Button variant="outline" className="flex-1 border-dashed border-primary/50 text-foreground hover:bg-primary/5">
                                            + 500 Credits ($10)
                                        </Button>
                                        <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:opacity-90 border-0">
                                            Top-up Wallet
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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

                {/* Upgrade Modal */}
                <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                    <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
                        <DialogHeader>
                            <DialogTitle>Upgrade Subscription</DialogTitle>
                            <DialogDescription>Unlock the full power of DailyFit AI for your gym.</DialogDescription>
                        </DialogHeader>

                        {paymentStep === 'method' && (
                            <div className="space-y-4 py-4">
                                <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl text-center">
                                    <p className="text-2xl font-black text-primary">₹14,999<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                                    <p className="text-xs text-muted-foreground mt-1">Includes GST & all charges</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-muted hover:border-primary" onClick={() => setPaymentStep('qr')}>
                                        <ScanLine className="h-8 w-8 text-foreground" />
                                        Scan QR Code
                                    </Button>
                                    <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-muted hover:border-primary" onClick={() => setPaymentStep('qr')}>
                                        <Smartphone className="h-8 w-8 text-foreground" />
                                        UPI ID
                                    </Button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 'qr' && (
                            <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-300">
                                <div className="bg-white p-2 rounded-xl border shadow-inner">
                                    {/* Placeholder QR */}
                                    <div className="w-48 h-48 bg-zinc-900 flex items-center justify-center text-white text-xs">
                                        [ UPI QR CODE HERE ]
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="font-mono bg-muted py-2 px-4 rounded-lg text-sm select-all">dailyfit@upi.business</p>
                                    <p className="text-xs text-muted-foreground">Scan or copy UPI ID to pay</p>
                                </div>
                                <Button onClick={handlePaymentComplete} className="w-full bg-primary text-primary-foreground font-bold">
                                    I've Completed Payment
                                </Button>
                                <Button variant="ghost" onClick={() => setPaymentStep('method')} className="text-xs text-muted-foreground">Back</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

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
        </AnimatedPage >
    );
}
