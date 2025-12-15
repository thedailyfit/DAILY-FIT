"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistoryTable = PaymentHistoryTable;
const table_1 = require("@/components/ui/table");
const badge_1 = require("@/components/ui/badge");
const date_fns_1 = require("date-fns");
function PaymentHistoryTable({ payments }) {
    if (payments.length === 0) {
        return (<div className="text-center py-8 text-sm text-muted-foreground border rounded-md border-dashed">
                No payment history found.
            </div>);
    }
    return (<div className="rounded-md border">
            <table_1.Table>
                <table_1.TableHeader>
                    <table_1.TableRow>
                        <table_1.TableHead>Date</table_1.TableHead>
                        <table_1.TableHead>Amount</table_1.TableHead>
                        <table_1.TableHead>Method</table_1.TableHead>
                        <table_1.TableHead>Status</table_1.TableHead>
                        <table_1.TableHead className="text-right">Notes</table_1.TableHead>
                    </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                    {payments.map((payment) => (<table_1.TableRow key={payment.id}>
                            <table_1.TableCell>{(0, date_fns_1.format)(new Date(payment.payment_date), "MMM d, yyyy")}</table_1.TableCell>
                            <table_1.TableCell className="font-medium">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                            </table_1.TableCell>
                            <table_1.TableCell className="capitalize">{payment.payment_method.replace('_', ' ')}</table_1.TableCell>
                            <table_1.TableCell>
                                <badge_1.Badge variant="outline" className={payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                payment.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'}>
                                    {payment.status}
                                </badge_1.Badge>
                            </table_1.TableCell>
                            <table_1.TableCell className="text-right text-muted-foreground text-xs max-w-[200px] truncate">
                                {payment.notes || "-"}
                            </table_1.TableCell>
                        </table_1.TableRow>))}
                </table_1.TableBody>
            </table_1.Table>
        </div>);
}
