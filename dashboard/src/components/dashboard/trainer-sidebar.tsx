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
    FilePlus2
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
        <aside className="w-72 bg-[#09090B] border-r border-zinc-800/50 min-h-screen flex flex-col flex-shrink-0 p-4">
            {/* Header */}
            <div className="h-16 flex items-center px-2 mb-6">
                <div className="h-10 w-10 bg-lime-400 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                    <Dumbbell className="h-6 w-6 text-black" />
                </div>
                <span className="font-bold text-white text-xl tracking-tight">DailyFit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200",
                            isActive(item.href)
                                ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                        )}>
                            <item.icon className={cn("h-5 w-5 mr-3", isActive(item.href) ? "text-black" : "text-zinc-500 group-hover:text-white")} />
                            {item.name}
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-zinc-800">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-mono">
                        TR
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Trainer Account</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Pro Plan Active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
