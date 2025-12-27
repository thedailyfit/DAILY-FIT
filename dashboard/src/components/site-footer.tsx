import Link from "next/link";
import { Dumbbell, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="bg-black text-white pt-24 pb-8 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-white" />
                            </div>
                            <span>DailyFit AI</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Automate your fitness business with WhatsApp-first AI agents.
                            Grow revenue, retention, and reputation on autopilot.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">WhatsApp Agent</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Workout Builder</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Diet Planner</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Payment Recovery</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Owner Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Compare */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Compare</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Traqade</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Gympik</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">MyFitnessPal</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Excel Sheets</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 mb-16">
                    <p>© 2025 DailyFit AI, Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white">Privacy</Link>
                        <Link href="#" className="hover:text-white">Terms</Link>
                        <Link href="#" className="hover:text-white">Sitemap</Link>
                    </div>
                </div>

            </div>

            {/* MASSIVE FOOTER TEXT */}
            <div className="w-full flex justify-center items-end leading-none select-none pointer-events-none">
                <h1 className="text-[15vw] md:text-[18vw] font-bold text-white tracking-tighter opacity-100 leading-[0.8] mb-[-3vw]">
                    dailyfit ai
                </h1>
            </div>
        </footer>
    );
}
