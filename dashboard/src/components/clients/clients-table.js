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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsTable = ClientsTable;
const React = __importStar(require("react"));
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const select_1 = require("@/components/ui/select");
const table_1 = require("@/components/ui/table");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const link_1 = __importDefault(require("next/link"));
const statusColorMap = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Paused: "bg-amber-100 text-amber-800 border-amber-200",
    Trial: "bg-sky-100 text-sky-800 border-sky-200",
    Inactive: "bg-slate-100 text-slate-700 border-slate-200",
};
function ClientsTable({ clients }) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [paymentFilter, setPaymentFilter] = React.useState("all");
    const filteredClients = React.useMemo(() => {
        return clients.filter((client) => {
            const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.phone.toLowerCase().includes(search.toLowerCase()) ||
                client.planName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" ? true : client.status === statusFilter;
            // Payment filter is placeholder for now; implement when you have real payment status
            const matchesPayment = paymentFilter === "all" ? true : true;
            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [clients, search, statusFilter, paymentFilter]);
    function formatDate(dateStr) {
        if (!dateStr)
            return "-";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime()))
            return "-";
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    function formatLastActive(dateStr) {
        if (!dateStr)
            return "-";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime()))
            return "-";
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    return (<div className="space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <input_1.Input placeholder="Search by name, phone, or plan..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm"/>
                </div>

                <div className="flex items-center gap-2">
                    <select_1.Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                        <select_1.SelectTrigger className="w-[150px]">
                            <select_1.SelectValue placeholder="Status"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                            <select_1.SelectItem value="Active">Active</select_1.SelectItem>
                            <select_1.SelectItem value="Trial">Trial</select_1.SelectItem>
                            <select_1.SelectItem value="Paused">Paused</select_1.SelectItem>
                            <select_1.SelectItem value="Inactive">Inactive</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>

                    <select_1.Select value={paymentFilter} onValueChange={(val) => setPaymentFilter(val)}>
                        <select_1.SelectTrigger className="w-[150px]">
                            <select_1.SelectValue placeholder="Payment"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Payments</select_1.SelectItem>
                            <select_1.SelectItem value="paid">Paid</select_1.SelectItem>
                            <select_1.SelectItem value="due">Due</select_1.SelectItem>
                            <select_1.SelectItem value="overdue">Overdue</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table_1.Table>
                    <table_1.TableHeader>
                        <table_1.TableRow>
                            <table_1.TableHead className="w-[180px]">Name</table_1.TableHead>
                            <table_1.TableHead>Status</table_1.TableHead>
                            <table_1.TableHead>WhatsApp</table_1.TableHead>
                            <table_1.TableHead>Plan Assigned</table_1.TableHead>
                            <table_1.TableHead>Next Payment</table_1.TableHead>
                            <table_1.TableHead>Last Active</table_1.TableHead>
                            <table_1.TableHead className="w-[72px] text-right">Actions</table_1.TableHead>
                        </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {filteredClients.length === 0 ? (<table_1.TableRow>
                                <table_1.TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No clients found. Try adjusting your filters or search.
                                </table_1.TableCell>
                            </table_1.TableRow>) : (filteredClients.map((client) => (<table_1.TableRow key={client.id} className="hover:bg-muted/40">
                                    <table_1.TableCell className="font-medium">
                                        {client.name}
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <badge_1.Badge variant="outline" className={statusColorMap[client.status] || statusColorMap.Active}>
                                            {client.status}
                                        </badge_1.Badge>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <div className="flex items-center gap-1">
                                            <button_1.Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                <a href={`https://wa.me/${client.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                                                    <lucide_react_1.PhoneCall className="h-3.5 w-3.5"/>
                                                </a>
                                            </button_1.Button>
                                            <span className="text-xs text-muted-foreground">
                                                {client.phone}
                                            </span>
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <div className="flex items-center gap-2">
                                            {client.planName !== "No Plan Assigned" ? (<badge_1.Badge variant="secondary" className="font-normal truncate max-w-[200px]" title={client.planName}>
                                                    {client.planName}
                                                </badge_1.Badge>) : (<span className="text-xs text-muted-foreground italic">
                                                    No Plan Assigned
                                                </span>)}
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <span className="text-xs">
                                            {formatDate(client.nextPaymentDate)}
                                        </span>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <span className="text-xs">
                                            {formatLastActive(client.lastActive)}
                                        </span>
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
                                                <dropdown_menu_1.DropdownMenuItem asChild>
                                                    <link_1.default href={`/dashboard/clients/${client.id}`}>View Profile</link_1.default>
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                // TODO: Mark as inactive via API
                console.log("Mark inactive", client.id);
            }}>
                                                    Mark as Inactive
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem className="text-destructive" onClick={() => {
                // TODO: Remove client with confirmation
                console.log("Remove client", client.id);
            }}>
                                                    Remove Client
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
