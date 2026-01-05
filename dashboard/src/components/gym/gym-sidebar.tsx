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
    CreditCard,
    Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GymSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItemClass = (path: string) => cn(
        "w-full justify-start font-bold h-11 text-sm mb-1 transition-all",
        isActive(path)
            ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
    );

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-64 bg-sidebar min-h-screen p-6 hidden md:flex flex-col flex-shrink-0 shadow-2xl z-20 border-r border-sidebar-border"
        >
            {/* Brand Logo Area */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-black text-primary-foreground text-xl shadow-lg">
                    D
                </div>
                <div>
                    <span className="text-xl font-black text-sidebar-foreground tracking-tight block leading-none">DAILYFIT</span>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Gym Admin</span>
                </div>
            </div>

            <nav className="space-y-1 flex-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>

                <Link href="/gym">
                    <Button variant="ghost" className={navItemClass("/gym")}>
                        <LayoutDashboard className="mr-3 h-4 w-4" /> Overview
                    </Button>
                </Link>

                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Management</p>

                <Link href="/gym/members">
                    <Button variant="ghost" className={navItemClass("/gym/members")}>
                        <Users className="mr-3 h-4 w-4" /> Members
                    </Button>
                </Link>

                <Link href="/gym/pt-clients">
                    <Button variant="ghost" className={navItemClass("/gym/pt-clients")}>
                        <Medal className="mr-3 h-4 w-4" /> PT Clients
                    </Button>
                </Link>

                <Link href="/gym/trainers">
                    <Button variant="ghost" className={navItemClass("/gym/trainers")}>
                        <Dumbbell className="mr-3 h-4 w-4" /> Trainers
                    </Button>
                </Link>

                <Link href="/gym/programs">
                    <Button variant="ghost" className={navItemClass("/gym/programs")}>
                        <BarChart3 className="mr-3 h-4 w-4" /> Program Builder
                    </Button>
                </Link>

                <Link href="/gym/maintenance">
                    <Button variant="ghost" className={navItemClass("/gym/maintenance")}>
                        <Wrench className="mr-3 h-4 w-4" /> Maintenance
                    </Button>
                </Link>

                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Growth</p>

                <Link href="/gym/leads">
                    <Button variant="ghost" className={navItemClass("/gym/leads")}>
                        <MessageSquare className="mr-3 h-4 w-4" /> Leads & Enquiries
                    </Button>
                </Link>

                <Link href="/gym/products">
                    <Button variant="ghost" className={navItemClass("/gym/products")}>
                        <Store className="mr-3 h-4 w-4" /> Pro Shop
                    </Button>
                </Link>

                <Link href="/gym/analytics">
                    <Button variant="ghost" className={navItemClass("/gym/analytics")}>
                        <BarChart3 className="mr-3 h-4 w-4" /> Analytics
                    </Button>
                </Link>

            </nav>

            <div className="pt-6 border-t border-sidebar-border space-y-2">
                <Link href="/gym/subscription">
                    <Button variant="ghost" className={navItemClass("/gym/subscription")}>
                        <CreditCard className="mr-3 h-4 w-4" /> Subscription
                    </Button>
                </Link>

                <Link href="/gym/settings">
                    <Button variant="ghost" className={navItemClass("/gym/settings")}>
                        <Settings className="mr-3 h-4 w-4" /> Settings
                    </Button>
                </Link>

                <div className="mt-4 p-4 rounded-xl bg-accent border border-border hover:bg-accent/80 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground ring-2 ring-border">
                            JS
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-foreground truncate">John Smith</p>
                            <p className="text-[10px] text-muted-foreground truncate">Owner • DailyFit</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
