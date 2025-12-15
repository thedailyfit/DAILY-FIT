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
exports.PaymentsTable = PaymentsTable;
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
    paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    due: "bg-amber-100 text-amber-800 border-amber-200",
    overdue: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-slate-100 text-slate-700 border-slate-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};
const statusIconMap = {
    paid: <lucide_react_1.CheckCircle2 className="h-3 w-3 mr-1"/>,
    due: <lucide_react_1.Clock className="h-3 w-3 mr-1"/>,
    overdue: <lucide_react_1.AlertCircle className="h-3 w-3 mr-1"/>,
    refunded: null,
    cancelled: null,
};
function PaymentsTable({ payments }) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const filteredPayments = React.useMemo(() => {
        return payments.filter((payment) => {
            const matchesSearch = payment.client_name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" ? true : payment.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);
    function formatCurrency(amount, currency) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    }
    return (<div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input_1.Input placeholder="Search by client name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm"/>
                <div className="flex items-center gap-2">
                    <select_1.Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                        <select_1.SelectTrigger className="w-[150px]">
                            <select_1.SelectValue placeholder="Status"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                            <select_1.SelectItem value="paid">Paid</select_1.SelectItem>
                            <select_1.SelectItem value="due">Due</select_1.SelectItem>
                            <select_1.SelectItem value="overdue">Overdue</select_1.SelectItem>
                            <select_1.SelectItem value="refunded">Refunded</select_1.SelectItem>
                            <select_1.SelectItem value="cancelled">Cancelled</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table_1.Table>
                    <table_1.TableHeader>
                        <table_1.TableRow>
                            <table_1.TableHead>Client</table_1.TableHead>
                            <table_1.TableHead>Amount</table_1.TableHead>
                            <table_1.TableHead>Status</table_1.TableHead>
                            <table_1.TableHead>Due Date</table_1.TableHead>
                            <table_1.TableHead>Paid Date</table_1.TableHead>
                            <table_1.TableHead>Method</table_1.TableHead>
                            <table_1.TableHead className="w-[72px] text-right">Actions</table_1.TableHead>
                        </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {filteredPayments.length === 0 ? (<table_1.TableRow>
                                <table_1.TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No payments found.
                                </table_1.TableCell>
                            </table_1.TableRow>) : (filteredPayments.map((payment) => (<table_1.TableRow key={payment.id} className="hover:bg-muted/40">
                                    <table_1.TableCell className="font-medium">
                                        {payment.client_name}
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        {formatCurrency(payment.amount, payment.currency)}
                                        <div className="text-[10px] text-muted-foreground capitalize">
                                            {payment.billing_cycle.replace('_', ' ')}
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell>
                                        <badge_1.Badge variant="outline" className={`${statusColorMap[payment.status]} flex w-fit items-center`}>
                                            {statusIconMap[payment.status]}
                                            <span className="capitalize">{payment.status}</span>
                                        </badge_1.Badge>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        <div className="flex items-center text-muted-foreground">
                                            <lucide_react_1.CalendarIcon className="mr-1 h-3 w-3"/>
                                            {(0, date_fns_1.format)(new Date(payment.due_date), "MMM d, yyyy")}
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {payment.paid_at ? (<span className="text-muted-foreground">
                                                {(0, date_fns_1.format)(new Date(payment.paid_at), "MMM d, yyyy")}
                                            </span>) : (<span className="text-muted-foreground">-</span>)}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs capitalize">
                                        {payment.method || "-"}
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
                console.log("Mark as paid", payment.id);
            }}>
                                                    Mark as Paid
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                console.log("Send reminder", payment.id);
            }}>
                                                    Send Reminder
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                console.log("View details", payment.id);
            }}>
                                                    View Details
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
