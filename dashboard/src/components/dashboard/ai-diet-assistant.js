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
exports.AIDietAssistant = AIDietAssistant;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const card_1 = require("@/components/ui/card");
const generate_diet_plan_1 = require("@/app/actions/generate-diet-plan");
const lucide_react_1 = require("lucide-react");
function AIDietAssistant({ onPlanGenerated }) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [calories, setCalories] = (0, react_1.useState)("2000");
    const [cuisine, setCuisine] = (0, react_1.useState)("Balanced");
    const [meals, setMeals] = (0, react_1.useState)("3");
    const handleGenerate = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const plan = yield (0, generate_diet_plan_1.generateDietPlan)({
                calories: parseInt(calories),
                cuisine,
                meals: parseInt(meals),
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
                    <lucide_react_1.Sparkles className="h-5 w-5 text-purple-500"/>
                    AI Assistant
                </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
                <div className="space-y-2">
                    <label_1.Label>Target Calories</label_1.Label>
                    <input_1.Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)}/>
                </div>

                <div className="space-y-2">
                    <label_1.Label>Diet Type / Cuisine</label_1.Label>
                    <select_1.Select value={cuisine} onValueChange={setCuisine}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="Balanced">Balanced</select_1.SelectItem>
                            <select_1.SelectItem value="Low Carb">Low Carb</select_1.SelectItem>
                            <select_1.SelectItem value="High Protein">High Protein</select_1.SelectItem>
                            <select_1.SelectItem value="Vegetarian">Vegetarian</select_1.SelectItem>
                            <select_1.SelectItem value="Vegan">Vegan</select_1.SelectItem>
                            <select_1.SelectItem value="Indian">Indian</select_1.SelectItem>
                            <select_1.SelectItem value="Mediterranean">Mediterranean</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <div className="space-y-2">
                    <label_1.Label>Meals per Day</label_1.Label>
                    <select_1.Select value={meals} onValueChange={setMeals}>
                        <select_1.SelectTrigger>
                            <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="3">3 Meals</select_1.SelectItem>
                            <select_1.SelectItem value="4">3 Meals + 1 Snack</select_1.SelectItem>
                            <select_1.SelectItem value="5">3 Meals + 2 Snacks</select_1.SelectItem>
                            <select_1.SelectItem value="6">6 Small Meals</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>

                <button_1.Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleGenerate} disabled={loading}>
                    {loading ? (<>
                            <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Generating...
                        </>) : ("Generate Full Day Plan")}
                </button_1.Button>

                <div className="text-xs text-muted-foreground mt-4">
                    <p>Tip: Generated plans are suggestions. You can edit them freely after generation.</p>
                </div>
            </card_1.CardContent>
        </card_1.Card>);
}
