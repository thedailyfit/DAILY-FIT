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
exports.default = SupportPage;
const support_tickets_table_1 = require("@/components/support/support-tickets-table");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
exports.metadata = {
    title: "Support | DailyFit Trainer Dashboard",
};
function getSupportTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Replace with real Supabase query from support_view
        // const { data } = await supabase.from("support_view").select("*");
        return [
            {
                id: "t1",
                ticket_id: "t1",
                trainer_id: "tr1",
                client_id: "c1",
                client_name: "Akhil",
                subject: "App crashing on login",
                category: "technical",
                status: "open",
                priority: "high",
                created_at: "2025-12-04T10:00:00Z",
                updated_at: "2025-12-04T10:00:00Z",
            },
            {
                id: "t2",
                ticket_id: "t2",
                trainer_id: "tr1",
                client_id: "c2",
                client_name: "Karthik",
                subject: "Billing question",
                category: "billing",
                status: "resolved",
                priority: "normal",
                created_at: "2025-11-20T10:00:00Z",
                updated_at: "2025-11-22T10:00:00Z",
                resolved_at: "2025-11-22T10:00:00Z",
            },
            {
                id: "t3",
                ticket_id: "t3",
                trainer_id: "tr1",
                client_id: null,
                client_name: null,
                subject: "Feature request: Dark mode",
                category: "feature_request",
                status: "in_progress",
                priority: "low",
                created_at: "2025-12-01T10:00:00Z",
                updated_at: "2025-12-02T10:00:00Z",
            },
        ];
    });
}
function SupportPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const tickets = yield getSupportTickets();
        return (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Support
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage client inquiries and technical support tickets.
                    </p>
                </div>
                <button_1.Button size="sm">
                    <lucide_react_1.MessageSquarePlus className="mr-2 h-4 w-4"/>
                    Create Ticket
                </button_1.Button>
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-base">
                        Ticket History
                    </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <support_tickets_table_1.SupportTicketsTable tickets={tickets}/>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
