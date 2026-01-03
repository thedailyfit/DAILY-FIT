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
import { Copy, Clock, DollarSign } from "lucide-react";

interface Trainer {
    id: string;
    name: string;
    email: string;
    phone: string;
    shift_start?: string;
    shift_end?: string;
    salary?: number;
    status: string;
    performance_code: string;
}

interface TrainersTableProps {
    trainers: Trainer[];
}

export function TrainersTable({ trainers }: TrainersTableProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    return (
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Trainer</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Shift</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Salary</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Performance Code</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Status</TableHead>
                        <TableHead className="text-right font-bold text-zinc-500 uppercase text-xs">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trainers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No trainers found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        trainers.map((t) => (
                            <TableRow key={t.id} className="hover:bg-zinc-50">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{t.name}</span>
                                        <span className="text-xs text-slate-500">{t.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded w-fit">
                                        <Clock className="w-3 h-3" />
                                        {t.shift_start || '--'} - {t.shift_end || '--'}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-emerald-600">
                                    {t.salary ? `$${t.salary.toLocaleString()}` : '-'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-black text-[#cbfe00] px-2 py-1 rounded text-xs font-mono">
                                            {t.performance_code || 'N/A'}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(t.performance_code)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        t.status === 'Active'
                                            ? "border-green-200 text-green-700 bg-green-50"
                                            : "border-zinc-200 text-zinc-500"
                                    }>
                                        {t.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
