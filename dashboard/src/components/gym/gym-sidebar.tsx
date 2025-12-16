"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Dumbbell, ShoppingBag, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function GymSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6 hidden md:block flex-shrink-0">
            <div className="mb-8 flex items-center gap-2">
                <div className="h-8 w-8 bg-violet-600 rounded flex items-center justify-center font-bold text-white">G</div>
                <span className="text-lg font-bold text-slate-800">My Gym</span>
            </div>
            <nav className="space-y-2">
                <Link href="/gym">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/gym")
                                ? "text-violet-700 bg-violet-50 font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Management
                    </Button>
                </Link>
                <Link href="/gym/members">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/gym/members")
                                ? "text-violet-700 bg-violet-50 font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <Users className="mr-2 h-4 w-4" /> Regular Members
                    </Button>
                </Link>
                <Link href="/gym/products">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-medium",
                            isActive("/gym/products")
                                ? "text-violet-700 bg-violet-50 font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" /> Products/Add-ons
                    </Button>
                </Link>
                <div className="border-t my-2 pt-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-amber-600 hover:bg-amber-50">
                            <DollarSign className="mr-2 h-4 w-4" /> Switch to Admin
                        </Button>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
