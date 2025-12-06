"use client";

import * as React from "react";
import { Payment, PaymentStatus } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CalendarIcon, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

type PaymentsTableProps = {
    payments: Payment[];
};

const statusColorMap: Record<PaymentStatus, string> = {
    paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    due: "bg-amber-100 text-amber-800 border-amber-200",
    overdue: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-slate-100 text-slate-700 border-slate-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusIconMap: Record<PaymentStatus, React.ReactNode> = {
    paid: <CheckCircle2 className="h-3 w-3 mr-1" />,
    due: <Clock className="h-3 w-3 mr-1" />,
    overdue: <AlertCircle className="h-3 w-3 mr-1" />,
    refunded: null,
    cancelled: null,
};

export function PaymentsTable({ payments }: PaymentsTableProps) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"all" | PaymentStatus>("all");

    const filteredPayments = React.useMemo(() => {
        return payments.filter((payment) => {
            const matchesSearch =
                payment.client_name.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ? true : payment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);

    function formatCurrency(amount: number, currency: string) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Input
                    placeholder="Search by client name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => setStatusFilter(val as "all" | PaymentStatus)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="due">Due</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-muted/40">
                                    <TableCell className="font-medium">
                                        {payment.client_name}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(payment.amount, payment.currency)}
                                        <div className="text-[10px] text-muted-foreground capitalize">
                                            {payment.billing_cycle.replace('_', ' ')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`${statusColorMap[payment.status]} flex w-fit items-center`}
                                        >
                                            {statusIconMap[payment.status]}
                                            <span className="capitalize">{payment.status}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        <div className="flex items-center text-muted-foreground">
                                            <CalendarIcon className="mr-1 h-3 w-3" />
                                            {format(new Date(payment.due_date), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {payment.paid_at ? (
                                            <span className="text-muted-foreground">
                                                {format(new Date(payment.paid_at), "MMM d, yyyy")}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs capitalize">
                                        {payment.method || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        console.log("Mark as paid", payment.id);
                                                    }}
                                                >
                                                    Mark as Paid
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        console.log("Send reminder", payment.id);
                                                    }}
                                                >
                                                    Send Reminder
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        console.log("View details", payment.id);
                                                    }}
                                                >
                                                    View Details
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
