"use client";

import * as React from "react";
import { Client, ClientStatus } from "@/types/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PhoneCall } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type PaymentFilter = "all" | "paid" | "due" | "overdue"; // placeholder for future use

type ClientsTableProps = {
    clients: Client[];
};

const statusColorMap: Record<ClientStatus, string> = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Paused: "bg-amber-100 text-amber-800 border-amber-200",
    Trial: "bg-sky-100 text-sky-800 border-sky-200",
    Inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

export function ClientsTable({ clients }: ClientsTableProps) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"all" | ClientStatus>("all");
    const [paymentFilter, setPaymentFilter] = React.useState<PaymentFilter>("all");

    const filteredClients = React.useMemo(() => {
        return clients.filter((client) => {
            const matchesSearch =
                client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.phone.toLowerCase().includes(search.toLowerCase()) ||
                client.planName.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ? true : client.status === statusFilter;

            // Payment filter is placeholder for now; implement when you have real payment status
            const matchesPayment =
                paymentFilter === "all" ? true : true;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [clients, search, statusFilter, paymentFilter]);

    function formatDate(dateStr: string | null) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function formatLastActive(dateStr: string | null) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search by name, phone, or plan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) =>
                            setStatusFilter(val as "all" | ClientStatus)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Trial">Trial</SelectItem>
                            <SelectItem value="Paused">Paused</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={paymentFilter}
                        onValueChange={(val) =>
                            setPaymentFilter(val as PaymentFilter)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Payment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="due">Due</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Plan Assigned</TableHead>
                            <TableHead>Next Payment</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No clients found. Try adjusting your filters or search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-muted/40">
                                    <TableCell className="font-medium">
                                        {client.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={statusColorMap[client.status] || statusColorMap.Active}
                                        >
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                asChild
                                            >
                                                <a href={`https://wa.me/${client.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                                                    <PhoneCall className="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                            <span className="text-xs text-muted-foreground">
                                                {client.phone}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {client.planName !== "No Plan Assigned" ? (
                                                <Badge variant="secondary" className="font-normal truncate max-w-[200px]" title={client.planName}>
                                                    {client.planName}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">
                                                    No Plan Assigned
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs">
                                            {formatDate(client.nextPaymentDate)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs">
                                            {formatLastActive(client.lastActive)}
                                        </span>
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/clients/${client.id}`}>View Profile</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // TODO: Mark as inactive via API
                                                        console.log("Mark inactive", client.id);
                                                    }}
                                                >
                                                    Mark as Inactive
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => {
                                                        // TODO: Remove client with confirmation
                                                        console.log("Remove client", client.id);
                                                    }}
                                                >
                                                    Remove Client
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
