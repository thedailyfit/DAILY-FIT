import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-[#CCFF00] selection:text-black">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                {/* Subtle gradient only at very top for depth */}
                <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#111] to-transparent pointer-events-none z-0" />
                <div className="relative z-10 min-h-full p-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
