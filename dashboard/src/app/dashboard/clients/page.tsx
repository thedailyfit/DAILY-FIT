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

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Clients
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage all your personal training clients in one place.
                    </p>
                </div>
                <AddClientDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Client Directory
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ClientsTable clients={clients} />
                </CardContent>
            </Card>
        </div>
    );
}
