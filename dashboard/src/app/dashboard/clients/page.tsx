import { Metadata } from "next";
import { ClientsTable } from "@/components/clients/clients-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { Client, ClientStatus } from "@/types/client";

export const metadata: Metadata = {
    title: "Clients | DailyFit Trainer Dashboard",
};

async function getClients(): Promise<Client[]> {
    const supabase = createClient();

    // Fetch members with their active plan assignments
    // We need to fetch members AND their active client_programs -> plan_programs
    const { data: members, error } = await supabase
        .from('members')
        .select(`
            *,
            client_programs:client_programs(
                program:plan_programs(name),
                is_current
            )
        `)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return (members || []).map((row: any) => {
        // Find the active program (should be only one current one usually, or we show the latest)
        // Filter for is_current = true
        const activePrograms = row.client_programs?.filter((cp: any) => cp.is_current === true);
        const planName = activePrograms && activePrograms.length > 0
            ? activePrograms[0].program?.name
            : "No Plan Assigned";

        return {
            id: row.member_id,
            name: row.name,
            status: (row.status && ['Active', 'Paused', 'Trial', 'Inactive'].includes(row.status))
                ? row.status as ClientStatus
                : 'Active',
            phone: row.whatsapp_id || row.phone_number || 'N/A',
            planName: planName,
            nextPaymentDate: null,
            lastActive: row.created_at || null,
        };
    });
}

async function getPlans() {
    const supabase = createClient();
    const { data: d } = await supabase.from('diet_plans').select('id, name').eq('is_active', true);
    const { data: w } = await supabase.from('workout_plans').select('id, name').eq('is_active', true);
    return {
        dPlans: d || [],
        wPlans: w || []
    };
}

export default async function ClientsPage() {
    const clients = await getClients();
    const { dPlans, wPlans } = await getPlans();

    return (
        <div className="flex flex-col gap-6 bg-[#e6e6e6] min-h-screen p-8 text-black">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-[#212121] uppercase tracking-tighter mb-2">
                        Clients
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        Manage your roster and track progress.
                    </p>
                </div>
                <AddClientDialog dietPlans={dPlans} workoutPlans={wPlans} />
            </div>

            <Card className="border-none shadow-xl bg-white rounded-[1.5rem] overflow-hidden">
                <CardHeader className="bg-[#212121] text-white p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        Client Directory
                        <span className="flex h-2 w-2 rounded-full bg-[#cbfe00] animate-pulse"></span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ClientsTable clients={clients} />
                </CardContent>
            </Card>
        </div>
    );
}
