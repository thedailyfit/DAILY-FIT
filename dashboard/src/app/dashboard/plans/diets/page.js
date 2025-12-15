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
exports.default = DietPlansPage;
const diet_plans_table_v2_1 = require("@/components/plans/diet-plans-table-v2");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const supabase_1 = require("@/lib/supabase");
const link_1 = __importDefault(require("next/link"));
exports.metadata = {
    title: "Diet Plans | DailyFit Trainer Dashboard",
};
function getDietPlans() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        // Fetch all diet plans ordered by creation date
        const { data, error } = yield supabase
            .from("diet_plans")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching diet plans:", error);
            return [];
        }
        if (!data)
            return [];
        // Map database fields to UI type
        return data.map((plan) => ({
            id: plan.id,
            name: plan.name,
            goal: plan.goal || "fat_loss",
            totalCalories: plan.total_calories || 0,
            protein: plan.protein || 0, // Map protein from DB
            dietPreference: plan.diet_preference || "any",
            planType: plan.plan_type || "template",
            tags: [], // Tags not yet in DB
            isActive: plan.is_active !== false,
            activeClientsCount: 0, // Usage count not yet implemented
        }));
    });
}
function DietPlansPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const plans = yield getDietPlans();
        return (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Diet Plans
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create, manage, and reuse structured nutrition plans for your clients.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button_1.Button size="sm" asChild>
                        <link_1.default href="/dashboard/plans/diets/new">
                            + New Diet Plan
                        </link_1.default>
                    </button_1.Button>
                </div>
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-base">
                        Diet Plan Library
                    </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <diet_plans_table_v2_1.DietPlansTable plans={plans}/>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
