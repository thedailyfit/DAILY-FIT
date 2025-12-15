"use strict";
"use client";
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
exports.AddPaymentDialog = AddPaymentDialog;
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
function AddPaymentDialog() {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [clients, setClients] = (0, react_1.useState)([]);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    // Form states
    const [clientId, setClientId] = (0, react_1.useState)("");
    const [amount, setAmount] = (0, react_1.useState)("");
    const [status, setStatus] = (0, react_1.useState)("paid");
    const [dueDate, setDueDate] = (0, react_1.useState)("");
    const [billingCycle, setBillingCycle] = (0, react_1.useState)("monthly");
    (0, react_1.useEffect)(() => {
        if (open) {
            fetchClients();
        }
    }, [open]);
    function fetchClients() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield supabase.from("members").select("member_id, name").eq("status", "Active");
            if (data)
                setClients(data);
        });
    }
    function handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            setLoading(true);
            try {
                const { error } = yield supabase.from("payments").insert({
                    member_id: clientId,
                    amount: parseFloat(amount),
                    status: status,
                    due_date: dueDate,
                    billing_cycle: billingCycle,
                    paid_at: status === 'paid' ? new Date().toISOString() : null,
                    created_at: new Date().toISOString()
                });
                if (error)
                    throw error;
                setOpen(false);
                router.refresh();
                // Reset form
                setClientId("");
                setAmount("");
            }
            catch (error) {
                console.error("Error creating payment:", error);
                alert("Failed to record payment");
            }
            finally {
                setLoading(false);
            }
        });
    }
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button size="sm">+ Record Payment</button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Record Payment</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Add a new payment record for a client.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="client">Client</label_1.Label>
                        <select_1.Select value={clientId} onValueChange={setClientId} required>
                            <select_1.SelectTrigger>
                                <select_1.SelectValue placeholder="Select client"/>
                            </select_1.SelectTrigger>
                            <select_1.SelectContent>
                                {clients.map((client) => (<select_1.SelectItem key={client.member_id} value={client.member_id}>
                                        {client.name}
                                    </select_1.SelectItem>))}
                            </select_1.SelectContent>
                        </select_1.Select>
                    </div>
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="amount">Amount (INR)</label_1.Label>
                        <input_1.Input id="amount" type="number" placeholder="e.g. 5000" value={amount} onChange={(e) => setAmount(e.target.value)} required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label_1.Label htmlFor="status">Status</label_1.Label>
                            <select_1.Select value={status} onValueChange={setStatus}>
                                <select_1.SelectTrigger>
                                    <select_1.SelectValue />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                    <select_1.SelectItem value="paid">Paid</select_1.SelectItem>
                                    <select_1.SelectItem value="due">Due</select_1.SelectItem>
                                    <select_1.SelectItem value="overdue">Overdue</select_1.SelectItem>
                                </select_1.SelectContent>
                            </select_1.Select>
                        </div>
                        <div className="grid gap-2">
                            <label_1.Label htmlFor="cycle">Billing Cycle</label_1.Label>
                            <select_1.Select value={billingCycle} onValueChange={setBillingCycle}>
                                <select_1.SelectTrigger>
                                    <select_1.SelectValue />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                    <select_1.SelectItem value="monthly">Monthly</select_1.SelectItem>
                                    <select_1.SelectItem value="package">Package</select_1.SelectItem>
                                </select_1.SelectContent>
                            </select_1.Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="dueDate">Due Date</label_1.Label>
                        <input_1.Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required/>
                    </div>
                    <dialog_1.DialogFooter>
                        <button_1.Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Payment"}
                        </button_1.Button>
                    </dialog_1.DialogFooter>
                </form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
