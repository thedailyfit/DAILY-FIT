"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Payment {
    id: string
    amount: number
    currency: string
    status: 'completed' | 'pending' | 'failed' | 'refunded'
    payment_date: string
    payment_method: string
    notes?: string
}

interface PaymentHistoryTableProps {
    payments: Payment[]
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
    if (payments.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-muted-foreground border rounded-md border-dashed">
                No payment history found.
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.payment_date), "MMM d, yyyy")}</TableCell>
                            <TableCell className="font-medium">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                            </TableCell>
                            <TableCell className="capitalize">{payment.payment_method.replace('_', ' ')}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={
                                    payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                        payment.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                }>
                                    {payment.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs max-w-[200px] truncate">
                                {payment.notes || "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
