"use client";

import Image from "next/image";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { BookDemoModal } from "@/components/book-demo-modal";
import { ReviewMarquee } from "@/components/review-marquee";
import { FAQSection } from "@/components/faq-section";
import { BeforeAfter } from "@/components/before-after";
import { FeatureShowcase } from "@/components/feature-showcase";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MessageSquare, LineChart, Utensils, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";
import { HeroLiveNotifications } from "@/components/hero-live-notifications";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-blue-500/30">
      <LandingHeader />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              Automate Your Gym with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">Intelligent AI</span>
            </h1>

            {/* Scrolling Text Effect */}
            <div className="h-12 md:h-16 mb-6 overflow-hidden flex flex-col justify-center">
              <div className="text-2xl md:text-4xl font-bold text-white flex items-center justify-center lg:justify-start gap-3">
                <span className="text-gray-400">Automate</span>
                <div className="relative h-12 md:h-16 w-64 overflow-hidden">
                  <div className="animate-scroll-text absolute top-0 left-0 w-full text-green-400">
                    <div className="h-12 md:h-16 flex items-center">Workouts</div>
                    <div className="h-12 md:h-16 flex items-center">Nutrition</div>
                    <div className="h-12 md:h-16 flex items-center">Engagement</div>
                    <div className="h-12 md:h-16 flex items-center">Renewals</div>
                    <div className="h-12 md:h-16 flex items-center">Follow-ups</div>
                    {/* Duplicate first for smooth loop */}
                    <div className="h-12 md:h-16 flex items-center">Workouts</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Replace manual sales, diet planning, and check-ins with DailyFit AI a WhatsApp-first fitness automation system built for gyms and trainers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/pricing">
                <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-lg shadow-blue-600/25 transition-all hover:scale-105">
                  Start 7-Day Free Trial
                </Button>
              </Link>
              <BookDemoModal>
                <Button variant="outline" className="h-12 px-8 rounded-full border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-lg backdrop-blur-sm">
                  Book Free Live Demo
                </Button>
              </BookDemoModal>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="text-left">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-500">Gyms Trusted</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-left">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-sm text-gray-500">AI Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            {/* Live Notifications Layer */}
            <HeroLiveNotifications />

            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-[2rem] blur-2xl opacity-30 animate-pulse" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 backdrop-blur-xl">
              <Image
                src="/hero-real.png"
                alt="DailyFit AI Dashboard in Action"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Removed static overlay */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. NEW FEATURE SHOWCASE (The "Toolkit" replacement) */}
      <FeatureShowcase />

      {/* 3. GALLERY SECTION - DAILYFIT IN ACTION */}
      <section className="py-32 container mx-auto px-4 md:px-6 relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live in Gyms
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">DailyFit <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">In Action</span></h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            See how Modern gyms use AI to Automate Daily Operations and Focus on Results that matter
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <Image
              src="/gym-action.png"
              alt="Personal Training Session"
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
            />
            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 backdrop-blur-md flex items-center justify-center mb-6 border border-blue-500/30">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Focus on Coaching</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Stop tracking sheets manually. Let AI handle the logs, reminders, and progress tracking so you can focus on form and motivation.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-sm">
                Trainer Efficiency <div className="h-px w-8 bg-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <Image
              src="/gym-consult.png"
              alt="Client Consultation"
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
            />
            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 backdrop-blur-md flex items-center justify-center mb-6 border border-purple-500/30">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Instant Personalization</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Deliver AI-generated diet & workout plans in seconds, customized to each member's goals, injuries, and food preferences.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-sm">
                Member Experience <div className="h-px w-8 bg-purple-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section >

      {/* 4. FEATURES GRID */}
      < section className="py-24 bg-card/30 relative" >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-blue-500">Growth</span></h2>
            <p className="text-gray-400 text-lg">Everything you need to run a 7-figure fitness business without the burnout.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-green-400" />}
              title="WhatsApp Multi-System Agent"
              desc="Conversational AI that captures leads, answers queries, and manages members 24/7."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6 text-blue-400" />}
              title="Advanced Owner Dashboard"
              desc="Deep analytics on revenue, retention, and trainer performance with weekly reports."
            />
            <FeatureCard
              icon={<Utensils className="w-6 h-6 text-orange-400" />}
              title="Custom Diet & Workout Plans"
              desc="Create your own or use AI to generate personalized plans with regional Indian foods."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-violet-400" />}
              title="Meal Photo Calorie Tracking"
              desc="Members snap a photo of their food, and AI tracks calories and macros instantly."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Automated Daily Nudges"
              desc="Motivation, workout reminders, and habit tracking sent automatically to members."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-red-400" />}
              title="Smart Fee Renewals"
              desc="Automated reminders for membership fees and trainer package renewals."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-pink-400" />}
              title="Upselling Engine"
              desc="AI suggests add-ons like Whey Protein, Supplements, and Advanced Plans to members."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="Lead Enquiry Follow-up"
              desc="Never lose a lead. AI follows up with prospects until they are ready to join."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-cyan-400" />}
              title="Daily Member Tracking"
              desc="Weekly weight check-ins, step challenges, and cheat meal control notifications."
            />
          </div>
        </div>
      </section >

      {/* 5. CLIENT REVIEWS MARQUEE (New Global Version) */}
      < ReviewMarquee />

      {/* 6. SHORT CTA SECTION */}
      < section className="py-24 container mx-auto px-4 text-center" >
        <div className="relative rounded-[3rem] p-1 bg-gradient-to-b from-blue-500/20 to-purple-500/20 max-w-5xl mx-auto">
          <div className="bg-black/80 backdrop-blur-xl rounded-[2.9rem] py-20 px-6 md:px-20 overflow-hidden relative border border-white/10">

            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to <span className="text-blue-500">Transform</span>?
              </h2>
              <p className="text-gray-400 text-xl mb-10 max-w-2xl">
                Join the elite circle of gym owners who have automated their growth.
              </p>

              <Link href="/pricing" className="group">
                <Button className="h-16 px-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl shadow-2xl shadow-blue-900/50 hover:shadow-blue-600/50 hover:scale-105 transition-all w-full md:w-auto flex items-center gap-3">
                  Start Free Trial <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <p className="mt-6 text-sm text-gray-500 font-medium">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section >

      {/* 7. PRICING SECTION */}
      < section className="py-24 container mx-auto px-4 md:px-6" >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Flexible Pricing Plans</h2>
          <p className="text-gray-400 text-lg">Choose a plan that grows with you.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free/Basic */}
          <div className="p-8 rounded-2xl border border-white/10 bg-card/20 hover:bg-card/40 transition-all">
            <h3 className="text-xl font-bold mb-2 text-white">Starter</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">For Independent Trainers</p>
            <Link href="/pricing">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl mb-6">Get Started</Button>
            </Link>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> 10 Clients</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Basic Dashboard</li>
            </ul>
          </div>
          {/* Pro - Highlighted */}
          <div className="p-8 rounded-2xl border border-blue-500 bg-blue-900/10 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-xl font-bold uppercase">Popular</div>
            <h3 className="text-xl font-bold mb-2 text-white">Pro Gym</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">$59</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">For Growing Centers</p>
            <Link href="/pricing">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mb-6 shadow-lg shadow-blue-500/25">Get Started</Button>
            </Link>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> 20 Clients</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Detailed Reports</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Fee Reminders</li>
            </ul>
          </div>
          {/* Elite */}
          <div className="p-8 rounded-2xl border border-white/10 bg-card/20 hover:bg-card/40 transition-all">
            <h3 className="text-xl font-bold mb-2 text-white">Elite</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">For Multi-Location</p>
            <Link href="/pricing">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl mb-6">Contact Sales</Button>
            </Link>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Unlimited Clients</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Custom API</li>
            </ul>
          </div>
        </div>
      </section >

      {/* 8. BEFORE & AFTER */}
      < BeforeAfter />

      {/* 9. FAQ */}
      < FAQSection />

      {/* NEW FOOTER */}
      < SiteFooter />
    </div >
  );
}

import { SpotlightCard } from "@/components/spotlight-card";

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <SpotlightCard className="p-8 h-full bg-card/40 hover:bg-card/60 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{title}</h3>
      <p className="text-gray-300 leading-relaxed font-medium">{desc}</p>
    </SpotlightCard>
  )
}
