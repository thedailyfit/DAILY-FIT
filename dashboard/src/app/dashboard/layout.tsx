import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
                <TrainerSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                    {/* Subtle gradient only at very top for depth - responsive to theme */}
                    <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-0" />
                    <div className="relative z-10 min-h-full p-2">
                        {children}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
