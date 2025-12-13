import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Client Requests | DailyFit Trainer Dashboard",
};

async function getRequests() {
    const supabase = createClient();

    // We'll join with members to get client names
    // Note: Assuming 'member_id' in client_requests matches 'member_id' in members
    const { data: requests, error } = await supabase
        .from("client_requests")
        .select(`
            *,
            member:members (
                name,
                whatsapp_id
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching requests:", error);
        return [];
    }

    return requests;
}

export default async function RequestsPage() {
    const requests = await getRequests();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Client Requests</h1>
                    <p className="text-muted-foreground">Manage incoming requests from clients</p>
                </div>
            </div>

            <div className="grid gap-4">
                {requests && requests.length > 0 ? (
                    requests.map((request: any) => (
                        <Card key={request.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-medium">
                                        {request.title || "Untitled Request"}
                                    </CardTitle>
                                    <CardDescription>
                                        From: {request.member?.name || "Unknown Client"} ({request.member?.whatsapp_id || "N/A"})
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                                        {request.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                    {request.content}
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    {/* Placeholder buttons for actions */}
                                    <Button size="sm" variant="outline">Mark as Resolved</Button>
                                    <Button size="sm">Reply via WhatsApp</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">No pending requests</p>
                            <p className="text-sm text-muted-foreground">Client requests will appear here</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
