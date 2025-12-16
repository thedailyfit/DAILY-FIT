import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Users, Globe, Award } from "lucide-react";

export default function AboutPage() {
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
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                            Log in
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                <section className="py-24 px-6 md:px-0">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                                Evaluating Fitness Intelligence
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                We believe the future of fitness isn't just about harder workouts—it's about smarter coaching.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 pt-12">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-indigo-400">Our Mission</h2>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    DailyFit AI was born from a simple realization: Trainers are burnt out. The administrative burden of managing diets, check-ins, and payments leaves little time for actual coaching.
                                </p>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    We built an "AI Operating System" that handles the grunt work. Our agents analyze food photos, track progress, and even handle payments, allowing gym owners to scale without sacrificing quality.
                                </p>
                            </div>
                            <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot className="h-32 w-32 text-indigo-500/50 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Active Users", val: "10,000+", icon: Users },
                                { label: "Countries", val: "25", icon: Globe },
                                { label: "Trainers Empowered", val: "500+", icon: Award },
                                { label: "AI Interactions", val: "1M+", icon: Bot },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-6 bg-white/5 rounded-xl border border-white/5">
                                    <stat.icon className="h-6 w-6 text-indigo-400 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5">
                © 2025 DailyFit Inc. Built for the future of fitness.
            </footer>
        </div>
    );
}
