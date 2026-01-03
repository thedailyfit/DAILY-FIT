
import { PtClientsTable } from "@/components/gym/pt-clients-table";
import { ImportClientsDialog } from "@/components/clients/import-clients-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function PtClientsPage() {
    const supabase = createClient();

    // 1. Fetch Members (Potential PT Clients)
    const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

    if (membersError) console.error("Error fetching members:", membersError);

    // 2. Fetch Trainers
    // Assuming 'trainers' table exists or we query specific users. For now, try 'trainers'.
    const { data: trainersData, error: trainersError } = await supabase
        .from('trainers')
        .select('*');

    // Fallback if table doesn't exist
    const trainers = trainersData || [
        { id: 'mock1', name: 'Alice Trainer (Mock)' },
        { id: 'mock2', name: 'Bob Trainer (Mock)' }
    ];

    // 3. Fetch Plans
    const { data: dietPlans } = await supabase.from('diet_plans').select('id, name');
    const { data: workoutPlans } = await supabase.from('workout_plans').select('id, name');

    // Map to GymMember type
    const clients = (members || []).map((m: any) => ({
        ...m,
        id: m.member_id,
        phone: m.whatsapp_id || m.phone_number || "",
        status: m.status || 'Active',
        planName: 'N/A',
        nextPaymentDate: null,
        lastActive: null
    }));

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Personal Training</h1>
                    <p className="text-zinc-500 font-medium">Manage PT clients, assignments, and progress.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <ImportClientsDialog />
                    <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold h-10 px-6 shadow-lg shadow-[#cbfe00]/20 transition-all">
                        <UserPlus className="mr-2 h-4 w-4" /> Add PT Client
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                <Search className="h-4 w-4 text-zinc-400" />
                <Input
                    placeholder="Search PT clients..."
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-zinc-400"
                />
            </div>

            <PtClientsTable
                clients={clients}
                trainers={trainers}
                dietPlans={dietPlans || []}
                workoutPlans={workoutPlans || []}
            />
        </div>
    );
}
