"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, Dumbbell, Utensils, Moon, Pill } from "lucide-react";

export default function ProgramBuilderPage() {
    // Stage 1: Basic Info
    const [programName, setProgramName] = useState("");

    // Stage 2: Core Components (Select existing)
    const [selectedDiet, setSelectedDiet] = useState<string>("");
    const [selectedWorkout, setSelectedWorkout] = useState<string>("");

    // Stage 3: Supplements (Array)
    const [supplements, setSupplements] = useState([{ name: "", dosage: "", timing: "" }]);

    // Stage 4: Sleep & Recovery
    const [sleepProtocol, setSleepProtocol] = useState("");
    const [waterIntake, setWaterIntake] = useState("");

    // Mock Data for Dropdowns
    const dietPlans = [
        { id: "d1", name: "High Protein Cut" },
        { id: "d2", name: "Keto Maintenance" },
        { id: "d3", name: "Vegan Bulk" }
    ];
    const workoutPlans = [
        { id: "w1", name: "5-Day Split" },
        { id: "w2", name: "Full Body 3x" },
        { id: "w3", name: "Home Workout (No Equip)" }
    ];

    const addSupplement = () => {
        setSupplements([...supplements, { name: "", dosage: "", timing: "" }]);
    };

    const removeSupplement = (index: number) => {
        const newSupps = [...supplements];
        newSupps.splice(index, 1);
        setSupplements(newSupps);
    };

    const updateSupplement = (index: number, field: string, value: string) => {
        const newSupps = [...supplements];
        // @ts-ignore
        newSupps[index][field] = value;
        setSupplements(newSupps);
    };

    const handleSave = () => {
        console.log("Saving Program:", {
            name: programName,
            dietId: selectedDiet,
            workoutId: selectedWorkout,
            supplements,
            sleepProtocol,
            waterIntake
        });
        alert("Master Program Saved!");
    };

    return (
        <main className="p-8 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Master Program Builder</h1>
                <p className="text-slate-500">Combine nutrition, training, and recovery into a complete package.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Core Setup */}
                <div className="md:col-span-2 space-y-6">

                    {/* 1. Program Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Program Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Program Name</Label>
                                <Input
                                    placeholder="e.g. 12-Week Shred Transformation"
                                    value={programName}
                                    onChange={(e) => setProgramName(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Sync Plans */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Sync Core Plans</CardTitle>
                            <CardDescription>Select pre-made diet and workout templates to attach.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                    <Utensils className="h-6 w-6" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Select Diet Plan</Label>
                                    <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a diet template..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dietPlans.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <Dumbbell className="h-6 w-6" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Select Workout Plan</Label>
                                    <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a workout template..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workoutPlans.map(w => (
                                                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Sleep & Recovery */}
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Sleep & Recovery Protocol</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Daily Water Intake Target</Label>
                                <Input
                                    placeholder="e.g. 3-4 Liters"
                                    value={waterIntake}
                                    onChange={(e) => setWaterIntake(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Sleep Guidelines</Label>
                                <Textarea
                                    placeholder="e.g. No caffeine after 2pm. Room temp 18°C. 7.5 hours minimum."
                                    className="min-h-[100px]"
                                    value={sleepProtocol}
                                    onChange={(e) => setSleepProtocol(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Supplements */}
                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5 text-violet-500" />
                                Supplement Stack
                            </CardTitle>
                            <CardDescription>Add supplements for this program.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {supplements.map((supp, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-slate-50 relative group">
                                    <button
                                        onClick={() => removeSupplement(index)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-slate-500">Name</Label>
                                            <Input
                                                value={supp.name}
                                                onChange={(e) => updateSupplement(index, 'name', e.target.value)}
                                                placeholder="e.g. Creatine"
                                                className="bg-white h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-xs text-slate-500">Dosage</Label>
                                                <Input
                                                    value={supp.dosage}
                                                    onChange={(e) => updateSupplement(index, 'dosage', e.target.value)}
                                                    placeholder="5g"
                                                    className="bg-white h-8"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-500">Timing</Label>
                                                <Input
                                                    value={supp.timing}
                                                    onChange={(e) => updateSupplement(index, 'timing', e.target.value)}
                                                    placeholder="Anytime"
                                                    className="bg-white h-8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button onClick={addSupplement} variant="outline" className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                        </CardContent>
                        <div className="p-6 border-t bg-slate-50 rounded-b-xl">
                            <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Master Program
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
