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
exports.default = ClientsPage;
const clients_table_1 = require("@/components/clients/clients-table");
const card_1 = require("@/components/ui/card");
const supabase_1 = require("@/lib/supabase");
const add_client_dialog_1 = require("@/components/clients/add-client-dialog");
exports.metadata = {
    title: "Clients | DailyFit Trainer Dashboard",
};
function getClients() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        // Fetch members with their active plan assignments
        // We need to fetch members AND their active client_programs -> plan_programs
        const { data: members, error } = yield supabase
            .from('members')
            .select(`
            *,
            client_programs:client_programs(
                program:plan_programs(name),
                is_current
            )
        `)
            .order('name', { ascending: true });
        if (error) {
            console.error('Error fetching clients:', error);
            return [];
        }
        return (members || []).map((row) => {
            var _a, _b;
            // Find the active program (should be only one current one usually, or we show the latest)
            // Filter for is_current = true
            const activePrograms = (_a = row.client_programs) === null || _a === void 0 ? void 0 : _a.filter((cp) => cp.is_current === true);
            const planName = activePrograms && activePrograms.length > 0
                ? (_b = activePrograms[0].program) === null || _b === void 0 ? void 0 : _b.name
                : "No Plan Assigned";
            return {
                id: row.member_id,
                name: row.name,
                status: (row.status && ['Active', 'Paused', 'Trial', 'Inactive'].includes(row.status))
                    ? row.status
                    : 'Active',
                phone: row.whatsapp_id || row.phone_number || 'N/A',
                planName: planName,
                nextPaymentDate: null,
                lastActive: row.created_at || null,
            };
        });
    });
}
function ClientsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const clients = yield getClients();
        return (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Clients
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage all your personal training clients in one place.
                    </p>
                </div>
                <add_client_dialog_1.AddClientDialog />
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-base">
                        Client Directory
                    </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <clients_table_1.ClientsTable clients={clients}/>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
