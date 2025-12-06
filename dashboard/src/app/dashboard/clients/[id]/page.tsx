import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { AssignPlanDialog } from "@/components/clients/assign-plan-dialog";
import { EditClientDialog } from "@/components/clients/edit-client-dialog";
import { LogProgressDialog } from "@/components/clients/log-progress-dialog";
import { ProgressCharts } from "@/components/clients/progress-charts";
import { ProgressSummaryCard } from "@/components/clients/progress-summary-card";
import { CheckInTimeline } from "@/components/clients/check-in-timeline";
import { SubscriptionCard } from "@/components/clients/subscription-card";
import { PaymentHistoryTable } from "@/components/clients/payment-history-table";
import { RecordPaymentDialog } from "@/components/clients/record-payment-dialog";

export type ClientStatus = "Active" | "Paused" | "Trial" | "Inactive";

type ClientProfile = {
    id: string;
    name: string;
    status: ClientStatus;
    phone: string;
    goal: string;
    email?: string | null;
    gender?: string | null;
    avatarUrl?: string | null;
    activeProgramName?: string | null;
    daysOnPlan?: number;
    lastCheckIn?: string | null;
    progressEntries?: any[];
    subscription?: any;
    payments?: any[];
};

export const metadata: Metadata = {
    title: "Client Profile | DailyFit Trainer Dashboard",
};

async function getClient(id: string): Promise<ClientProfile | null> {
    const supabase = createClient();

    // Fetch client details
    const { data: client, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !client) {
        console.error("Error fetching client:", error);
        return null;
    }

    // Fetch active program
    const { data: program } = await supabase
        .from("client_programs")
        .select("*, plan_programs(name)")
        .eq("client_id", id)
        .eq("is_current", true)
        .single();

    // Calculate days on plan
    let daysOnPlan = 0;
    if (program?.start_date) {
        const start = new Date(program.start_date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        daysOnPlan = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Fetch progress entries
    const { data: progressEntries } = await supabase
        .from("client_progress_entries")
        .select("*")
        .eq("client_id", id)
        .order("date", { ascending: true });

    // Fetch active subscription
    const { data: subscription } = await supabase
        .from("client_subscriptions")
        .select("*")
        .eq("client_id", id)
        .eq("status", "active")
        .single();

    // Fetch payment history
    const { data: payments } = await supabase
        .from("client_payments")
        .select("*")
        .eq("client_id", id)
        .order("payment_date", { ascending: false });

    return {
        id: client.id,
        name: client.name,
        status: client.status as ClientStatus,
        phone: client.phone,
        email: client.email,
        gender: client.gender,
        goal: client.goal,
        avatarUrl: null, // TODO: Add avatar support
        activeProgramName: program?.plan_programs?.name || null,
        daysOnPlan: daysOnPlan,
        lastCheckIn: client.last_active_at, // Using last_active_at as proxy for check-in
        progressEntries: progressEntries || [],
        subscription: subscription || null,
        payments: payments || [],
    };
}

const statusColorMap: Record<ClientStatus, string> = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Paused: "bg-amber-100 text-amber-800 border-amber-200",
    Trial: "bg-sky-100 text-sky-800 border-sky-200",
    Inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

type PageProps = {
    params: { id: string };
};

export default async function ClientProfilePage({ params }: PageProps) {
    const client = await getClient(params.id);

    if (!client) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="mr-1" asChild>
                        {/* In a real app, use next/link to go back to clients list */}
                        <a href="/dashboard/clients">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </a>
                    </Button>
                    <div className="flex items-center gap-3">
                        {/* Avatar placeholder */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {client.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={statusColorMap[client.status]}
                                >
                                    {client.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Goal: {client.goal || "Not set"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Active Program: {client.activeProgramName || "None assigned"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <a
                            href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            WhatsApp
                        </a>
                    </Button>
                    <EditClientDialog client={client} />
                    <AssignPlanDialog clientId={client.id} clientName={client.name} />
                    <Button variant="outline" size="sm">
                        View Payments
                    </Button>
                    <Button variant="ghost" size="sm">
                        Pause Client
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="plans">Plans</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="workout">Workout</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                {/* OVERVIEW */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Days on Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">
                                    {client.daysOnPlan ?? "-"}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Since program start
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Last Check-in
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">
                                    {formatDate(client.lastCheckIn)}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Based on progress review
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Status Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Use the Progress tab to review adherence, weight trend and
                                    update this client&apos;s status.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Weight & Adherence Snapshot
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Replace with Recharts line/area chart */}
                            <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                                Weight & adherence charts go here (Recharts)
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PLANS */}
                <TabsContent value="plans" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-[2fr_1.5fr]">
                        {/* Left: Current Active Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Current Active Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Program
                                    </p>
                                    <p className="text-sm">
                                        {client.activeProgramName || "No program assigned"}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline">
                                        Change Plan
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        Pause Plan
                                    </Button>
                                    <Button size="sm">
                                        Clone &amp; Customize for this Client
                                    </Button>
                                </div>
                                <div className="space-y-2 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Client-specific Plans
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>Diet Plan: Custom Diet – (view in Nutrition tab)</li>
                                        <li>Workout Plan: Custom Workout – (view in Workout tab)</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Right: AI Suggestions & History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    AI Suggestions & Plan History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        AI Suggested Diet (Today)
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Example: 1700 kcal, 130g protein, Veg, 5 meals.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Apply as Draft
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        AI Suggested Workout (Today)
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Example: Upper Body Strength, 5 exercises, 45 mins.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Apply as Draft
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Plan History
                                    </p>
                                    <div className="flex h-16 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                                        Table of versions (v1, v2, trainer edits) goes here.
                                    </div>
                                </div>

                                <Button size="sm" className="w-full" variant="outline">
                                    Generate New Suggestions
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* NUTRITION */}
                <TabsContent value="nutrition" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Nutrition Plan (Client-Specific)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">
                                Show the client&apos;s current day meal plan here with an
                                editable grid (meals, items, macros).
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm">Edit Diet Plan</Button>
                                <Button size="sm" variant="outline">
                                    Re-generate from AI
                                </Button>
                                <Button size="sm" variant="outline">
                                    Reset to Template
                                </Button>
                            </div>
                            <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                                Meal plan table / accordions will be rendered here.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* WORKOUT */}
                <TabsContent value="workout" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Workout Schedule (Client-Specific)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">
                                Show weekly schedule (Mon–Sun) with exercises per day.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm">Edit Workout Plan</Button>
                                <Button size="sm" variant="outline">
                                    Swap workout from template
                                </Button>
                            </div>
                            <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                                Workout plan calendar / table will be rendered here.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PROGRESS */}
                <TabsContent value="progress" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Adherence
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">76%</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Last 14 days (example placeholder)
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Weight Change
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">
                                    {client.progressEntries && client.progressEntries.length >= 2
                                        ? `${(client.progressEntries[client.progressEntries.length - 1].weight_kg - client.progressEntries[0].weight_kg).toFixed(1)} kg`
                                        : "-"}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Total Change
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Workouts This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">5 / 7</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Completed sessions
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">
                                        Progress Charts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ProgressCharts data={client.progressEntries || []} />
                                </CardContent>
                            </Card>

                            <ProgressSummaryCard
                                clientId={client.id}
                                clientName={client.name}
                                progressEntries={client.progressEntries || []}
                            />
                        </div>

                        <CheckInTimeline entries={client.progressEntries || []} />
                    </div>
                </TabsContent>

                {/* PAYMENTS */}
                <TabsContent value="payments" className="mt-4">
                    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                        <div className="space-y-6">
                            <SubscriptionCard subscription={client.subscription} />
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <RecordPaymentDialog clientId={client.id} />
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        Send Invoice
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        Change Pricing Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Payment History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PaymentHistoryTable payments={client.payments || []} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
