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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const supabase_1 = require("@/lib/supabase");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
function getDashboardStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        // 1. Total Clients
        const { count: totalClients } = yield supabase
            .from('members')
            .select('*', { count: 'exact', head: true });
        // 2. Active Plans (approximation for now)
        const { count: activePlans } = yield supabase
            .from('workout_plans')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');
        // 3. Alerts (Clients with low adherence)
        const { count: lowAdherenceCount } = yield supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .lt('adherence_score', 70);
        // 4. Recent Clients
        const { data: recentClients } = yield supabase
            .from('members')
            .select('id, name, phone_number, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
        return {
            totalClients: totalClients || 0,
            activePlans: activePlans || 0,
            alerts: lowAdherenceCount || 0,
            recentClients: recentClients || []
        };
    });
}
function DashboardPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield getDashboardStats();
        return (<div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back to <span className="font-semibold text-primary">DailyFit AI</span>. Here's what's happening today.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Total Clients
                        </card_1.CardTitle>
                        <lucide_react_1.Users className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Active Plans
                        </card_1.CardTitle>
                        <lucide_react_1.Dumbbell className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">
                            +5 new this week
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            Pending Alerts
                        </card_1.CardTitle>
                        <lucide_react_1.AlertCircle className="h-4 w-4 text-muted-foreground"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">{stats.alerts}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                    <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <card_1.CardTitle className="text-sm font-medium">
                            AI Suggestions
                        </card_1.CardTitle>
                        <lucide_react_1.Sparkles className="h-4 w-4 text-primary"/>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Plan optimizations
                        </p>
                    </card_1.CardContent>
                </card_1.Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Clients */}
                <card_1.Card className="col-span-4">
                    <card_1.CardHeader>
                        <card_1.CardTitle>Recent Clients</card_1.CardTitle>
                        <card_1.CardDescription>
                            You have {stats.totalClients} total clients.
                        </card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="space-y-4">
                            {stats.recentClients.length === 0 ? (<p className="text-sm text-muted-foreground">No clients yet.</p>) : (stats.recentClients.map(client => (<div key={client.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="grid gap-1">
                                                <p className="text-sm font-medium leading-none">{client.name}</p>
                                                <p className="text-xs text-muted-foreground">{client.phone_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <badge_1.Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                                                {client.status}
                                            </badge_1.Badge>
                                            <button_1.Button variant="ghost" size="icon" asChild>
                                                <link_1.default href={`/dashboard/clients/${client.id}`}>
                                                    <lucide_react_1.ArrowRight className="h-4 w-4"/>
                                                </link_1.default>
                                            </button_1.Button>
                                        </div>
                                    </div>)))}
                        </div>
                    </card_1.CardContent>
                </card_1.Card>

                {/* Quick Actions */}
                <card_1.Card className="col-span-3">
                    <card_1.CardHeader>
                        <card_1.CardTitle>Quick Actions</card_1.CardTitle>
                        <card_1.CardDescription>
                            Common tasks and shortcuts
                        </card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-4">
                        <button_1.Button className="w-full justify-start" asChild>
                            <link_1.default href="/dashboard/clients">
                                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                                Add New Client
                            </link_1.default>
                        </button_1.Button>
                        <button_1.Button variant="outline" className="w-full justify-start" asChild>
                            <link_1.default href="/dashboard/plans/diets/new">
                                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                                Create New Diet Template
                            </link_1.default>
                        </button_1.Button>
                        <button_1.Button variant="outline" className="w-full justify-start" asChild>
                            <link_1.default href="/dashboard/plans/workouts/new">
                                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                                Create New Workout Template
                            </link_1.default>
                        </button_1.Button>
                        <button_1.Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                            <link_1.default href="/dashboard/settings">
                                Configure Settings
                            </link_1.default>
                        </button_1.Button>
                    </card_1.CardContent>
                </card_1.Card>
            </div>
        </div>);
    });
}
