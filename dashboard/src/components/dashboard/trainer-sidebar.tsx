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
        <aside className="w-64 bg-black border-zinc-900 border-r min-h-screen flex flex-col flex-shrink-0 pt-6 pb-6 pl-4 pr-4">
            {/* Header */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="h-8 w-8 bg-[#CCFF00] rounded-lg flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-black" />
                </div>
                <span className="font-bold text-white text-xl tracking-tighter">DailyFit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                            isActive(item.href)
                                ? "text-[#CCFF00]"
                                : "text-zinc-500 hover:text-white"
                        )}>
                            {/* Hover Highlight BG */}
                            <div className={cn(
                                "absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl",
                                isActive(item.href) && "bg-white/5 opacity-100"
                            )} />

                            <item.icon className={cn(
                                "h-5 w-5 mr-3 transition-colors",
                                isActive(item.href) ? "text-[#CCFF00]" : "text-zinc-500 group-hover:text-white"
                            )} />
                            <span className="relative z-10">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-zinc-900 pt-6">
                <button className="flex items-center gap-3 px-2 w-full text-zinc-500 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </aside>
    );
}
