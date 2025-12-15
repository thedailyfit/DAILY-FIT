import { Metadata } from "next";
import { PaymentsTable } from "@/components/payments/payments-table";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types/payment";
import { IndianRupee, AlertCircle, Users, CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Payments | DailyFit Trainer Dashboard",
};

async function getPayments(): Promise<Payment[]> {
    const supabase = createClient();

    const { data: payments, error } = await supabase
        .from("payments")
        .select(`
            *,
            member:members (
                name
            )
        `)
        .order("due_date", { ascending: false });

    if (error) {
        console.error("Error fetching payments:", error);
        return [];
    }

    return (payments || []).map((p: any) => ({
        ...p,
        client_name: p.member?.name || 'Unknown Client',
        client_id: p.member_id // Ensure mapping
    }));
}

export default async function PaymentsPage() {
    const payments = await getPayments();

    // Calculate stats
    const totalRevenue = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = payments
        .filter(p => p.status === 'due' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

    const activeClients = new Set(payments.map(p => p.client_id)).size;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Payments
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track revenue, manage invoices, and handle subscriptions.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        Export CSV
                    </Button>
                    <AddPaymentDialog />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-card to-green-500/10 border-green-200/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Collected
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime revenue
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-card to-amber-500/10 border-amber-200/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending & Overdue
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">₹{pendingAmount.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            {payments.filter(p => p.status === 'overdue').length} invoices overdue
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-card to-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Paying Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeClients}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all plans
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Transaction History
                    </CardTitle>
                    <CardDescription>
                        Recent payments and invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentsTable payments={payments} />
                </CardContent>
            </Card>
        </div>
    );
}
