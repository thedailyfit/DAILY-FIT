"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"

interface Subscription {
    id: string
    plan_name: string
    amount: number
    currency: string
    billing_cycle: string
    start_date: string
    next_billing_date: string
    status: 'active' | 'paused' | 'cancelled' | 'expired'
}

interface SubscriptionCardProps {
    subscription?: Subscription | null
    onEdit?: () => void
}

export function SubscriptionCard({ subscription, onEdit }: SubscriptionCardProps) {
    if (!subscription) {
        return (
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Current Subscription</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="rounded-full bg-muted p-3 mb-3">
                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No Active Subscription</p>
                    <p className="text-xs text-muted-foreground mb-4">This client does not have an active plan.</p>
                    <Button size="sm" onClick={onEdit}>Add Subscription</Button>
                </CardContent>
            </Card>
        )
    }

    const isOverdue = new Date(subscription.next_billing_date) < new Date()
    const statusColor = {
        active: "bg-green-100 text-green-800 border-green-200",
        paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
        expired: "bg-gray-100 text-gray-800 border-gray-200",
    }[subscription.status]

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">{subscription.plan_name}</CardTitle>
                    <CardDescription className="capitalize">{subscription.billing_cycle} Billing</CardDescription>
                </div>
                <Badge variant="outline" className={statusColor}>
                    {subscription.status}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: subscription.currency }).format(subscription.amount)}
                    </span>
                    <span className="text-sm text-muted-foreground">/{subscription.billing_cycle === 'monthly' ? 'mo' : 'cycle'}</span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Started
                        </span>
                        <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Next Billing
                        </span>
                        <span className={isOverdue ? "text-red-600 font-medium flex items-center gap-1" : ""}>
                            {isOverdue && <AlertCircle className="w-3 h-3" />}
                            {new Date(subscription.next_billing_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {isOverdue ? "Payment Overdue" : "Auto-renewal active"}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8" onClick={onEdit}>
                        Manage
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
