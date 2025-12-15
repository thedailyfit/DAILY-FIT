"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansTab = PlansTab;
const tabs_1 = require("@/components/ui/tabs");
const diet_editor_wrapper_1 = require("./diet-editor-wrapper");
const workout_editor_wrapper_1 = require("./workout-editor-wrapper");
function PlansTab({ clientId, mealPlan, workoutPlan }) {
    return (<tabs_1.Tabs defaultValue="diet" className="space-y-4">
            <tabs_1.TabsList>
                <tabs_1.TabsTrigger value="diet">Diet Plan</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="workout">Workout Plan</tabs_1.TabsTrigger>
            </tabs_1.TabsList>

            <tabs_1.TabsContent value="diet" className="space-y-4">
                <diet_editor_wrapper_1.DietEditorWrapper />
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="workout" className="space-y-4">
                <workout_editor_wrapper_1.WorkoutEditorWrapper />
            </tabs_1.TabsContent>
        </tabs_1.Tabs>);
}
