"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Users,
    LayoutDashboard,
    Settings,
    Dumbbell,
    BarChart3,
    MessageSquare,
    Medal,
    Store,
    Moon,
    Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GymSidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isActive = (path: string) => pathname === path;

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-64 bg-[#212121] min-h-screen p-6 hidden md:flex flex-col flex-shrink-0 shadow-2xl z-20 border-r border-white/5"
        >
            {/* Brand Logo Area */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center font-black text-black text-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    G
                </div>
                <div>
                    <span className="text-xl font-black text-white tracking-tight block leading-none">DAILYFIT GYM</span>
                    <span className="text-[10px] uppercase font-bold text-[#cbfe00] tracking-widest">Admin Pro</span>
                </div>
            </div>

            <nav className="space-y-1 flex-1">
                <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Main Menu</p>

                <Link href="/gym">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4" /> Overview
                    </Button>
                </Link>

                <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Management</p>

                <Link href="/gym/members">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/members")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Users className="mr-3 h-4 w-4" /> Members
                    </Button>
                </Link>

                <Link href="/gym/pt-clients">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/pt-clients")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Dumbbell className="mr-3 h-4 w-4" /> PT Clients
                    </Button>
                </Link>

                <Link href="/gym/trainers">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/trainers")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Medal className="mr-3 h-4 w-4" /> Trainers
                    </Button>
                </Link>

                <Link href="/gym/programs">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/programs")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <BarChart3 className="mr-3 h-4 w-4" /> Program Builder
                    </Button>
                </Link>

                <Link href="/gym/maintenance">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/maintenance")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Settings className="mr-3 h-4 w-4" /> Maintenance
                    </Button>
                </Link>

                <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Growth</p>

                <Link href="/gym/leads">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/leads")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <MessageSquare className="mr-3 h-4 w-4" /> Leads & Enquiries
                    </Button>
                </Link>

                <Link href="/gym/products">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/products")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Store className="mr-3 h-4 w-4" /> Pro Shop
                    </Button>
                </Link>

                <Link href="/gym/analytics">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/analytics")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <BarChart3 className="mr-3 h-4 w-4" /> Analytics
                    </Button>
                </Link>

            </nav>

            <div className="pt-6 border-t border-white/10">
                <Link href="/gym/settings">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
                            isActive("/gym/settings")
                                ? "bg-[#cbfe00] text-black shadow-[0_0_15px_rgba(203,254,0,0.3)] hover:bg-[#b0dc00]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Settings className="mr-3 h-4 w-4" /> Settings
                    </Button>
                </Link>

                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors cursor-pointer group relative">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
                            JS
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">John Smith</p>
                            <p className="text-[10px] text-zinc-500 truncate">Owner • Iron Pump</p>
                        </div>
                    </div>
                    {mounted && (
                        <div
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTheme(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            {theme === 'dark' ? <Sun className="h-3 w-3 text-yellow-400" /> : <Moon className="h-3 w-3 text-white" />}
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}
