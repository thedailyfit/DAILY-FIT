"use client";

import { useState } from "react";
import { WorkoutPlanEditor } from "@/components/dashboard/workout-plan-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Dumbbell, Save, ArrowLeft, Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanDay {
    name: string;
    exercises: any[];
}

interface Plan {
    id: string;
    name: string;
    category: string;
    days: PlanDay[];
}

const MOCK_PLANS: Plan[] = [
    { id: "1", name: "Summer Shred 4-Week", category: "Fat Loss", days: [] },
    { id: "2", name: "Muscle Mass Builder", category: "Hypertrophy", days: [] },
    { id: "3", name: "Beginner Full Body", category: "General", days: [] },
];

export function GymProgramManager() {
    const [view, setView] = useState<"list" | "editor">("list");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS);
    const [newPlanName, setNewPlanName] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreate = () => {
        if (!newPlanName) return;
        const newPlan = { id: Date.now().toString(), name: newPlanName, category: "Custom", days: [] };
        setPlans([...plans, newPlan]);
        setNewPlanName("");
        setSelectedPlan(newPlan);
        setView("editor");
    };

    const handleAIGenerate = () => {
        if (!aiPrompt) return;
        setIsGenerating(true);

        // Mock AI Generation
        setTimeout(() => {
            const aiPlan = {
                id: Date.now().toString(),
                name: `AI: ${aiPrompt.substring(0, 20)}...`,
                category: "AI Generated",
                days: [
                    { name: "Day 1: Full Body", exercises: [] },
                    { name: "Day 2: Cardio & Core", exercises: [] }
                ]
            };
            setPlans([...plans, aiPlan]);
            setAiPrompt("");
            setIsGenerating(false);
            setSelectedPlan(aiPlan);
            setView("editor");
        }, 1500);
    };

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan);
        setView("editor");
    };

    const handleSave = (data: any) => {
        const updatedPlans = plans.map(p => p.id === selectedPlan.id ? { ...p, ...data } : p);
        setPlans(updatedPlans);
        alert(`Plan "${selectedPlan.name}" Saved Successfully!`);
        setView("list");
    };

    if (view === "editor") {
        return (
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setView("list")} className="gap-2 text-foreground hover:bg-accent">
                        <ArrowLeft className="h-4 w-4" /> Back to Plans
                    </Button>
                    <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="text-muted-foreground border-border">{selectedPlan.category}</Badge>
                        <h2 className="text-xl font-bold text-foreground">{selectedPlan.name}</h2>
                    </div>
                    <Button onClick={() => handleSave({ days: selectedPlan.days })} className="bg-primary text-primary-foreground hover:opacity-90">
                        <Save className="h-4 w-4 mr-2" /> Save Plan
                    </Button>
                </div>
                <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden shadow-lg">
                    <WorkoutPlanEditor initialData={selectedPlan} onChange={(data) => setSelectedPlan({ ...selectedPlan, ...data })} />
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-200px)]">
            {/* Create New Card */}
            {/* Create New Card */}
            <Card className="col-span-1 border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col p-6 space-y-4 hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2 justify-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="font-bold text-lg text-foreground">Gym Admin Created Custom Plan</h3>
                    <p className="text-xs text-muted-foreground">Build a template manually or ask AI.</p>
                </div>

                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                        <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-3 h-3" /> AI Build</TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-3">
                        <Input
                            placeholder="Plan Name..."
                            value={newPlanName}
                            onChange={(e) => setNewPlanName(e.target.value)}
                            className="bg-secondary border-border text-foreground"
                        />
                        <Button onClick={handleCreate} disabled={!newPlanName} className="w-full bg-primary text-primary-foreground">Create Manually</Button>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-3">
                        <Textarea
                            placeholder="Describe the plan (e.g. '4-day split for fat loss for beginners')..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="bg-secondary border-border text-foreground min-h-[80px] text-sm"
                        />
                        <Button
                            onClick={handleAIGenerate}
                            disabled={!aiPrompt || isGenerating}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
                        >
                            {isGenerating ? (
                                <><Bot className="w-4 h-4 mr-2 animate-bounce" /> Generating...</>
                            ) : (
                                <><Sparkles className="w-4 h-4 mr-2" /> Generate Plan</>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* List Existing Plans */}
            {plans.map((plan) => (
                <Card key={plan.id} className="relative group hover:shadow-lg transition-all cursor-pointer border-border bg-card" onClick={() => handleEdit(plan)}>
                    <div className="h-32 bg-secondary rounded-t-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <Dumbbell className="h-12 w-12 text-primary z-10 opacity-80 group-hover:scale-110 transition-transform" />
                        <Badge className="absolute top-2 right-2 bg-primary/20 text-primary border-primary/30 z-20 text-[10px] uppercase">{plan.category}</Badge>
                    </div>
                    <CardContent className="pt-4">
                        <h3 className="font-bold text-lg leading-tight text-foreground">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{plan.days?.length || 0} Workout Days</p>
                        <Button variant="link" className="px-0 text-primary font-bold mt-2">Edit Template &rarr;</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
