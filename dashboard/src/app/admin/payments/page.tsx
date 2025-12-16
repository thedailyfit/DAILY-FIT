"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, CreditCard, Wallet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
    const transactions = [
        { id: "TXN-001", gym: "Iron Pump", amount: "₹24,999", plan: "Standard Gym Plan", date: "2024-12-15", status: "Success" },
        { id: "TXN-002", gym: "Urban Fit", amount: "₹45,000", plan: "Premium Gym Plan", date: "2024-12-14", status: "Success" },
        { id: "TXN-003", gym: "Flex Studio", amount: "₹12,499", plan: "Starter Gym Plan", date: "2024-12-14", status: "Pending" },
        { id: "TXN-004", gym: "Iron Pump", amount: "₹4,999", plan: "Add-on: Protein Bulk", date: "2024-12-13", status: "Success" },
    ];

    return (
        <main className="p-8 space-y-8 bg-slate-50 min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Revenue & Billing</h1>
                    <p className="text-slate-500">Track all SaaS subscriptions and B2B product sales (INR).</p>
                </div>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total MRR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">₹4,25,000</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +15.2% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-100">Net Revenue (YTD)</CardTitle>
                        <Wallet className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹48,50,000</div>
                        <p className="text-xs text-indigo-200 mt-1">
                            Total processed this year
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Payouts</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">₹82,400</div>
                        <p className="text-xs text-slate-400 mt-1">
                            Scheduled for next Monday
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Transactions Table */}
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Real-time feed of incoming payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Gym / Client</TableHead>
                                    <TableHead>Plan / Item</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{t.gym}</TableCell>
                                        <TableCell className="text-slate-500 text-sm">{t.plan}</TableCell>
                                        <TableCell className="font-bold">{t.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={t.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                                {t.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Plans Section */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue by Plan</CardTitle>
                        <CardDescription>Best selling tiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Premium Gym Plan</span>
                                <span>₹2,50,000</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full w-[65%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Standard Plan</span>
                                <span>₹1,20,000</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full w-[35%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Add-on Products</span>
                                <span>₹55,000</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-[15%]"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
