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
exports.default = RequestsPage;
const supabase_1 = require("@/lib/supabase");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const request_actions_1 = require("@/components/requests/request-actions");
exports.metadata = {
    title: "Client Requests | DailyFit Trainer Dashboard",
};
function getRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        // We'll join with members to get client names
        // Note: Assuming 'member_id' in client_requests matches 'member_id' in members
        const { data: requests, error } = yield supabase
            .from("client_requests")
            .select(`
            *,
            member:members (
                name,
                whatsapp_id
            )
        `)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching requests:", error);
            return [];
        }
        return requests;
    });
}
function RequestsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const requests = yield getRequests();
        return (<div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Client Requests</h1>
                    <p className="text-muted-foreground">Manage incoming requests from clients</p>
                </div>
            </div>

            <div className="grid gap-4">
                {requests && requests.length > 0 ? (requests.map((request) => {
                var _a, _b, _c;
                return (<card_1.Card key={request.id}>
                            <card_1.CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <div className="space-y-1">
                                    <card_1.CardTitle className="text-base font-medium">
                                        {request.title || "Untitled Request"}
                                    </card_1.CardTitle>
                                    <card_1.CardDescription>
                                        From: {((_a = request.member) === null || _a === void 0 ? void 0 : _a.name) || "Unknown Client"} ({((_b = request.member) === null || _b === void 0 ? void 0 : _b.whatsapp_id) || "N/A"})
                                    </card_1.CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <badge_1.Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                                        {request.status}
                                    </badge_1.Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </card_1.CardHeader>
                            <card_1.CardContent>
                                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                    {request.content}
                                </div>
                                <request_actions_1.RequestActions requestId={request.id} whatsappId={(_c = request.member) === null || _c === void 0 ? void 0 : _c.whatsapp_id} status={request.status}/>
                            </card_1.CardContent>
                        </card_1.Card>);
            })) : (<card_1.Card>
                        <card_1.CardContent className="flex flex-col items-center justify-center py-10">
                            <lucide_react_1.MessageSquare className="h-10 w-10 text-muted-foreground mb-4"/>
                            <p className="text-lg font-medium text-muted-foreground">No pending requests</p>
                            <p className="text-sm text-muted-foreground">Client requests will appear here</p>
                        </card_1.CardContent>
                    </card_1.Card>)}
            </div>
        </div>);
    });
}
