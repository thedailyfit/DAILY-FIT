"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Dumbbell,
    Utensils,
    MessageSquare,
    Settings,
    Layers,
    FilePlus2
} from "lucide-react";

export function TrainerSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Clients", icon: Users, href: "/dashboard/clients" },
        { name: "Program Builder", icon: Layers, href: "/dashboard/programs/builder" }, // New Link
        { name: "Plans Library", icon: FilePlus2, href: "/dashboard/plans" },
        { name: "Messages", icon: MessageSquare, href: "/dashboard/chat" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    return (
        <aside className="w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800 min-h-screen flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center mr-3">
                    <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white tracking-wide">DailyFit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                            isActive(item.href)
                                ? "bg-violet-600 text-white"
                                : "hover:bg-slate-800 hover:text-white"
                        )}>
                            <item.icon className={cn("h-5 w-5 mr-3", isActive(item.href) ? "text-white" : "text-slate-400")} />
                            {item.name}
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Footer User Profile (Stax style often has this at bottom) */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                        TR
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Trainer Account</p>
                        <p className="text-xs text-slate-500">Pro Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
