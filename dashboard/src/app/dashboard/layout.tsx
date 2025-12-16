import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto bg-slate-50/50">
                {children}
            </div>
        </div>
    );
}
