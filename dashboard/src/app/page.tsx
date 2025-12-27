"use client";

import Image from "next/image";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { BookDemoModal } from "@/components/book-demo-modal";
import { ReviewMarquee } from "@/components/review-marquee";
import { FAQSection } from "@/components/faq-section";
import { BeforeAfter } from "@/components/before-after";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MessageSquare, LineChart, Utensils, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-blue-500/30">
      <LandingHeader />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <Zap className="w-4 h-4 fill-blue-400" />
              <span>AI for Gym Owners 2.0</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Automate Your Gym with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">Intelligent AI</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Replace manual sales, diet planning, and check-ins with DailyFit AI.
              The all-in-one Growth Operating System for modern fitness centers.
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

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 animate-in slide-in-from-bottom-6 duration-700 delay-500">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">New Lead Captured via WhatsApp</p>
                  <p className="text-xs text-gray-400">Rahul S. • Muscle Gain • Just now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">DailyFit In Action</h2>
          <p className="text-gray-300 text-lg">Real results in real gyms.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
            <Image
              src="/gym-action.png"
              alt="Personal Training Session"
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex items-end">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Focus on Training</h3>
                <p className="text-gray-300 text-sm">Let AI handle the admin while you handle the weights.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
            <Image
              src="/gym-consult.png"
              alt="Client Consultation"
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex items-end">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Personalized Plans</h3>
                <p className="text-gray-300 text-sm">Deliver AI-generated diet & workout plans in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-card/30 relative">
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
      </section>

      {/* FEATURE HIGHLIGHTS (THE ULTIMATE TOOLKIT STYLE) */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-6xl font-bold mb-6">The Ultimate Toolkit for <br />Gym Owners</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">Have your Cake!! Eat it toooooo. We'll answer your leads.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: WhatsApp Graph */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-card/30 p-8 flex flex-col justify-between hover:border-blue-500/30 transition-colors group">
            <div className="mb-8 relative h-64 w-full rounded-2xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center">
              {/* Mockup CSS UI since GenAI failed */}
              <div className="w-3/4 bg-gray-900 rounded-lg p-3 border border-gray-800 shadow-2xl">
                <div className="flex gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AI</div>
                  <div className="bg-gray-800 rounded-r-lg rounded-bl-lg p-2 text-xs text-blue-200">
                    Progress Report 📈
                    <div className="h-16 w-full mt-2 bg-gradient-to-t from-blue-500/20 to-transparent relative">
                      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <path d="M0,50 L20,40 L40,45 L60,20 L80,30 L100,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">WhatsApp Graph Agent</h3>
              <p className="text-gray-400">Automatically send visualized progress reports directly to client chats.</p>
            </div>
          </div>

          {/* Feature 2: Fee Reminder */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-card/30 p-8 flex flex-col justify-between hover:border-red-500/30 transition-colors group">
            <div className="mb-8 relative h-64 w-full rounded-2xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center">
              {/* Mockup CSS UI */}
              <div className="w-3/4 bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                  <div className="text-xs font-bold text-white">Notifications</div>
                  <div className="text-[10px] text-gray-500">Just now</div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">₹</div>
                  <div>
                    <div className="text-xs text-white font-medium">Fees Collected</div>
                    <div className="text-[10px] text-gray-400">Rahul paid ₹1500 via UPI</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Smart Fee Reminders</h3>
              <p className="text-gray-400">Dashboard alerts & WhatsApp nudges ensure you get paid on time, every time.</p>
            </div>
          </div>

          {/* Feature 3: Growth */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-card/30 p-8 flex flex-col justify-between hover:border-green-500/30 transition-colors group">
            <div className="mb-8 relative h-64 w-full rounded-2xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">11X</div>
                <div className="text-sm text-gray-500">Engagement Growth</div>
                <div className="mt-4 h-2 w-32 bg-gray-800 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">11X Engagement</h3>
              <p className="text-gray-400">Boost client retention with automated birthday wishes & workout streaks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS MARQUEE */}
      <ReviewMarquee />

      {/* PRICING SECTION (SHORT) */}
      <section className="py-24 container mx-auto px-4 md:px-6">
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
      </section>

      {/* FAQ SECTION */}
      <FAQSection />



      {/* CTA SECTION */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 px-6 py-16 md:px-16 md:py-24 text-center">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Upgrade Your Gym?</h2>
            <p className="text-blue-200 text-lg">Join 500+ Gym Owners automating their success with DailyFit.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/pricing">
                <Button className="h-14 px-10 rounded-full bg-white text-blue-900 hover:bg-gray-100 font-bold text-lg">
                  Start 7-Day Free Trial
                </Button>
              </Link>
              <div className="text-white/80 flex items-center justify-center gap-2">
                <span>or Call us:</span>
                <a href="tel:+918919205848" className="font-bold hover:underline">+91 89192 05848</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 bg-black/40">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="mb-4 text-lg font-bold text-white">DailyFit AI Solutions</p>
          <p>© 2025 DailyFit Inc. All rights reserved.</p>
        </div>
      </footer>
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
