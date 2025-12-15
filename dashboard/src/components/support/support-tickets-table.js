"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketsTable = SupportTicketsTable;
const React = __importStar(require("react"));
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const table_1 = require("@/components/ui/table");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
const statusColorMap = {
    open: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    closed: "bg-slate-100 text-slate-700 border-slate-200",
};
const priorityColorMap = {
    low: "text-slate-500",
    normal: "text-blue-500",
    high: "text-amber-500 font-medium",
    urgent: "text-red-500 font-bold",
};
function SupportTicketsTable({ tickets }) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const filteredTickets = React.useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesSearch = ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
                (ticket.client_name || "").toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" ? true : ticket.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tickets, search, statusFilter]);
    return (<div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input_1.Input placeholder="Search by subject or client..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm"/>
                <div className="flex items-center gap-2">
                    <select_1.Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                        <select_1.SelectTrigger className="w-[150px]">
                            <select_1.SelectValue placeholder="Status"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                            <select_1.SelectItem value="open">Open</select_1.SelectItem>
                            <select_1.SelectItem value="in_progress">In Progress</select_1.SelectItem>
                            <select_1.SelectItem value="resolved">Resolved</select_1.SelectItem>
                            <select_1.SelectItem value="closed">Closed</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table_1.Table>
                    <table_1.TableHeader>
                        <table_1.TableRow>
                            <table_1.TableHead>Subject</table_1.TableHead>
                            <table_1.TableHead>Client</table_1.TableHead>
                            <table_1.TableHead>Category</table_1.TableHead>
                            <table_1.TableHead>Status</table_1.TableHead>
                            <table_1.TableHead>Priority</table_1.TableHead>
                            <table_1.TableHead>Created</table_1.TableHead>
                            <table_1.TableHead className="w-[72px] text-right">Actions</table_1.TableHead>
                        </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {filteredTickets.length === 0 ? (<table_1.TableRow>
                                <table_1.TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No tickets found.
                                </table_1.TableCell>
                            </table_1.TableRow>) : (filteredTickets.map((ticket) => (<table_1.TableRow key={ticket.id} className="hover:bg-muted/40">
                                    <table_1.TableCell className="font-medium">
                                        {ticket.subject}
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        {ticket.client_name || <span className="text-muted-foreground">-</span>}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="capitalize text-muted-foreground">
                                        {ticket.category.replace('_', ' ')}
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <badge_1.Badge variant="outline" className={`${statusColorMap[ticket.status]} capitalize`}>
                                            {ticket.status.replace('_', ' ')}
                                        </badge_1.Badge>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <span className={`${priorityColorMap[ticket.priority]} capitalize flex items-center gap-1`}>
                                            {ticket.priority === 'urgent' && <lucide_react_1.AlertCircle className="h-3 w-3"/>}
                                            {ticket.priority}
                                        </span>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs text-muted-foreground">
                                        {(0, date_fns_1.format)(new Date(ticket.created_at), "MMM d, yyyy")}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-right">
                                        <dropdown_menu_1.DropdownMenu>
                                            <dropdown_menu_1.DropdownMenuTrigger asChild>
                                                <button_1.Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">Open menu</span>
                                                </button_1.Button>
                                            </dropdown_menu_1.DropdownMenuTrigger>
                                            <dropdown_menu_1.DropdownMenuContent align="end">
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                console.log("View ticket", ticket.id);
            }}>
                                                    View Details
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                console.log("Update status", ticket.id);
            }}>
                                                    Update Status
                                                </dropdown_menu_1.DropdownMenuItem>
                                            </dropdown_menu_1.DropdownMenuContent>
                                        </dropdown_menu_1.DropdownMenu>
                                    </table_1.TableCell>
                                </table_1.TableRow>)))}
                    </table_1.TableBody>
                </table_1.Table>
            </div>
        </div>);
}
