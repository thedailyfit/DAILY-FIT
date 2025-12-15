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
exports.default = WorkoutPlansPage;
const workout_plans_table_1 = require("@/components/plans/workout-plans-table");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const supabase_1 = require("@/lib/supabase");
const link_1 = __importDefault(require("next/link"));
exports.metadata = {
    title: "Workout Plans | DailyFit Trainer Dashboard",
};
function getWorkoutPlans() {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, supabase_1.createClient)();
        // Fetch all workout plans
        const { data, error } = yield supabase
            .from("workout_plans")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching workout plans:", error);
            return [];
        }
        if (!data)
            return [];
        return data.map((plan) => ({
            id: plan.id,
            name: plan.name,
            level: plan.level || "beginner",
            frequencyPerWeek: plan.frequency_per_week || 3,
            focus: plan.focus || "general",
            planType: plan.plan_type || "template",
            tags: [], // Tags not yet in DB
            isActive: plan.is_active !== false,
            activeClientsCount: 0, // Usage count not yet implemented
        }));
    });
}
function WorkoutPlansPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const plans = yield getWorkoutPlans();
        return (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Workout Plans
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Build structured training programs you can reuse and customize for clients.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button_1.Button size="sm" asChild>
                        <link_1.default href="/dashboard/plans/workouts/new">
                            + New Workout Plan
                        </link_1.default>
                    </button_1.Button>
                </div>
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-base">
                        Workout Plan Library
                    </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <workout_plans_table_1.WorkoutPlansTable plans={plans}/>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
    });
}
