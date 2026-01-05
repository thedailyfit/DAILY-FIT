import { AddExpenseDialog } from "@/components/gym/add-expense-dialog";
import { ExpensesTable } from "@/components/gym/expenses-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wrench, Droplets, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Maintenance & Expenses | DailyFit Gym Admin",
    description: "Track gym operational costs.",
};

async function getExpenses() {
    // Simulator for Supabase Fetch
    // In real app: const { data } = await supabase.from('gym_expenses').select('*');
    return [
        { id: "1", category: "Rent", amount: 2500, date: "2024-12-01", is_recurring: true, notes: "December Rent" },
        { id: "2", category: "Electricity", amount: 450, date: "2024-12-05", is_recurring: true, notes: "Peak usage" },
        { id: "3", category: "Equipment", amount: 120, date: "2024-12-10", is_recurring: false, notes: "Treadmill Limit Switch" },
        { id: "4", category: "Cleaning", amount: 300, date: "2024-12-15", is_recurring: true, notes: "Weekly Deep Clean" },
    ];
}

export default async function MaintenancePage() {
    const expenses = await getExpenses();
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 bg-[#e6e6e6] min-h-screen text-black">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase text-[#212121]">Maintenance Ops</h2>
                    <p className="text-zinc-500">Track and optimize your facility costs.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddExpenseDialog />
                </div>
            </div>

            {/* Expense KPIs */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[#212121] border-none shadow-xl text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Expenses</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">${totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-zinc-500 mt-1">This month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Recurring Fixed</CardTitle>
                        <Wrench className="h-4 w-4 text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#212121]">$2,800</div>
                        <p className="text-xs text-zinc-400 mt-1">Rent + Cleaning</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Utilities</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#212121]">$450</div>
                        <p className="text-xs text-zinc-400 mt-1">Power & Internet</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Repairs</CardTitle>
                        <Droplets className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#212121]">$120</div>
                        <p className="text-xs text-zinc-400 mt-1">One-time fixes</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-[#212121]">Expense Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExpensesTable expenses={expenses} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
