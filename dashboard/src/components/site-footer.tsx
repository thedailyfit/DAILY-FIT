import Link from "next/link";
import { Dumbbell, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="bg-black text-white pt-24 pb-0 overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

                    {/* Brand Column (Wider) */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 font-bold text-2xl">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-white" />
                            </div>
                            <span>DailyFit AI</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            WhatsApp-first AI automation for gyms & personal trainers.
                            Automate daily workouts, diet plans, follow-ups, and progress tracking —
                            so you can retain members, scale trainers, and grow revenue on autopilot.
                        </p>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Built for</p>
                            <p className="text-sm text-gray-300">Gyms • Personal Trainers • Fitness Studios</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Works on</p>
                            <p className="text-sm text-gray-300">WhatsApp (no app required)</p>
                        </div>

                        <div className="pt-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Follow DailyFit AI</p>
                            <div className="flex gap-4">
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></Link>
                            </div>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="md:col-span-3"></div>

                    {/* Links Column 1: DAILYFIT AI */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-lg font-bold">DAILYFIT AI</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2: Resources */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-lg font-bold">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Status Page</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 py-8 text-center text-xs text-gray-500 mb-12">
                    <p>© DailyFit AI · Built for gyms & trainers worldwide</p>
                </div>

            </div>

            {/* MASSIVE FOOTER TEXT - Adjusted to prevent cropping */}
            <div className="w-full flex justify-center items-end leading-none select-none pointer-events-none pb-4 md:pb-0">
                <h1 className="text-[13vw] md:text-[16vw] font-bold text-white tracking-tighter opacity-100 leading-none">
                    DailyFit AI
                </h1>
            </div>
        </footer>
    );
}
