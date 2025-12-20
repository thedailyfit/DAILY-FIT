"use client";

import Image from "next/image";
import { LandingHeader } from "@/components/landing-header";
import { BookDemoModal } from "@/components/book-demo-modal";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <LandingHeader />

            <main className="pt-32 pb-20 container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    <div className="flex-1 space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold">Empowering Gym Owners to <br /> <span className="text-blue-500">Scale Without Stress</span></h1>

                        <div className="space-y-4 text-lg text-gray-400">
                            <p>
                                DailyFit started with a simple mission: **To help gym owners focus on fitness, not admin work.**
                            </p>
                            <p>
                                We realized that most gym owners spend 70% of their time on sales calls, diet charts, and payment reminders. That's why we built **DailyFit AI** – an intelligent assistant that handles the boring stuff so you can build your empire.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5">
                            <div className="p-6 bg-card border border-white/10 rounded-xl">
                                <Phone className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="font-bold text-white mb-2">Call Us Directly</h3>
                                <a href="tel:+918919205848" className="text-gray-300 hover:text-white transition">+91 89192 05848</a>
                            </div>
                            <div className="p-6 bg-card border border-white/10 rounded-xl">
                                <Mail className="w-8 h-8 text-violet-500 mb-4" />
                                <h3 className="font-bold text-white mb-2">Email Support</h3>
                                <a href="mailto:support@dailyfit.ai" className="text-gray-300 hover:text-white transition">support@dailyfit.ai</a>
                            </div>
                        </div>

                        <BookDemoModal>
                            <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-gray-200">
                                Book a Strategy Call
                            </Button>
                        </BookDemoModal>
                    </div>

                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <Image
                                src="/about-image.png"
                                alt="DailyFit Success Story"
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[100px] opacity-50" />
                        <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-violet-600 rounded-full blur-[100px] opacity-50" />
                    </div>

                </div>
            </main>
        </div>
    );
}
