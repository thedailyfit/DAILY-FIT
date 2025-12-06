import { Metadata } from "next";
import { SupportTicketsTable } from "@/components/support/support-tickets-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/types/support";
import { MessageSquarePlus } from "lucide-react";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Support | DailyFit Trainer Dashboard",
};

async function getSupportTickets(): Promise<SupportTicket[]> {
    // TODO: Replace with real Supabase query from support_view
    // const { data } = await supabase.from("support_view").select("*");

    return [
        {
            id: "t1",
            ticket_id: "t1",
            trainer_id: "tr1",
            client_id: "c1",
            client_name: "Akhil",
            subject: "App crashing on login",
            category: "technical",
            status: "open",
            priority: "high",
            created_at: "2025-12-04T10:00:00Z",
            updated_at: "2025-12-04T10:00:00Z",
        },
        {
            id: "t2",
            ticket_id: "t2",
            trainer_id: "tr1",
            client_id: "c2",
            client_name: "Karthik",
            subject: "Billing question",
            category: "billing",
            status: "resolved",
            priority: "normal",
            created_at: "2025-11-20T10:00:00Z",
            updated_at: "2025-11-22T10:00:00Z",
            resolved_at: "2025-11-22T10:00:00Z",
        },
        {
            id: "t3",
            ticket_id: "t3",
            trainer_id: "tr1",
            client_id: null,
            client_name: null,
            subject: "Feature request: Dark mode",
            category: "feature_request",
            status: "in_progress",
            priority: "low",
            created_at: "2025-12-01T10:00:00Z",
            updated_at: "2025-12-02T10:00:00Z",
        },
    ];
}

export default async function SupportPage() {
    const tickets = await getSupportTickets();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Support
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage client inquiries and technical support tickets.
                    </p>
                </div>
                <Button size="sm">
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    Create Ticket
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Ticket History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SupportTicketsTable tickets={tickets} />
                </CardContent>
            </Card>
        </div>
    );
}
