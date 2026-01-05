"use client";

import { AddExpenseDialog } from "@/components/gym/add-expense-dialog";
import { ExpensesTable } from "@/components/gym/expenses-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wrench, Droplets, Zap } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn, AnimatedList } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Mock Data
const expenses = [
    { id: "1", category: "Rent", amount: 2500, date: "2024-12-01", is_recurring: true, notes: "December Rent" },
    { id: "2", category: "Electricity", amount: 450, date: "2024-12-05", is_recurring: true, notes: "Peak usage" },
    { id: "3", category: "Equipment", amount: 120, date: "2024-12-10", is_recurring: false, notes: "Treadmill Limit Switch" },
    { id: "4", category: "Cleaning", amount: 300, date: "2024-12-15", is_recurring: true, notes: "Weekly Deep Clean" },
];

export default function MaintenancePage() {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <AnimatedPage>
            <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase text-foreground">Maintenance Ops</h2>
                        <p className="text-muted-foreground">Track and optimize your facility costs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <AddExpenseDialog />
                    </div>
                </div>

                {/* Expense KPIs */}
                <AnimatedList className="grid gap-4 md:grid-cols-4">
                    <PopupCard delay={0.1} className="bg-primary text-primary-foreground shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-primary-foreground/70 uppercase tracking-wider">Total Expenses</span>
                            <DollarSign className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="text-3xl font-black">${totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-primary-foreground/70 font-bold mt-1">This month</p>
                    </PopupCard>

                    <PopupCard delay={0.2} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Recurring Fixed</span>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-3xl font-black text-foreground">$2,800</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">Rent + Cleaning</p>
                    </PopupCard>

                    <PopupCard delay={0.3} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Utilities</span>
                            <Zap className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-foreground">$450</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">Power & Internet</p>
                    </PopupCard>

                    <PopupCard delay={0.4} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Repairs</span>
                            <Droplets className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="text-3xl font-black text-foreground">$120</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">One-time fixes</p>
                    </PopupCard>
                </AnimatedList>

                {/* Expense Log Table */}
                <SlideIn direction="up" delay={0.3}>
                    <Card className="bg-card border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-foreground">Expense Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpensesTable expenses={expenses} />
                        </CardContent>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
