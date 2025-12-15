"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCard = SubscriptionCard;
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function SubscriptionCard({ subscription, onEdit }) {
    if (!subscription) {
        return (<card_1.Card className="border-dashed">
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-sm font-medium">Current Subscription</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="rounded-full bg-muted p-3 mb-3">
                        <lucide_react_1.CreditCard className="w-6 h-6 text-muted-foreground"/>
                    </div>
                    <p className="text-sm font-medium">No Active Subscription</p>
                    <p className="text-xs text-muted-foreground mb-4">This client does not have an active plan.</p>
                    <button_1.Button size="sm" onClick={onEdit}>Add Subscription</button_1.Button>
                </card_1.CardContent>
            </card_1.Card>);
    }
    const isOverdue = new Date(subscription.next_billing_date) < new Date();
    const statusColor = {
        active: "bg-green-100 text-green-800 border-green-200",
        paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
        expired: "bg-gray-100 text-gray-800 border-gray-200",
    }[subscription.status];
    return (<card_1.Card>
            <card_1.CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                    <card_1.CardTitle className="text-base font-semibold">{subscription.plan_name}</card_1.CardTitle>
                    <card_1.CardDescription className="capitalize">{subscription.billing_cycle} Billing</card_1.CardDescription>
                </div>
                <badge_1.Badge variant="outline" className={statusColor}>
                    {subscription.status}
                </badge_1.Badge>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: subscription.currency }).format(subscription.amount)}
                    </span>
                    <span className="text-sm text-muted-foreground">/{subscription.billing_cycle === 'monthly' ? 'mo' : 'cycle'}</span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <lucide_react_1.Calendar className="w-4 h-4"/> Started
                        </span>
                        <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <lucide_react_1.CreditCard className="w-4 h-4"/> Next Billing
                        </span>
                        <span className={isOverdue ? "text-red-600 font-medium flex items-center gap-1" : ""}>
                            {isOverdue && <lucide_react_1.AlertCircle className="w-3 h-3"/>}
                            {new Date(subscription.next_billing_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </card_1.CardContent>
            <card_1.CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {isOverdue ? "Payment Overdue" : "Auto-renewal active"}
                    </span>
                    <button_1.Button variant="ghost" size="sm" className="h-8" onClick={onEdit}>
                        Manage
                    </button_1.Button>
                </div>
            </card_1.CardFooter>
        </card_1.Card>);
}
