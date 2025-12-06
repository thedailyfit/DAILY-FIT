"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DietEditorWrapper } from "./diet-editor-wrapper"
import { WorkoutEditorWrapper } from "./workout-editor-wrapper"

interface PlansTabProps {
    clientId: string
    mealPlan: any
    workoutPlan: any
}

export function PlansTab({ clientId, mealPlan, workoutPlan }: PlansTabProps) {
    return (
        <Tabs defaultValue="diet" className="space-y-4">
            <TabsList>
                <TabsTrigger value="diet">Diet Plan</TabsTrigger>
                <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="diet" className="space-y-4">
                <DietEditorWrapper />
            </TabsContent>

            <TabsContent value="workout" className="space-y-4">
                <WorkoutEditorWrapper />
            </TabsContent>
        </Tabs>
    )
}
