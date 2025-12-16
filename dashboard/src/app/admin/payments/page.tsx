import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Download, Filter } from "lucide-react";

export default function AdminPaymentsPage() {
    // Mock Data: In real app, fetch from 'payments' via Supabase
    const transactions = [
        { id: "INV-001", date: "2025-12-15", gym: "Gold's Gym Metro", amount: "$99.00", type: "Subscription", status: "Paid" },
        { id: "INV-002", date: "2025-12-14", gym: "FitBit Studio", amount: "$99.00", type: "Subscription", status: "Paid" },
        { id: "TXN-882", date: "2025-12-14", gym: "Iron Pumpers", amount: "$4.99", type: "Transaction Fee", status: "Paid" },
        { id: "INV-003", date: "2025-12-12", gym: "Iron Pumpers", amount: "$99.00", type: "Subscription", status: "Failed" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Global Revenue</h1>
                        <p className="text-slate-500">Track all subscription and transaction income.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        <Button><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                    </div>
                </header>

                {/* Financial Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue (MRR)</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,450</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Income (This Month)</CardTitle>
                            <DollarSign className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$8,230</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                            <DollarSign className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">$198.00</div>
                            <p className="text-xs text-muted-foreground">Action required</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Gym / Source</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Invoice</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>{t.date}</TableCell>
                                        <TableCell className="font-medium">{t.gym}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {t.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>{t.amount}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${t.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
