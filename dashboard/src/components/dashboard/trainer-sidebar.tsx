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
    LogOut
} from "lucide-react";

export function TrainerSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Clients", icon: Users, href: "/dashboard/clients" },
        { name: "Program Builder", icon: Layers, href: "/dashboard/programs/builder" },
        { name: "Plans Library", icon: FilePlus2, href: "/dashboard/plans" },
        { name: "Messages", icon: MessageSquare, href: "/dashboard/chat" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    return (
        <aside className="w-64 bg-black border-zinc-900 border-r min-h-screen flex flex-col flex-shrink-0 pt-6 pb-6 pl-4 pr-4 z-50">
            {/* Header - Fixed Logo Visibility */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="h-9 w-9 bg-[#CCFF00] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.4)]">
                    <Dumbbell className="h-5 w-5 text-black transform -rotate-12" />
                </div>
                {/* Changed text from text-white to text-white for maximum contrast, ensured bold */}
                <span className="font-black text-white text-2xl tracking-tight">DailyFit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                            isActive(item.href)
                                ? "text-[#CCFF00] bg-white/5"
                                : "text-zinc-500 hover:text-white"
                        )}>
                            {/* Hover Highlight BG - Neon Glow on edge */}
                            <div className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#CCFF00] rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100",
                                isActive(item.href) && "opacity-100"
                            )} />

                            <item.icon className={cn(
                                "h-5 w-5 mr-3 transition-colors",
                                isActive(item.href) ? "text-[#CCFF00]" : "text-zinc-500 group-hover:text-[#CCFF00]"
                            )} />
                            <span className="relative z-10 transition-transform group-hover:translate-x-1">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-zinc-900 pt-6">
                <button className="flex items-center gap-3 px-4 py-2 w-full text-zinc-500 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5 group">
                    <LogOut className="h-5 w-5 group-hover:rotate-180 transition-transform" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </aside>
    );
}
