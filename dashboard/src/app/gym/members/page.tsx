import { GymMembersTable } from "@/components/gym/members-table";
import { AddGymMemberDialog } from "@/components/gym/add-member-dialog";
import { ImportClientsDialog } from "@/components/clients/import-clients-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function GymMembersPage() {
    const supabase = createClient();

    // Fetch members sorted by newest
    // Filter out "trainers" possibly? Or just take all members.
    // Assuming 'members' table holds all app users (clients/members).
    // If we distinguish, we might check a 'role' or 'type' column, 
    // but schema seems flat for now. Use all members.

    const { data: members, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching members:", error);
    }

    // Map to GymMember type (adding placeholder for missing fields if needed)
    const gymMembers = (members || []).map((m: any) => ({
        ...m,
        id: m.member_id,
        phone: m.whatsapp_id || m.phone_number || "",
        // Ensure optional fields are handled in Table or map here
        status: m.status || 'Active',
        planName: 'N/A', // Required by Client type base
        nextPaymentDate: null,
        lastActive: null
    }));

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Gym Directory</h1>
                    <p className="text-muted-foreground font-medium">Manage memberships and access.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <ImportClientsDialog />
                    <AddGymMemberDialog />
                </div>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, phone or area..."
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-muted-foreground"
                />
            </div>

            <GymMembersTable members={gymMembers} />
        </div>
    );
}
