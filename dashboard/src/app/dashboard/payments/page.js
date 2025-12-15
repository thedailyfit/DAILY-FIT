"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = PaymentsPage;
const payments_table_1 = require("@/components/payments/payments-table");
const add_payment_dialog_1 = require("@/components/payments/add-payment-dialog");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const supabase_1 = require("@/lib/supabase");
exports.metadata = {
    title: "Payments | DailyFit Trainer Dashboard",
};
function getPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        const { data: payments, error } = yield supabase
            .from("payments")
            .select(`
            *,
            member:members (
                name
            )
        `)
            .order("due_date", { ascending: false });
        if (error) {
            console.error("Error fetching payments:", error);
            return [];
        }
        return (payments || []).map((p) => {
            var _a;
            return (Object.assign(Object.assign({}, p), { client_name: ((_a = p.member) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Client', client_id: p.member_id // Ensure mapping
             }));
        });
    });
}
function PaymentsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const payments = yield getPayments();
        // Calculate stats
        const totalRevenue = payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = payments
            .filter(p => p.status === 'due' || p.status === 'overdue')
            .reduce((sum, p) => sum + p.amount, 0);
        const activeClients = new Set(payments.map(p => p.client_id)).size;
        return (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Payments
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track your revenue, manage invoices, and handle client billing.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button_1.Button variant="outline" size="sm">
                        Export CSV
                    </button_1.Button>
                    <add_payment_dialog_1.AddPaymentDialog />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Total Revenue (This Month)
                        </card_1.CardTitle>
                        <lucide_react_1.IndianRupee className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Pending & Overdue
                        </card_1.CardTitle>
                        <lucide_react_1.AlertCircle className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold text-amber-600">₹{pendingAmount.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">
                            {payments.filter(p => p.status === 'overdue').length} overdue invoices
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Active Paying Clients
                        </card_1.CardTitle>
                        <lucide_react_1.Users className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">{activeClients}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all plans
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-base">
                        Transaction History
                    </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <payments_table_1.PaymentsTable payments={payments}/>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
