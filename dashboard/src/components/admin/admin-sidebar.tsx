"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CreditCard, LifeBuoy, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 min-h-screen p-6 hidden md:block flex-shrink-0">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">DF</div>
                <span className="text-lg font-bold tracking-tight">DailyFit <span className="text-indigo-400">Admin</span></span>
            </div>

            <nav className="space-y-1">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
                <Link href="/admin">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/admin")
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4" /> Global Dashboard
                    </Button>
                </Link>

                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Business</p>
                <Link href="/admin/payments">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/admin/payments")
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <CreditCard className="mr-3 h-4 w-4" /> Revenue & Plans
                    </Button>
                </Link>
                <Link href="/admin/products">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/admin/products")
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <PackageOpen className="mr-3 h-4 w-4" /> B2B Product Store
                    </Button>
                </Link>

                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Operations</p>
                <Link href="/admin/support">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/admin/support")
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <LifeBuoy className="mr-3 h-4 w-4" /> Support Tickets
                    </Button>
                </Link>
            </nav>
        </aside>
    );
}
