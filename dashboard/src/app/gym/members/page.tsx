import { createClient } from "@/lib/supabase";
import { MembersView } from "./members-view";

export default async function GymMembersPage() {
    const supabase = createClient();

    const { data: members, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

    const { data: staff } = await supabase
        .from('staff')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching members:", error);
    }

    const gymMembers = (members || []).map((m: any) => {
        // nextPaymentDate: created_at + 30 days
        let nextPaymentDate = null;
        if (m.created_at) {
            const date = new Date(m.created_at);
            date.setDate(date.getDate() + 30);
            nextPaymentDate = date.toISOString();
        }

        return {
            ...m,
            id: m.member_id,
            phone: m.whatsapp_id || m.phone_number || "",
            status: m.status || 'Active',
            planName: 'N/A',
            nextPaymentDate,
            lastActive: m.updated_at || null,
        };
    });

    return (
        <MembersView 
            members={gymMembers} 
            trainers={staff || []}
        />
    );
}
