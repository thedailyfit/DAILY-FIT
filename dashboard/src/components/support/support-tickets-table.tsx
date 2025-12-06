"use client";

import * as React from "react";
import { SupportTicket, SupportTicketStatus, SupportTicketPriority } from "@/types/support";
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
import { MoreHorizontal, AlertCircle, CheckCircle2, Clock, HelpCircle } from "lucide-react";
import { format } from "date-fns";

type SupportTicketsTableProps = {
    tickets: SupportTicket[];
};

const statusColorMap: Record<SupportTicketStatus, string> = {
    open: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    closed: "bg-slate-100 text-slate-700 border-slate-200",
};

const priorityColorMap: Record<SupportTicketPriority, string> = {
    low: "text-slate-500",
    normal: "text-blue-500",
    high: "text-amber-500 font-medium",
    urgent: "text-red-500 font-bold",
};

export function SupportTicketsTable({ tickets }: SupportTicketsTableProps) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"all" | SupportTicketStatus>("all");

    const filteredTickets = React.useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesSearch =
                ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
                (ticket.client_name || "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ? true : ticket.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tickets, search, statusFilter]);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Input
                    placeholder="Search by subject or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => setStatusFilter(val as "all" | SupportTicketStatus)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id} className="hover:bg-muted/40">
                                    <TableCell className="font-medium">
                                        {ticket.subject}
                                    </TableCell>
                                    <TableCell>
                                        {ticket.client_name || <span className="text-muted-foreground">-</span>}
                                    </TableCell>
                                    <TableCell className="capitalize text-muted-foreground">
                                        {ticket.category.replace('_', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`${statusColorMap[ticket.status]} capitalize`}
                                        >
                                            {ticket.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`${priorityColorMap[ticket.priority]} capitalize flex items-center gap-1`}>
                                            {ticket.priority === 'urgent' && <AlertCircle className="h-3 w-3" />}
                                            {ticket.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
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
                                                        console.log("View ticket", ticket.id);
                                                    }}
                                                >
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        console.log("Update status", ticket.id);
                                                    }}
                                                >
                                                    Update Status
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
