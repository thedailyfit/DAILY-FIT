"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function PlansLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <Link
                            href="/dashboard/plans/diets"
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                pathname === "/dashboard/plans/diets"
                                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-bold"
                                    : "hover:bg-transparent hover:underline",
                                "justify-start"
                            )}
                        >
                            Diet Plans
                        </Link>
                        <Link
                            href="/dashboard/plans/workouts"
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                pathname === "/dashboard/plans/workouts"
                                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-bold"
                                    : "hover:bg-transparent hover:underline",
                                "justify-start"
                            )}
                        >
                            Workout Plans
                        </Link>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    )
}
