"use client";

import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, CheckCircle2, HelpCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer"; // Assuming you have a footer or we can omit

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground bg-black selection:bg-blue-500/30">
            <LandingHeader />

            <main className="pt-32 pb-20 container mx-auto px-4 md:px-6">

                {/* 1. HERO PRICING */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Simple, Transparent Pricing</h1>
                    <p className="text-gray-400 text-xl">Start your 7-day free trial on any plan.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
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

                {/* 2. COMPARE FEATURES TABLE */}
                <div className="max-w-6xl mx-auto mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compare plan features</h2>
                        <p className="text-gray-400 text-lg">Everything you need to automate workouts, nutrition, follow-ups, and renewals.</p>
                    </div>

                    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0A0A0A]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-6 text-white min-w-[200px] bg-[#0A0A0A] sticky left-0 z-10">Features</th>
                                    <th className="p-6 text-center text-gray-300 min-w-[150px]">Starter</th>
                                    <th className="p-6 text-center text-blue-400 font-bold min-w-[150px] bg-blue-500/5">Pro Gym</th>
                                    <th className="p-6 text-center text-gray-300 min-w-[150px]">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                <SectionRow title="WHATSAPP AI & AUTOMATION" />
                                <FeatureRow name="WhatsApp Multi-System AI Agent" starter={true} pro={true} ent={true} />
                                <FeatureRow name="24/7 Member Query Handling" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Lead Enquiry Auto Follow-up" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Unlimited Member Messaging" starter={false} pro={true} ent={true} />

                                <SectionRow title="WORKOUT & NUTRITION" />
                                <FeatureRow name="Daily Workout Reminders" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Trainer-Created Workout Plans" starter={true} pro={true} ent={true} />
                                <FeatureRow name="AI-Generated Workout Plans" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Custom Diet Plans" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Regional Indian Diet Templates" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Meal Photo Calorie Tracking" starter={false} pro={true} ent={true} />

                                <SectionRow title="MEMBER ENGAGEMENT & TRACKING" />
                                <FeatureRow name="Motivation & Habit Nudges" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Weekly Progress Summaries" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Weight Check-ins" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Step Challenges" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Cheat Meal Control Alerts" starter={false} pro={true} ent={true} />

                                <SectionRow title="DASHBOARDS & ANALYTICS" />
                                <FeatureRow name="Trainer Dashboard" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Advanced Trainer Analytics" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Gym Owner Dashboard" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Revenue & Retention Insights" starter={false} starterText="Basic" pro={false} proText="Basic" ent={true} />
                                <FeatureRow name="Trainer Performance Tracking" starter={false} pro={false} ent={true} />

                                <SectionRow title="PAYMENTS & REVENUE" />
                                <FeatureRow name="Membership Fee Renewal Reminders" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Trainer Package Renewals" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Upselling Engine (Supplements / Plans)" starter={false} pro={true} ent={true} />
                                <FeatureRow name="Add-on Recommendation AI" starter={false} pro={false} ent={true} />

                                <SectionRow title="SUPPORT & SCALE" />
                                <FeatureRow name="Email Support" starter={true} pro={true} ent={true} />
                                <FeatureRow name="Priority Support" starter={false} pro={false} ent={true} />
                                <FeatureRow name="Dedicated Account Manager" starter={false} pro={false} ent={true} />
                                <FeatureRow name="Unlimited Members" starter={false} starterText="10" pro={false} proText="20" ent={true} />

                                {/* CTA ROW */}
                                <tr className="border-t border-white/10">
                                    <td className="p-6 bg-[#0A0A0A] sticky left-0"></td>
                                    <td className="p-6 text-center"><Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">Start Trial</Button></td>
                                    <td className="p-6 text-center bg-blue-500/5"><Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">Start Trial</Button></td>
                                    <td className="p-6 text-center"><Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">Contact Sales</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. FAQ SECTION */}
                <div className="max-w-3xl mx-auto mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        <FAQItem question="Do members need to install any app?" answer="No. Members receive everything on WhatsApp — workouts, diet plans, reminders, and progress summaries." />
                        <FAQItem question="Is this price per trainer or per gym?" answer="Starter is ideal for individual trainers. Pro Gym pricing is per gym, covering all trainers and members within the limit." />
                        <FAQItem question="Will this replace my trainers?" answer="No. DailyFit AI supports trainers, it does not replace them. Trainers can fully edit, override, and customize all plans." />
                        <FAQItem question="How soon will I see results?" answer="Most gyms see better attendance within 2–3 weeks and improved retention within 30–45 days." />
                        <FAQItem question="Is WhatsApp safe for fitness communication?" answer="Yes. WhatsApp has the highest open rate among all communication channels and is already trusted by members." />
                        <FAQItem question="What happens if I exceed member limits?" answer="You can upgrade anytime or add member packs. No disruption to existing members." />
                        <FAQItem question="Can I cancel anytime?" answer="Yes. There are no contracts. You can cancel or downgrade anytime." />
                        <FAQItem question="Is DailyFit AI suitable for Indian food & habits?" answer="Yes. DailyFit AI supports regional Indian diet templates, veg/non-veg preferences, and local routines." />
                        <FAQItem question="Do you help with onboarding?" answer="Yes. Pro Gym and Enterprise plans include guided onboarding to help you go live quickly." />
                    </div>
                </div>

                {/* 4. FINAL CTA BLOCK */}
                <div className="bg-gradient-to-r from-blue-900/40 to-violet-900/40 border border-blue-500/20 rounded-3xl p-12 text-center max-w-4xl mx-auto backdrop-blur-sm">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to automate your gym operations?</h2>
                    <p className="text-gray-300 text-lg mb-8">Start your 7-day free trial and see how DailyFit AI improves daily engagement, retention, and revenue.</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <Link href="/login">
                            <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg">
                                Start Free Trial →
                            </Button>
                        </Link>
                        <Link href="https://calendly.com" target="_blank">
                            <Button variant="outline" className="h-12 px-8 rounded-full border-white/20 text-white hover:bg-white/10 text-lg">
                                Talk to Sales →
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-black/30 inline-block px-6 py-3 rounded-xl border border-white/5">
                        <p className="text-blue-300 italic font-medium">“If you retain just one extra member per month, DailyFit AI pays for itself.”</p>
                    </div>
                </div>

            </main>
            <SiteFooter />
        </div>
    );
}

function SectionRow({ title }: { title: string }) {
    return (
        <tr className="bg-white/5">
            <td colSpan={4} className="p-4 pl-6 text-xs font-bold text-gray-400 tracking-wider uppercase border-y border-white/10 sticky left-0 z-10 bg-[#121212] md:bg-transparent md:static">
                {title}
            </td>
        </tr>
    );
}

function FeatureRow({ name, starter, pro, ent, starterText, proText }: { name: string, starter: boolean, pro: boolean, ent: boolean, starterText?: string, proText?: string }) {
    const Icon = ({ status, text }: { status: boolean, text?: string }) => {
        if (text) return <span className="font-bold text-white">{text}</span>;
        return status ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-700 mx-auto" />;
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-4 pl-6 text-sm text-gray-300 bg-[#0A0A0A] sticky left-0 z-10 font-medium md:bg-transparent">{name}</td>
            <td className="p-4 text-center"><Icon status={starter} text={starterText} /></td>
            <td className="p-4 text-center bg-blue-500/5"><Icon status={pro} text={proText} /></td>
            <td className="p-4 text-center"><Icon status={ent} /></td>
        </tr>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                className="w-full flex items-center justify-between py-4 text-left hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : 'text-gray-500'}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

function PricingCard({ title, price, desc, features, highlight = false }: { title: string, price: string, desc: string, features: string[], highlight?: boolean }) {
    return (
        <div className={`relative p-8 rounded-2xl border ${highlight ? 'bg-zinc-900 border-blue-500 shadow-2xl shadow-blue-900/20' : 'bg-zinc-900/50 border-white/10'} flex flex-col h-full transition-all hover:scale-[1.02]`}>
            {highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                    Most Popular
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-200">{title}</h3>
            <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-white">{price}</span>
                {price !== 'Custom' && <span className="text-gray-500">/month</span>}
            </div>
            <p className="text-gray-400 mb-8 font-medium text-sm">{desc}</p>

            <div className="space-y-4 mb-8 flex-1">
                {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-sm text-gray-300 font-medium">{feat}</span>
                    </div>
                ))}
            </div>

            <Link href="/login" className="mt-auto">
                <Button className={`w-full h-12 rounded-xl font-bold ${highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    Start 7-Day Free Trial
                </Button>
            </Link>
        </div>
    )
}
