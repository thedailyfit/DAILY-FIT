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
exports.RecordPaymentDialog = RecordPaymentDialog;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const textarea_1 = require("@/components/ui/textarea");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    method: z.enum(["cash", "upi", "bank_transfer", "card", "other"]),
    notes: z.string().optional(),
});
function RecordPaymentDialog({ clientId }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            amount: "",
            date: new Date().toISOString().split('T')[0],
            method: "upi",
            notes: "",
        },
    });
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = yield supabase
                    .from('client_payments')
                    .insert({
                    client_id: clientId,
                    amount: parseFloat(values.amount),
                    payment_date: values.date,
                    payment_method: values.method,
                    notes: values.notes || null,
                    status: 'completed', // Default to completed for manual entry
                });
                if (error) {
                    throw error;
                }
                setOpen(false);
                form.reset();
                router.refresh();
            }
            catch (error) {
                console.error("Error recording payment:", error);
                alert("Failed to record payment. Please try again.");
            }
        });
    }
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button size="sm">
                    <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                    Record Payment
                </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Record Payment</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Manually log a payment received from the client.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form_1.Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <form_1.FormField control={form.control} name="amount" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>Amount (INR)</form_1.FormLabel>
                                        <form_1.FormControl>
                                            <input_1.Input type="number" placeholder="e.g. 5000" {...field}/>
                                        </form_1.FormControl>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                            <form_1.FormField control={form.control} name="date" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>Date</form_1.FormLabel>
                                        <form_1.FormControl>
                                            <input_1.Input type="date" {...field}/>
                                        </form_1.FormControl>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                        </div>

                        <form_1.FormField control={form.control} name="method" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Payment Method</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger>
                                                <select_1.SelectValue placeholder="Select method"/>
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent>
                                            <select_1.SelectItem value="upi">UPI</select_1.SelectItem>
                                            <select_1.SelectItem value="cash">Cash</select_1.SelectItem>
                                            <select_1.SelectItem value="bank_transfer">Bank Transfer</select_1.SelectItem>
                                            <select_1.SelectItem value="card">Card</select_1.SelectItem>
                                            <select_1.SelectItem value="other">Other</select_1.SelectItem>
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>

                        <form_1.FormField control={form.control} name="notes" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Notes (Optional)</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <textarea_1.Textarea placeholder="Transaction ID, etc." {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <dialog_1.DialogFooter>
                            <button_1.Button type="submit">Save Payment</button_1.Button>
                        </dialog_1.DialogFooter>
                    </form>
                </form_1.Form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
