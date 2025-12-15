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
exports.AiGenerationDialog = AiGenerationDialog;
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
function AiGenerationDialog({ onGenerate }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [goal, setGoal] = (0, react_1.useState)("");
    const [calories, setCalories] = (0, react_1.useState)("");
    const [diet, setDiet] = (0, react_1.useState)("");
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        // Simulate async if needed, but the actual generation happens in parent callback usually
        // Here we just pass data
        yield onGenerate({ goal, calories, diet });
        setLoading(false);
        setOpen(false);
    });
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button variant="secondary" size="sm">
                    <lucide_react_1.Wand2 className="w-4 h-4 mr-2"/>
                    AI Generate
                </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Generate Meal Plan</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Use AI to create a balanced meal plan based on requirements.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="goal">Goal</label_1.Label>
                        <input_1.Input id="goal" placeholder="e.g. Fat Loss" value={goal} onChange={(e) => setGoal(e.target.value)} required/>
                    </div>
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="calories">Target Calories</label_1.Label>
                        <input_1.Input id="calories" placeholder="e.g. 1800" type="number" value={calories} onChange={(e) => setCalories(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <label_1.Label htmlFor="diet">Diet Preference</label_1.Label>
                        <input_1.Input id="diet" placeholder="e.g. Vegetarian, High Protein" value={diet} onChange={(e) => setDiet(e.target.value)}/>
                    </div>
                    <dialog_1.DialogFooter>
                        <button_1.Button type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Plan"}
                        </button_1.Button>
                    </dialog_1.DialogFooter>
                </form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
