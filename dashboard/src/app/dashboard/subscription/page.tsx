'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck, Zap } from "lucide-react"

export default function SubscriptionPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        Subscription
                    </h1>
                    <p className="text-zinc-400 mt-2 font-medium">
                        Manage your DailyFit AI plan and billing.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan Card */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-[#141414] border-zinc-800 shadow-xl overflow-hidden rounded-[2rem]">
                        <div className="h-2 w-full bg-gradient-to-r from-[#cbfe00] to-green-500"></div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cbfe00]/10 text-[#cbfe00] text-xs font-bold uppercase tracking-wider mb-4 border border-[#cbfe00]/20">
                                        <Zap className="h-3 w-3" /> Active Plan
                                    </div>
                                    <CardTitle className="text-3xl font-black text-white mb-2">Pro Trainer</CardTitle>
                                    <CardDescription className="text-zinc-400 text-base">
                                        You are currently on the professional tier.
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">₹2,999</span>
                                    <span className="text-zinc-500 font-medium">/month</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Unlimited Clients</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Advanced AI Program Builder</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Priority WhatsApp Integration</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="bg-white text-black hover:bg-zinc-200 font-bold h-12 px-8 rounded-xl w-full md:w-auto">
                                    Manage Billing
                                </Button>
                                <Button variant="outline" className="border-red-900/30 text-red-500 hover:bg-red-950/30 hover:text-red-400 font-bold h-12 px-8 rounded-xl w-full md:w-auto">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History Placeholder */}
                    <Card className="bg-[#141414] border-zinc-800 shadow-xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="p-6 border-b border-zinc-800">
                            <CardTitle className="text-lg font-bold text-white">Invoice History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-zinc-800">
                                <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                    <div>
                                        <p className="font-bold text-white">Dec 01, 2025</p>
                                        <p className="text-xs text-zinc-500">Invoice #INV-2025-001</p>
                                    </div>
                                    <span className="text-zinc-300 font-mono">₹2,999.00</span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                    <div>
                                        <p className="font-bold text-white">Nov 01, 2025</p>
                                        <p className="text-xs text-zinc-500">Invoice #INV-2025-001</p>
                                    </div>
                                    <span className="text-zinc-300 font-mono">₹2,999.00</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secure Badge */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-black border-zinc-800 shadow-xl rounded-[2rem] p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-[#cbfe00]/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-[#cbfe00]" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">Secure Billing</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Your payments are processed securely via Stripe. We do not store your card details.
                        </p>
                        <Button variant="link" className="text-[#cbfe00]">Contact Support</Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
