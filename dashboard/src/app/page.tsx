import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 text-slate-50">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">DailyFit AI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />

          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 Now Available: Voice & Vision AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-2">
              The AI Operating System <br /> for Modern Gyms
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Scale your fitness business with an AI workforce. Automate diet plans,
              track progress via photos, and coach clients 24/7 with a human-like voice agent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 text-white hover:bg-white/5">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Trusted by Next-Gen Trainers</p>
              <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos */}
                <div className="h-8 w-24 bg-white/10 rounded" />
                <div className="h-8 w-24 bg-white/10 rounded" />
                <div className="h-8 w-24 bg-white/10 rounded" />
                <div className="h-8 w-24 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Superpowers for your Gym</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-amber-400" />,
                  title: "AI & Vision",
                  desc: "Clients snap food photos, AI logs calories. Voice notes dictate workouts. It's magic."
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-emerald-400" />,
                  title: "Smart Analytics",
                  desc: "Predict client churn before it happens. Visualize revenue and retention in real-time."
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-indigo-400" />,
                  title: "Automated Ops",
                  desc: "Payments, plan delivery, and weekly check-ins tailored to each client's mood."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                  <div className="mb-6 p-4 rounded-xl bg-slate-950 w-fit group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-3xl p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10" />

            <h2 className="text-4xl font-bold mb-6">Ready to upgrade your business?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-xl mx-auto">
              Join 500+ gym owners who have automated their coaching with DailyFit AI.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 h-14 px-8 text-lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Bot className="h-6 w-6" />
            <span className="font-bold">DailyFit AI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Contact</Link>
          </div>
          <div className="text-sm text-slate-600">
            © 2025 DailyFit Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
