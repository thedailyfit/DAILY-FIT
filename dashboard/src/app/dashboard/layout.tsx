import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#e6e6e6] text-black overflow-hidden selection:bg-[#cbfe00] selection:text-black">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                {/* Subtle gradient only at very top for depth */}
                <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-0" />
                <div className="relative z-10 min-h-full p-2">
                    {children}
                </div>
                {/* Deployment Version Indicator - To Prove Updates to User */}
                <div className="fixed bottom-4 right-4 bg-[#CCFF00] text-black px-3 py-1 rounded-full text-xs font-bold pointer-events-none z-50 opacity-50">
                    v2.1 LIVE
                </div>
            </div>
        </div>
    );
}
