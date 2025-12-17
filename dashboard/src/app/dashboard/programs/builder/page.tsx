"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Dumbbell, Utensils, Pill, Minus } from "lucide-react";

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

    const addSupplement = (name: string, dosage: string, timing: string) => {
        setSupplements([...supplements, { name, dosage, timing }]);
    };

    const removeSupplement = (index: number) => {
        const newSupps = [...supplements];
        newSupps.splice(index, 1);
        setSupplements(newSupps);
    };

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!programName) {
            alert("Please enter a Program Name");
            return;
        }
        setLoading(true);

        // Simulate API Delays for realism
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Saving Program to DB:", {
            name: programName,
            dietId: selectedDiet,
            workoutId: selectedWorkout,
            supplements,
            sleepProtocol,
            waterIntake
        });

        setLoading(false);
        alert(`Success! Master Program "${programName}" has been saved to your library.`);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen text-black">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tight mb-2">Master Program Builder</h1>
                    <p className="text-zinc-500 font-medium">Combine nutrition, training, and recovery into a complete protocol.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#212121] hover:bg-black text-white font-bold h-12 px-8 shadow-xl hover:shadow-2xl transition-all"
                >
                    {loading ? "Saving..." : "Save Master Program"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Form */}
                <div className="md:col-span-2 space-y-6">

                    {/* Step 1: Program Identity - Recreated to match original structure but cleaner */}
                    <div className="bg-[#212121] p-8 rounded-[2rem] shadow-sm">
                        <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                            <span className="text-[#cbfe00] font-mono text-sm">01</span>
                            Program Identity
                        </h2>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Program Name</label>
                            <Input
                                value={programName}
                                onChange={(e) => setProgramName(e.target.value)}
                                placeholder="e.g. 12 Week Shred Transformation"
                                className="bg-black/30 border-none text-white placeholder:text-zinc-600 h-14 rounded-xl focus:ring-1 focus:ring-[#cbfe00]"
                            />
                        </div>
                    </div>

                    {/* Step 2: Core Protocols */}
                    <div className="bg-[#212121] p-8 rounded-[2rem] shadow-sm">
                        <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                            <span className="text-[#cbfe00] font-mono text-sm">02</span>
                            Core Protocols
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-[#cbfe00]/50 transition-colors group">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Utensils className="h-3 w-3" /> Nutrition Protocol
                                </label>
                                <Select onValueChange={setSelectedDiet} value={selectedDiet}>
                                    <SelectTrigger className="bg-transparent border-none text-white h-10 p-0 focus:ring-0">
                                        <SelectValue placeholder="Select Diet Template..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#212121] border-zinc-800 text-white">
                                        {dietPlans.map(p => (
                                            <SelectItem key={p.id} value={p.id} className="focus:bg-[#cbfe00] focus:text-black">{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-[#cbfe00]/50 transition-colors group">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Dumbbell className="h-3 w-3" /> Training Protocol
                                </label>
                                <Select onValueChange={setSelectedWorkout} value={selectedWorkout}>
                                    <SelectTrigger className="bg-transparent border-none text-white h-10 p-0 focus:ring-0">
                                        <SelectValue placeholder="Select Workout Template..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#212121] border-zinc-800 text-white">
                                        {workoutPlans.map(p => (
                                            <SelectItem key={p.id} value={p.id} className="focus:bg-[#cbfe00] focus:text-black">{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Sleep & Recovery */}
                    <div className="bg-[#212121] p-8 rounded-[2rem] shadow-sm">
                        <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                            <span className="text-[#cbfe00] font-mono text-sm">03</span>
                            Sleep & Recovery Protocol
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Daily Water Intake Target</label>
                                <Input
                                    value={waterIntake}
                                    onChange={(e) => setWaterIntake(e.target.value)}
                                    placeholder="e.g. 3-4 Liters"
                                    className="bg-black/30 border-none text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-[#cbfe00]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sleep Hygiene Guidelines</label>
                                <Textarea
                                    value={sleepProtocol}
                                    onChange={(e) => setSleepProtocol(e.target.value)}
                                    placeholder="e.g. No caffeine after 2pm. Room temp 18°C. 7.5 hours minimum."
                                    className="bg-black/30 border-none text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-[#cbfe00] min-h-[120px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Stack (Supplements) */}
                <div className="space-y-6">
                    <Card className="bg-[#212121] text-white border-zinc-800 shadow-sm rounded-[2rem] p-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="h-10 w-10 rounded-full bg-[#cbfe00] flex items-center justify-center text-black">
                                    <Pill className="h-5 w-5" />
                                </div>
                                Supplement<br />Stack
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <Input
                                    placeholder="Name (e.g. Creatine)"
                                    className="mb-2 bg-transparent border-b border-zinc-700 rounded-none px-0 text-white placeholder:text-zinc-600 focus:border-[#cbfe00] focus:ring-0"
                                    id="suppName"
                                />
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Input placeholder="Dosage" className="bg-transparent border-b border-zinc-700 rounded-none px-0 text-white placeholder:text-zinc-600 focus:border-[#cbfe00] focus:ring-0" id="suppDose" />
                                    <Input placeholder="Timing" className="bg-transparent border-b border-zinc-700 rounded-none px-0 text-white placeholder:text-zinc-600 focus:border-[#cbfe00] focus:ring-0" id="suppTime" />
                                </div>
                                <Button
                                    onClick={() => {
                                        const nameEl = document.getElementById('suppName') as HTMLInputElement;
                                        const doseEl = document.getElementById('suppDose') as HTMLInputElement;
                                        const timeEl = document.getElementById('suppTime') as HTMLInputElement;
                                        if (nameEl && doseEl && timeEl && nameEl.value) {
                                            addSupplement(nameEl.value, doseEl.value, timeEl.value);
                                            nameEl.value = '';
                                            doseEl.value = '';
                                            timeEl.value = '';
                                        }
                                    }}
                                    className="w-full bg-white text-black hover:bg-[#cbfe00] font-bold rounded-lg h-10 transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add to Stack
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {supplements.map((s, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors group border border-transparent hover:border-zinc-700">
                                        <div>
                                            <p className="font-bold text-white text-sm">{s.name || "Untitled"}</p>
                                            <p className="text-xs text-zinc-500">{s.dosage} • {s.timing}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-transparent" onClick={() => removeSupplement(index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {supplements.length === 0 && (
                                    <p className="text-center text-zinc-600 text-xs py-4">No supplements added yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
