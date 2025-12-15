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
exports.metadata = void 0;
exports.default = ClientProfilePage;
const navigation_1 = require("next/navigation");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const supabase_1 = require("@/lib/supabase");
const assign_plan_dialog_1 = require("@/components/clients/assign-plan-dialog");
const link_1 = __importDefault(require("next/link"));
exports.metadata = {
    title: "Client Profile | DailyFit Trainer Dashboard",
};
function getClientProfile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const supabase = (0, supabase_1.createClient)();
        console.log('[ClientProfile] Fetching profile for ID:', id);
        try {
            // Fetch client from members table using member_id
            const { data: member, error: memberError } = yield supabase
                .from("members")
                .select("*")
                .eq("member_id", id)
                .single();
            console.log('[ClientProfile] Query result:', { member, error: memberError });
            if (memberError) {
                console.error("[ClientProfile] Error fetching member:", memberError);
                return null;
            }
            if (!member) {
                console.error("[ClientProfile] No member found for ID:", id);
                return null;
            }
            console.log('[ClientProfile] Successfully found member:', member.name);
            // Fetch active assigned programs
            const { data: programs, error: programsError } = yield supabase
                .from("client_programs")
                .select(`
                *,
                program:plan_programs (
                    id,
                    name,
                    diet_plan_id,
                    workout_plan_id,
                    status
                )
            `)
                .eq("client_id", id)
                // .eq("is_current", true) // Fetch all history
                .order("created_at", { ascending: false });
            if (programsError) {
                console.error("[ClientProfile] Error fetching programs:", programsError);
            }
            // Fetch chat history
            const { data: messages, error: messagesError } = yield supabase
                .from("messages")
                .select("*")
                .eq("whatsapp_id", (_a = member.whatsapp_id) === null || _a === void 0 ? void 0 : _a.replace('whatsapp:', ''))
                .order("created_at", { ascending: true })
                .limit(50);
            if (messagesError)
                console.error("[ClientProfile] Warning fetching messages:", messagesError);
            return {
                member,
                programs: programs || [],
                messages: messages || []
            };
        }
        catch (error) {
            console.error("[ClientProfile] Unexpected error:", error);
            return null;
        }
    });
}
function ClientProfilePage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        var _b;
        // In Next.js 16, params is a Promise and must be awaited
        const { id } = yield params;
        const data = yield getClientProfile(id);
        if (!data || !data.member) {
            (0, navigation_1.notFound)();
        }
        const { member, programs, messages } = data;
        // Identify active diet and workout plans
        // Identify active diet and workout plans (explicitly check is_current)
        const activeDietProgram = programs.find((p) => { var _a; return p.is_current && ((_a = p.program) === null || _a === void 0 ? void 0 : _a.diet_plan_id); });
        const activeWorkoutProgram = programs.find((p) => { var _a; return p.is_current && ((_a = p.program) === null || _a === void 0 ? void 0 : _a.workout_plan_id); });
        return (<div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button_1.Button variant="ghost" size="icon" asChild>
                        <link_1.default href="/dashboard/clients">
                            <lucide_react_1.ArrowLeft className="h-4 w-4"/>
                        </link_1.default>
                    </button_1.Button>
                    <div>
                        <h1 className="text-3xl font-bold">{member.name}</h1>
                        <p className="text-muted-foreground">Client Profile</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <assign_plan_dialog_1.AssignPlanDialog clientId={member.member_id} clientName={member.name}/>
                </div>
            </div>

            {/* Client Info Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Assigned Plans Card */}
                <card_1.Card className="md:col-span-2">
                    <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                            <lucide_react_1.Target className="h-5 w-5"/>
                            Current Plan Assignments
                        </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <lucide_react_1.Utensils className="h-4 w-4"/> Diet Plan
                                </h3>
                                {activeDietProgram ? (<badge_1.Badge variant="default" className="bg-green-600">Active</badge_1.Badge>) : (<badge_1.Badge variant="secondary">Not Assigned</badge_1.Badge>)}
                            </div>
                            {activeDietProgram ? (<div>
                                    <p className="text-lg font-medium">{activeDietProgram.program.name}</p>
                                    <p className="text-xs text-muted-foreground">Started: {activeDietProgram.start_date}</p>
                                    <button_1.Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                                        <link_1.default href={`/dashboard/plans/diets/${activeDietProgram.program.diet_plan_id}`}>
                                            View Details
                                        </link_1.default>
                                    </button_1.Button>
                                </div>) : (<p className="text-sm text-muted-foreground">No diet plan currently assigned.</p>)}
                        </div>

                        <div className="p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <lucide_react_1.Dumbbell className="h-4 w-4"/> Workout Plan
                                </h3>
                                {activeWorkoutProgram ? (<badge_1.Badge variant="default" className="bg-blue-600">Active</badge_1.Badge>) : (<badge_1.Badge variant="secondary">Not Assigned</badge_1.Badge>)}
                            </div>
                            {activeWorkoutProgram ? (<div>
                                    <p className="text-lg font-medium">{activeWorkoutProgram.program.name}</p>
                                    <p className="text-xs text-muted-foreground">Started: {activeWorkoutProgram.start_date}</p>
                                    <button_1.Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                                        <link_1.default href={`/dashboard/plans/workouts/${activeWorkoutProgram.program.workout_plan_id}`}>
                                            View Details
                                        </link_1.default>
                                    </button_1.Button>
                                </div>) : (<p className="text-sm text-muted-foreground">No workout plan currently assigned.</p>)}
                        </div>
                    </card_1.CardContent>
                </card_1.Card>

                {/* Assignment History - NEW SECTION */}
                <card_1.Card className="md:col-span-2">
                    <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                            <lucide_react_1.Clock className="h-5 w-5"/>
                            Assignment History (Last 7 Days)
                        </card_1.CardTitle>
                        <card_1.CardDescription>Recent plan updates and assignments</card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <div className="space-y-4">
                            {programs && programs.length > 0 ? (programs.map((p) => {
                var _a, _b;
                return (<div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {((_a = p.program) === null || _a === void 0 ? void 0 : _a.diet_plan_id) ? (<lucide_react_1.Utensils className="h-4 w-4 text-orange-500"/>) : (<lucide_react_1.Dumbbell className="h-4 w-4 text-blue-500"/>)}
                                            <div>
                                                <p className="font-medium">{((_b = p.program) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Plan'}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Assigned: {new Date(p.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>Start: {p.start_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {p.is_current ? (<badge_1.Badge variant="default" className="bg-green-600">Active</badge_1.Badge>) : (<badge_1.Badge variant="secondary">History</badge_1.Badge>)}
                                        </div>
                                    </div>);
            })) : (<p className="text-sm text-muted-foreground text-center py-4">No assignment history found.</p>)}
                        </div>
                    </card_1.CardContent>
                </card_1.Card>

                {/* Personal Information */}
                <card_1.Card>
                    <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                            <lucide_react_1.User className="h-5 w-5"/>
                            Personal Information
                        </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <lucide_react_1.Phone className="h-4 w-4 text-muted-foreground"/>
                            <div>
                                <p className="text-sm font-medium">WhatsApp Number</p>
                                <p className="text-sm text-muted-foreground">{member.whatsapp_id || "Not provided"}</p>
                            </div>
                        </div>
                        {member.email && (<div className="flex items-center gap-3">
                                <lucide_react_1.Mail className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                            </div>)}
                        <div className="flex items-center gap-3">
                            <lucide_react_1.Target className="h-4 w-4 text-muted-foreground"/>
                            <div>
                                <p className="text-sm font-medium">Goal</p>
                                <badge_1.Badge variant="outline" className="mt-1">
                                    {((_b = member.goal) === null || _b === void 0 ? void 0 : _b.replace('_', ' ').toUpperCase()) || "Not set"}
                                </badge_1.Badge>
                            </div>
                        </div>
                        {member.gender && (<div className="flex items-center gap-3">
                                <lucide_react_1.User className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm font-medium">Gender</p>
                                    <p className="text-sm text-muted-foreground capitalize">{member.gender}</p>
                                </div>
                            </div>)}
                    </card_1.CardContent>
                </card_1.Card>

                {/* Chat History */}
                <card_1.Card className="flex flex-col h-[500px]">
                    <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                            <lucide_react_1.Mail className="h-5 w-5"/>
                            WhatsApp History
                        </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                        {messages && messages.length > 0 ? (messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'}`}>
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>))) : (<div className="flex h-full items-center justify-center text-muted-foreground">
                                <p>No messages yet</p>
                            </div>)}
                    </card_1.CardContent>
                </card_1.Card>
            </div>
            {/* Additional Info */}
            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle>Health Metrics</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {member.weight_kg && (<div>
                                <p className="text-sm font-medium">Weight</p>
                                <p className="text-2xl font-bold">{member.weight_kg} kg</p>
                            </div>)}
                        {member.height_cm && (<div>
                                <p className="text-sm font-medium">Height</p>
                                <p className="text-2xl font-bold">{member.height_cm} cm</p>
                            </div>)}
                        {member.age && (<div>
                                <p className="text-sm font-medium">Age</p>
                                <p className="text-2xl font-bold">{member.age} years</p>
                            </div>)}
                    </div>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
