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

    // Fetch from the new clients_view which joins clients, programs, and payments
    const { data, error } = await supabase
        .from('clients_view')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return (data || []).map((row: any) => ({
        id: row.client_id,
        name: row.name,
        status: (row.status && ['Active', 'Paused', 'Trial', 'Inactive'].includes(row.status))
            ? row.status as ClientStatus
            : 'Active',
        phone: row.phone,
        planName: row.plan_name || "No Plan Assigned",
        nextPaymentDate: row.next_payment_date || null,
        lastActive: row.last_active_at || null,
    }));
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
