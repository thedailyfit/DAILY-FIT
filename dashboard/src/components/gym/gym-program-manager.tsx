"use client";

import { useState } from "react";
import { WorkoutPlanEditor } from "@/components/dashboard/workout-plan-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Dumbbell, Save, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_PLANS = [
    { id: "1", name: "Summer Shred 4-Week", category: "Fat Loss", days: [] },
    { id: "2", name: "Muscle Mass Builder", category: "Hypertrophy", days: [] },
    { id: "3", name: "Beginner Full Body", category: "General", days: [] },
];

export function GymProgramManager() {
    const [view, setView] = useState<"list" | "editor">("list");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [plans, setPlans] = useState(MOCK_PLANS);
    const [newPlanName, setNewPlanName] = useState("");

    const handleCreate = () => {
        if (!newPlanName) return;
        const newPlan = { id: Date.now().toString(), name: newPlanName, category: "Custom", days: [] };
        setPlans([...plans, newPlan]);
        setNewPlanName("");
        setSelectedPlan(newPlan);
        setView("editor");
    };

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan);
        setView("editor");
    };

    const handleSave = (data: any) => {
        // Mock Save
        const updatedPlans = plans.map(p => p.id === selectedPlan.id ? { ...p, ...data } : p);
        setPlans(updatedPlans);
        alert(`Plan "${selectedPlan.name}" Saved Successfully!`);
        setView("list");
    };

    if (view === "editor") {
        return (
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Plans
                    </Button>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-zinc-500">{selectedPlan.category}</Badge>
                        <h2 className="text-xl font-bold">{selectedPlan.name}</h2>
                    </div>
                    <Button onClick={() => handleSave({ days: selectedPlan.days })} className="bg-[#cbfe00] text-black hover:bg-[#b0dc00]">
                        <Save className="h-4 w-4 mr-2" /> Save Plan
                    </Button>
                </div>
                <div className="flex-1 border rounded-xl bg-white overflow-hidden shadow-sm">
                    <WorkoutPlanEditor initialData={selectedPlan} onChange={(data) => setSelectedPlan({ ...selectedPlan, ...data })} />
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-200px)]">
            {/* Create New Card */}
            <Card className="col-span-1 border-dashed border-2 border-zinc-300 bg-transparent flex flex-col justify-center items-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Plus className="h-8 w-8 text-zinc-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Create New Standard Plan</h3>
                    <p className="text-sm text-zinc-500">Build a template for your trainers.</p>
                </div>
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Plan Name..."
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        className="bg-white"
                    />
                    <Button onClick={handleCreate} disabled={!newPlanName}>Create</Button>
                </div>
            </Card>

            {/* List Existing Plans */}
            {plans.map((plan) => (
                <Card key={plan.id} className="relative group hover:shadow-lg transition-all cursor-pointer border-none bg-white" onClick={() => handleEdit(plan)}>
                    <div className="h-32 bg-zinc-900 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <Dumbbell className="h-12 w-12 text-[#cbfe00] z-10 opacity-80" />
                        <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 z-20 text-[10px] uppercase">{plan.category}</Badge>
                    </div>
                    <CardContent className="pt-4">
                        <h3 className="font-bold text-lg leading-tight">{plan.name}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{plan.days?.length || 0} Workout Days</p>
                        <Button variant="link" className="px-0 text-[#cbfe00] font-bold mt-2">Edit Template &rarr;</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
