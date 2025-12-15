"use strict";
"use client";
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
exports.AIWorkoutAssistant = AIWorkoutAssistant;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const card_1 = require("@/components/ui/card");
const generate_workout_plan_1 = require("@/app/actions/generate-workout-plan");
const lucide_react_1 = require("lucide-react");
function AIWorkoutAssistant({ onPlanGenerated }) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [goal, setGoal] = (0, react_1.useState)("Muscle Gain");
    const [level, setLevel] = (0, react_1.useState)("Intermediate");
    const [days, setDays] = (0, react_1.useState)("3");
    const [equipment, setEquipment] = (0, react_1.useState)("Gym");
    const handleGenerate = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const plan = yield (0, generate_workout_plan_1.generateWorkoutPlan)({
                goal,
                level,
                days: parseInt(days),
                equipment,
            });
            onPlanGenerated(plan);
        }
        catch (error) {
            console.error("Failed to generate plan", error);
            alert("Failed to generate plan. Please try again.");
        }
        finally {
            setLoading(false);
        }
    });
    return (<card_1.Card className="h-full border-l rounded-none border-y-0 border-r-0 shadow-none">
            <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2 text-lg">
                    <lucide_react_1.Dumbbell className="h-5 w-5 text-blue-500"/>
                    AI Coach
                </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
                <div className="space-y-2">
                    <label_1.Label>Goal</label_1.Label>
                    <select_1.Select value={goal} onValueChange={setGoal}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="Muscle Gain">Muscle Gain</select_1.SelectItem>
                            <select_1.SelectItem value="Fat Loss">Fat Loss</select_1.SelectItem>
                            <select_1.SelectItem value="Strength">Strength</select_1.SelectItem>
                            <select_1.SelectItem value="Endurance">Endurance</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <div className="space-y-2">
                    <label_1.Label>Experience Level</label_1.Label>
                    <select_1.Select value={level} onValueChange={setLevel}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="Beginner">Beginner</select_1.SelectItem>
                            <select_1.SelectItem value="Intermediate">Intermediate</select_1.SelectItem>
                            <select_1.SelectItem value="Advanced">Advanced</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <div className="space-y-2">
                    <label_1.Label>Days per Week</label_1.Label>
                    <select_1.Select value={days} onValueChange={setDays}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="2">2 Days</select_1.SelectItem>
                            <select_1.SelectItem value="3">3 Days</select_1.SelectItem>
                            <select_1.SelectItem value="4">4 Days</select_1.SelectItem>
                            <select_1.SelectItem value="5">5 Days</select_1.SelectItem>
                            <select_1.SelectItem value="6">6 Days</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <div className="space-y-2">
                    <label_1.Label>Equipment</label_1.Label>
                    <select_1.Select value={equipment} onValueChange={setEquipment}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="Gym">Full Gym</select_1.SelectItem>
                            <select_1.SelectItem value="Dumbbells">Dumbbells Only</select_1.SelectItem>
                            <select_1.SelectItem value="Bodyweight">Bodyweight</select_1.SelectItem>
                            <select_1.SelectItem value="Home Gym">Home Gym</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <button_1.Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleGenerate} disabled={loading}>
                    {loading ? (<>
                            <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Generating...
                        </>) : ("Generate Workout Split")}
                </button_1.Button>
            </card_1.CardContent>
        </card_1.Card>);
}
