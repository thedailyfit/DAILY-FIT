"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    MessageSquare,
    Settings,
    Layers,
    FilePlus2,
    LogOut,
    Utensils,
    CreditCard
} from "lucide-react";

export function TrainerSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Clients", icon: Users, href: "/dashboard/clients" },
        { name: "Messages", icon: MessageSquare, href: "/dashboard/chat" },
        { name: "Program Builder", icon: Layers, href: "/dashboard/programs/builder" },
        { name: "Diet Plans", icon: Utensils, href: "/dashboard/plans/diets" },
        { name: "Workout Plans", icon: Dumbbell, href: "/dashboard/plans/workouts" },
        { name: "Subscription", icon: CreditCard, href: "/dashboard/subscription" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col flex-shrink-0 pt-6 pb-6 pl-4 pr-4 z-50 transition-colors duration-300">
            {/* Header - Fixed Logo Visibility */}
            <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer">
                <div className="h-9 w-9 bg-sidebar-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Dumbbell className="h-5 w-5 text-sidebar-primary-foreground transform -rotate-12" />
                </div>
                <span className="font-black text-sidebar-foreground text-2xl tracking-tight group-hover:text-sidebar-primary transition-colors">DailyFit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                            isActive(item.href)
                                ? "text-sidebar-primary-foreground bg-sidebar-primary shadow-lg"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                        )}>
                            <item.icon className={cn(
                                "h-5 w-5 mr-3 transition-colors",
                                isActive(item.href) ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                            )} />
                            <span className="relative z-10 transition-transform group-hover:translate-x-1">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-sidebar-border pt-6">
                <button className="flex items-center gap-3 px-4 py-2 w-full text-zinc-500 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5 group">
                    <LogOut className="h-5 w-5 group-hover:rotate-180 transition-transform" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </aside>
    );
}
