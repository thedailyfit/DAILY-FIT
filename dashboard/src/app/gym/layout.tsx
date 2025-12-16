import { GymSidebar } from "@/components/gym/gym-sidebar";

export default function GymLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <GymSidebar />
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
