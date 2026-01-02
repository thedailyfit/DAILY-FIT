'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck, Zap, CreditCard, ScanLine, Smartphone, AlertCircle, X, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionPage() {
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [paymentStep, setPaymentStep] = useState<'method' | 'qr' | 'confirm'>('method')
    const [activePlan, setActivePlan] = useState<'basic' | 'pro'>('basic') // Default to basic for verified user
    const [invoices, setInvoices] = useState([
        { id: 'INV-2024-001', date: 'Dec 01, 2025', amount: '₹0.00', status: 'Paid', plan: 'Basic Trainer' }
    ])

    const handleUpgradeClick = () => {
        setPaymentStep('method')
        setIsUpgradeOpen(true)
    }

    const handlePaymentComplete = () => {
        // Simulate Success
        setTimeout(() => {
            setActivePlan('pro')
            setInvoices(prev => [
                { id: `INV-2026-${Math.floor(Math.random() * 1000)}`, date: new Date().toLocaleDateString(), amount: '₹14,999.00', status: 'Paid', plan: 'Pro Trainer (Yearly)' },
                ...prev
            ])
            setIsUpgradeOpen(false)
        }, 1500)
    }

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
                {/* Main Plan Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Plan Status */}
                    <Card className={`border-2 shadow-xl overflow-hidden rounded-[2rem] ${activePlan === 'pro' ? 'bg-card border-primary/50' : 'bg-muted/20 border-border'}`}>
                        <div className={`h-2 w-full ${activePlan === 'pro' ? 'bg-gradient-to-r from-primary to-green-500' : 'bg-zinc-500'}`}></div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${activePlan === 'pro' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'}`}>
                                        <Zap className="h-3 w-3" /> Current Plan
                                    </div>
                                    <CardTitle className="text-3xl font-black text-card-foreground mb-2">
                                        {activePlan === 'pro' ? 'Pro Trainer' : 'Basic Trainer'}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground text-base">
                                        {activePlan === 'pro' ? 'You have full access to all AI features.' : 'Limited features. Upgrade to unlock full potential.'}
                                    </CardDescription>
                                </div>
                                {activePlan === 'basic' && (
                                    <Button onClick={handleUpgradeClick} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg animate-pulse">
                                        Upgrade to Pro
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-4 mb-8">
                                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Your Features</h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <FeatureItem active={true} text="Client Management (Up to 5)" />
                                    <FeatureItem active={true} text="Basic Workout Builder" />
                                    <FeatureItem active={activePlan === 'pro'} text="Unlimited Clients" />
                                    <FeatureItem active={activePlan === 'pro'} text="AI Diet Generator" />
                                    <FeatureItem active={activePlan === 'pro'} text="WhatsApp Auto-Sync" />
                                    <FeatureItem active={activePlan === 'pro'} text="White-label Reports" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice History */}
                    <Card className="bg-card border-border shadow-md overflow-hidden rounded-[2rem]">
                        <CardHeader className="p-6 border-b border-border bg-muted/30">
                            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
                                <Download className="h-5 w-5" /> Invoice History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {invoices.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {invoices.map((inv) => (
                                        <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                            <div>
                                                <p className="font-bold text-card-foreground">{inv.date}</p>
                                                <p className="text-xs text-muted-foreground">{inv.plan} • {inv.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-card-foreground font-mono font-medium">{inv.amount}</span>
                                                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">{inv.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">No payment history available.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Comparative Pricing / Upgrade Logic */}
                <div className="space-y-6">
                    <Card className="bg-card border-border shadow-xl rounded-[2rem] overflow-hidden relative">
                        {activePlan === 'basic' && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                                RECOMMENDED
                            </div>
                        )}
                        <CardHeader className="p-6 bg-gradient-to-b from-muted/50 to-background border-b border-border">
                            <CardTitle className="text-xl font-bold text-foreground">Pro Trainer</CardTitle>
                            <div className="mt-2">
                                <span className="text-3xl font-black text-foreground">₹14,999</span>
                                <span className="text-muted-foreground text-sm">/year</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">or ₹1,499/month billed monthly</p>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <FeatureItem active={true} text="Everything in Basic" />
                                <FeatureItem active={true} text="Advanced AI Programs" />
                                <FeatureItem active={true} text="Priority Support" />
                                <FeatureItem active={true} text="Custom Branding" />
                            </div>
                            {activePlan === 'basic' ? (
                                <Button onClick={handleUpgradeClick} className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl h-12">
                                    Upgrade Now
                                </Button>
                            ) : (
                                <Button disabled className="w-full bg-muted text-muted-foreground font-bold rounded-xl h-12">
                                    Currently Active
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/20 border-border shadow-sm rounded-[2rem] p-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm mb-1">Secure Payments</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Processed via UPI / Secure Gateway. <br /> 100% Money Back Check.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Upgrade Modal */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
                    <DialogHeader>
                        <DialogTitle>Upgrade to Pro Trainer</DialogTitle>
                        <DialogDescription>Unlock the full power of AI for your coaching business.</DialogDescription>
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
        </div>
    )
}

function FeatureItem({ active, text }: { active: boolean, text: string }) {
    return (
        <div className={`flex items-center gap-3 ${active ? 'text-card-foreground' : 'text-muted-foreground/50'}`}>
            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <span className="text-sm font-medium">{text}</span>
        </div>
    )
}
