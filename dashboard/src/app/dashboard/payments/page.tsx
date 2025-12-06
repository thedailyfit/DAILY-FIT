import { Metadata } from "next";
import { PaymentsTable } from "@/components/payments/payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types/payment";
import { IndianRupee, AlertCircle, Users } from "lucide-react";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Payments | DailyFit Trainer Dashboard",
};

async function getPayments(): Promise<Payment[]> {
    // TODO: Replace with real Supabase query
    // const { data } = await supabase.from("payments").select("*, clients(name)");

    return [
        {
            id: "p1",
            client_id: "c1",
            client_name: "Akhil",
            amount: 5000,
            currency: "INR",
            status: "paid",
            billing_cycle: "monthly",
            due_date: "2025-12-01",
            paid_at: "2025-12-01T10:00:00Z",
            method: "upi",
            created_at: "2025-11-01T10:00:00Z",
        },
        {
            id: "p2",
            client_id: "c2",
            client_name: "Karthik",
            amount: 12000,
            currency: "INR",
            status: "due",
            billing_cycle: "package",
            due_date: "2025-12-05",
            created_at: "2025-11-05T10:00:00Z",
        },
        {
            id: "p3",
            client_id: "c3",
            client_name: "Sneha",
            amount: 5000,
            currency: "INR",
            status: "overdue",
            billing_cycle: "monthly",
            due_date: "2025-11-28",
            created_at: "2025-10-28T10:00:00Z",
        },
        {
            id: "p4",
            client_id: "c4",
            client_name: "Rahul",
            amount: 5000,
            currency: "INR",
            status: "paid",
            billing_cycle: "monthly",
            due_date: "2025-12-03",
            paid_at: "2025-12-03T15:30:00Z",
            method: "cash",
            created_at: "2025-11-03T10:00:00Z",
        },
    ];
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Payments
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track your revenue, manage invoices, and handle client billing.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        Export CSV
                    </Button>
                    <Button size="sm">
                        + Record Payment
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue (This Month)
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending & Overdue
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">₹{pendingAmount.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            {payments.filter(p => p.status === 'overdue').length} overdue invoices
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Paying Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeClients}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all plans
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PaymentsTable payments={payments} />
                </CardContent>
            </Card>
        </div>
    );
}
