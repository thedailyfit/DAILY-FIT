"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietEditorWrapper = DietEditorWrapper;
const react_1 = require("react");
const meal_plan_editor_1 = require("./meal-plan-editor");
const ai_diet_assistant_1 = require("./ai-diet-assistant");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function DietEditorWrapper({ initialData, member }) {
    const [showAI, setShowAI] = (0, react_1.useState)(true);
    const [planData, setPlanData] = (0, react_1.useState)(initialData);
    const handleAIPlan = (newPlan) => {
        setPlanData(newPlan);
    };
    return (<div className="flex h-[600px] border rounded-md overflow-hidden bg-background">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="border-b p-2 flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm ml-2">Diet Plan Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button_1.Button variant="ghost" size="sm" onClick={() => setShowAI(!showAI)}>
                            {showAI ? <lucide_react_1.PanelRightClose className="h-4 w-4"/> : <lucide_react_1.PanelRightOpen className="h-4 w-4"/>}
                        </button_1.Button>
                        <button_1.Button size="sm" className="gap-2">
                            <lucide_react_1.Save className="h-4 w-4"/> Save Plan
                        </button_1.Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <meal_plan_editor_1.MealPlanEditor initialData={planData} onChange={setPlanData}/>
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            {showAI && (<div className="w-[300px] border-l bg-muted/10">
                    <ai_diet_assistant_1.AIDietAssistant onPlanGenerated={handleAIPlan}/>
                </div>)}
        </div>);
}
