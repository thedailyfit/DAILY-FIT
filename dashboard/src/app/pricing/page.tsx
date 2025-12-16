import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Check } from "lucide-react";

export default function PricingPage() {
    const tiers = [
        {
            name: "Solo Trainer",
            price: "$29",
            period: "/month",
            desc: "For independent coaches handling up to 20 clients.",
            cta: "Start Free Trial",
            features: [
                "Unlimted Clients",
                "AI Meal & Workout Plans",
                "Voice & Photo Logging",
                "Basic Analytics",
                "WhatsApp Integration"
            ]
        },
        {
            name: "Gym Studio",
            price: "$99",
            period: "/month",
            desc: "For gym owners managing a team of trainers.",
            cta: "Get Started",
            featured: true,
            features: [
                "Everything in Solo",
                "Up to 5 Trainers",
                "Studio Dashboard",
                "Revenue Analytics",
                "White-label Branding",
                "Priority Support"
            ]
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            desc: "For fitness franchises and large organizations.",
            cta: "Contact Sales",
            features: [
                "Unlimited Trainers",
                "Custom AI Training",
                "API Access",
                "Dedicated Account Manager",
                "SLA & SSO"
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans">
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">DailyFit AI</span>
                    </Link>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                            Log in
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 py-24 px-6">
                <div className="max-w-6xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Choose the plan that fits your business stage. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {tiers.map((tier, i) => (
                            <div key={i} className={`relative p-8 rounded-2xl border ${tier.featured ? 'border-indigo-500 bg-indigo-900/10' : 'border-white/10 bg-white/5'} flex flex-col gap-6 hover:scale-105 transition-transform duration-300`}>
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30">
                                        Most Popular
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{tier.price}</span>
                                        <span className="text-slate-400">{tier.period}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2">{tier.desc}</p>
                                </div>

                                <Button className={`w-full ${tier.featured ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white/10 hover:bg-white/20'} text-white border-0`}>
                                    {tier.cta}
                                </Button>

                                <ul className="space-y-4 pt-4 border-t border-white/5">
                                    {tier.features.map((feat, j) => (
                                        <li key={j} className="flex gap-3 text-sm text-slate-300">
                                            <Check className="h-5 w-5 text-indigo-400 shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5">
                © 2025 DailyFit Inc.
            </footer>
        </div>
    );
}
