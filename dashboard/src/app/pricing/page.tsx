"use client";

import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <LandingHeader />

            <main className="pt-32 pb-20 container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-gray-400 text-xl">Start your 7-day free trial on any plan.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Plan 1 */}
                    {/* Plan 1 */}
                    <PricingCard
                        title="Starter"
                        price="$29"
                        desc="For Independent Trainers"
                        features={[
                            "Up to 10 Clients",
                            "WhatsApp AI Agent",
                            "Trainer Dashboard",
                            "Custom Program Builder",
                            "Daily Workout Reminders",
                            "Fee Renewal Reminders"
                        ]}
                    />

                    {/* Plan 2: Best Value */}
                    <div className="relative transform md:-translate-y-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-75" />
                        <PricingCard
                            title="Pro Gym"
                            price="$59"
                            desc="For Growing Gyms"
                            highlight
                            features={[
                                "Up to 20 Clients",
                                "Gym Owner Dashboard",
                                "AI Diet/Workout Generator",
                                "Meal Photo Calorie Tracking",
                                "Upselling Add-ons Engine",
                                "Lead Enquiry Follow-up",
                                "Regional Diet Templates",
                                "Daily Tracking & Challenges"
                            ]}
                        />
                    </div>

                    {/* Plan 3 */}
                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        desc="For Multi-Location Chains"
                        features={["Custom Branding", "Dedicated Account Manager", "API Access", "On-site Training"]}
                    />
                </div>
            </main>
        </div>
    );
}

function PricingCard({ title, price, desc, features, highlight = false }: { title: string, price: string, desc: string, features: string[], highlight?: boolean }) {
    return (
        <div className={`relative p-8 rounded-2xl border ${highlight ? 'bg-card border-blue-500' : 'bg-card/50 border-white/10'} flex flex-col h-full`}>
            {highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                    Most Popular
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-200">{title}</h3>
            <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-white">{price}</span>
                {price !== 'Custom' && <span className="text-gray-500">/month</span>}
            </div>
            <p className="text-gray-300 mb-8 font-medium">{desc}</p>

            <div className="space-y-4 mb-8 flex-1">
                {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-sm text-gray-200 font-medium">{feat}</span>
                    </div>
                ))}
            </div>

            <Button className={`w-full h-12 rounded-xl font-bold ${highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                Start 7-Day Free Trial
            </Button>
        </div>
    )
}
