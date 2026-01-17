"use client";

import { usePathname } from "next/navigation";
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorTrail } from "@/components/cursor-trail";

export default function TrainerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/trainer/login" || pathname === "/trainer/join";

    return (
        <ThemeProvider>
            <CursorTrail />
            {isAuthPage ? (
                children
            ) : (
                <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
                    <TrainerSidebar />
                    <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-0" />
                        <div className="relative z-10 min-h-full p-2">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </ThemeProvider>
    );
}
