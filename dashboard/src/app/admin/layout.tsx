import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto">
                {children}
            </div>
        </div>
    );
}
