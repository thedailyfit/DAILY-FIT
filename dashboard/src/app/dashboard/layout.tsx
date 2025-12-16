import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#09090B] overflow-hidden">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                {/* Global Background Gradient for 'Premium' feel */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-[#09090B] to-[#09090B] pointer-events-none z-0" />
                <div className="relative z-10 min-h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
