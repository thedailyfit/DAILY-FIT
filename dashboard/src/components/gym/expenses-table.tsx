"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Expense {
    id: string;
    category: string;
    amount: number;
    date: string;
    notes?: string;
    is_recurring?: boolean;
}

interface ExpensesTableProps {
    expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
    return (
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Category</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Amount</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Date</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Type</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Notes</TableHead>
                        <TableHead className="text-right font-bold text-zinc-500 uppercase text-xs">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                No expenses logged this month.
                            </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map((e) => (
                            <TableRow key={e.id} className="hover:bg-zinc-50">
                                <TableCell>
                                    <div className="font-bold text-slate-900">{e.category}</div>
                                </TableCell>
                                <TableCell className="font-medium text-red-600">
                                    -${e.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-zinc-600 text-xs">
                                    {e.date}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        e.is_recurring
                                            ? "border-blue-200 text-blue-700 bg-blue-50"
                                            : "border-zinc-200 text-zinc-500"
                                    }>
                                        {e.is_recurring ? 'Recurring' : 'One-time'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-500 text-xs italic">
                                    {e.notes || '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
