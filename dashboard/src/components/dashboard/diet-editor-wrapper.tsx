"use client"

import { useState } from "react"
import { MealPlanEditor } from "./meal-plan-editor"
import { AIDietAssistant } from "./ai-diet-assistant"
import { Button } from "@/components/ui/button"
import { PanelRightOpen, PanelRightClose, Save } from "lucide-react"

export function DietEditorWrapper() {
    const [showAI, setShowAI] = useState(true)
    const [planData, setPlanData] = useState<any>(null)

    const handleAIPlan = (newPlan: any) => {
        setPlanData(newPlan)
    }

    return (
        <div className="flex h-[600px] border rounded-md overflow-hidden bg-background">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="border-b p-2 flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm ml-2">Diet Plan Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowAI(!showAI)}>
                            {showAI ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" className="gap-2">
                            <Save className="h-4 w-4" /> Save Plan
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <MealPlanEditor initialData={planData} onChange={setPlanData} />
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            {showAI && (
                <div className="w-[300px] border-l bg-muted/10">
                    <AIDietAssistant onPlanGenerated={handleAIPlan} />
                </div>
            )}
        </div>
    )
}
