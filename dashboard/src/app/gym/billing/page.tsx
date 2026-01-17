"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Crown, CheckCircle2, Users, MessageSquare, BarChart3,
    Shield, Zap, ArrowRight, Loader2, CreditCard
} from "lucide-react";
import { motion } from "framer-motion";

const proFeatures = [
    { icon: Users, title: "Up to 5 Trainers", description: "Manage your entire team" },
    { icon: MessageSquare, title: "Unified WhatsApp", description: "One number for all clients" },
    { icon: BarChart3, title: "Performance Analytics", description: "Track trainer metrics" },
    { icon: Shield, title: "Priority Support", description: "24/7 dedicated assistance" },
    { icon: Zap, title: "Unlimited Clients", description: "No restrictions on growth" },
];

const pricingPlans = [
    { id: 'monthly', name: 'Monthly', price: 99, period: '/month', discount: null },
    { id: 'quarterly', name: 'Quarterly', price: 269, period: '/3 months', discount: '10% OFF', perMonth: 90 },
    { id: 'annual', name: 'Annual', price: 990, period: '/year', discount: '2 MONTHS FREE', perMonth: 82 },
];

function BillingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const isNewUser = searchParams.get('new') === 'true';

    const handleCheckout = async () => {
        setLoading(true);
        // TODO: Integrate with payment provider (Stripe/Razorpay)
        // For now, simulate and redirect to dashboard
        setTimeout(() => {
            router.push('/gym?payment=success');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
                        <Crown className="h-3 w-3 mr-1" /> PRO PLAN
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        {isNewUser ? "Welcome to DailyFit Pro!" : "Upgrade to Pro"}
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Manage your entire gym with multiple trainers, unified WhatsApp communication, and powerful analytics.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-white/5 border-white/10 backdrop-blur-lg h-full">
                            <CardHeader>
                                <CardTitle className="text-white text-xl">What's Included</CardTitle>
                                <CardDescription className="text-white/60">
                                    Everything you need to run your gym efficiently
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {proFeatures.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-purple-500/20">
                                            <feature.icon className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{feature.title}</h3>
                                            <p className="text-sm text-white/60">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pricing Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-white border-0 shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
                                <CardDescription>
                                    Select a billing cycle that works for you
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pricingPlans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                                                    }`}>
                                                    {selectedPlan === plan.id && (
                                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900">{plan.name}</span>
                                                    {plan.discount && (
                                                        <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">
                                                            {plan.discount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-gray-900">${plan.price}</span>
                                                <span className="text-gray-500 text-sm">{plan.period}</span>
                                                {plan.perMonth && (
                                                    <p className="text-xs text-gray-500">${plan.perMonth}/month</p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                <div className="pt-4 border-t">
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30"
                                    >
                                        {loading ? (
                                            <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5 mr-2" />
                                                Subscribe Now
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-gray-500 mt-3">
                                        Secure payment • Cancel anytime • 30-day money-back guarantee
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function GymBillingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        }>
            <BillingContent />
        </Suspense>
    );
}
