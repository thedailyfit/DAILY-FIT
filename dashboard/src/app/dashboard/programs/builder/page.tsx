'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Dumbbell, Utensils, Pill, Minus } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProgramBuilderPage() {
    const supabase = createClient();
    const router = useRouter();

    // Stage 1: Basic Info
    const [programName, setProgramName] = useState("");
    const [programDesc, setProgramDesc] = useState("");

    // Stage 2: Core Protocols
    const [dietMode, setDietMode] = useState<"library" | "custom">("library");
    const [workoutMode, setWorkoutMode] = useState<"library" | "custom">("library");

    const [selectedDiet, setSelectedDiet] = useState<string>("");
    const [customDiet, setCustomDiet] = useState({ name: "", details: "" });

    const [selectedWorkout, setSelectedWorkout] = useState<string>("");
    const [customWorkout, setCustomWorkout] = useState({ name: "", details: "" });

    // Stage 3: Supplements (Array)
    const [supplements, setSupplements] = useState<any[]>([]);

    // Stage 4: Sleep & Recovery
    const [sleepProtocol, setSleepProtocol] = useState("");
    const [waterIntake, setWaterIntake] = useState("");

    // Real Data for Dropdowns
    const [dietPlans, setDietPlans] = useState<any[]>([]);
    const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch Library Items
    useEffect(() => {
        async function fetchLibrary() {
            try {
                const { data: dPoints } = await supabase.from('diet_plans').select('id, name');
                const { data: wPoints } = await supabase.from('workout_plans').select('id, name');
                setDietPlans(dPoints || []);
                setWorkoutPlans(wPoints || []);
            } catch (e) {
                console.error("Library fetch fail", e);
            } finally {
                setFetching(false);
            }
        }
        fetchLibrary();
    }, [supabase]);

    const addSupplement = (name: string, dosage: string, timing: string) => {
        setSupplements([...supplements, { name, dosage, timing }]);
    };

    const removeSupplement = (index: number) => {
        const newSupps = [...supplements];
        newSupps.splice(index, 1);
        setSupplements(newSupps);
    };

    const handleSave = async () => {
        if (!programName) {
            alert("Please enter a Program Name");
            return;
        }
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const payload = {
                trainer_id: user.id,
                name: programName,
                description: programDesc,
                diet_plan_id: dietMode === "library" ? (selectedDiet || null) : null,
                workout_plan_id: workoutMode === "library" ? (selectedWorkout || null) : null,
                custom_diet: dietMode === "custom" ? customDiet : null,
                custom_workout: workoutMode === "custom" ? customWorkout : null,
                supplements: supplements,
                recovery_protocol: { sleep: sleepProtocol, water: waterIntake },
                is_active: true
            };

            const { error } = await supabase.from('plan_programs').insert([payload]);

            if (error) throw error;

            alert("Master Program Saved Successfully!");
            router.push("/dashboard/plans");

        } catch (error: any) {
            console.error("Save Error:", error);
            alert("Failed to save program: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen p-8 flex items-center justify-center text-muted-foreground bg-background">Loading Builder Resources...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-background text-foreground">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tight mb-2">Master Program Builder</h1>
                    <p className="text-muted-foreground font-medium">Create comprehensive protocols for your clients.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 shadow-lg transition-all rounded-xl"
                >
                    {loading ? "Saving..." : "Save Master Program"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Builder) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Step 1: Program Identity */}
                    <div className="bg-card p-8 rounded-[2rem] shadow-sm border border-border">
                        <h2 className="font-bold text-card-foreground text-xl mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">01</span>
                            Program Identity
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Program Name</label>
                                <Input
                                    value={programName}
                                    onChange={(e) => setProgramName(e.target.value)}
                                    placeholder="e.g. 12 Week Shred Transformation"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground h-14 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description / Notes</label>
                                <Textarea
                                    value={programDesc}
                                    onChange={(e) => setProgramDesc(e.target.value)}
                                    placeholder="Brief overview of this phase..."
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[80px] rounded-xl focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Core Protocols */}
                    <div className="bg-card p-8 rounded-[2rem] shadow-sm border border-border">
                        <h2 className="font-bold text-card-foreground text-xl mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">02</span>
                            Core Protocols
                        </h2>

                        {/* Diet Section */}
                        <div className="mb-8 p-6 rounded-2xl bg-muted/30 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                    <Utensils className="h-4 w-4" /> Nutrition Protocol
                                </label>
                                <Tabs value={dietMode} onValueChange={(v) => setDietMode(v as any)} className="w-[200px]">
                                    <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
                                        <TabsTrigger value="library" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">Library</TabsTrigger>
                                        <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">Custom</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {dietMode === "library" ? (
                                <Select onValueChange={setSelectedDiet} value={selectedDiet}>
                                    <SelectTrigger className="bg-background border-input text-foreground h-12">
                                        <SelectValue placeholder="Select from Diet Library..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-card-foreground">
                                        {dietPlans.length > 0 ? dietPlans.map(p => (
                                            <SelectItem key={p.id} value={p.id} className="focus:bg-primary focus:text-primary-foreground">{p.name}</SelectItem>
                                        )) : <div className="p-2 text-xs text-muted-foreground">No plans found</div>}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Custom Diet Name"
                                        className="bg-background border-input text-foreground h-12"
                                        value={customDiet.name}
                                        onChange={(e) => setCustomDiet({ ...customDiet, name: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="Enter macros, meal timing, or specific instructions..."
                                        className="bg-background border-input text-foreground min-h-[100px]"
                                        value={customDiet.details}
                                        onChange={(e) => setCustomDiet({ ...customDiet, details: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Workout Section */}
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                    <Dumbbell className="h-4 w-4" /> Training Protocol
                                </label>
                                <Tabs value={workoutMode} onValueChange={(v) => setWorkoutMode(v as any)} className="w-[200px]">
                                    <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
                                        <TabsTrigger value="library" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">Library</TabsTrigger>
                                        <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">Custom</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {workoutMode === "library" ? (
                                <Select onValueChange={setSelectedWorkout} value={selectedWorkout}>
                                    <SelectTrigger className="bg-background border-input text-foreground h-12">
                                        <SelectValue placeholder="Select from Workout Library..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-card-foreground">
                                        {workoutPlans.length > 0 ? workoutPlans.map(p => (
                                            <SelectItem key={p.id} value={p.id} className="focus:bg-primary focus:text-primary-foreground">{p.name}</SelectItem>
                                        )) : <div className="p-2 text-xs text-muted-foreground">No plans found</div>}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Custom Workout Name"
                                        className="bg-background border-input text-foreground h-12"
                                        value={customWorkout.name}
                                        onChange={(e) => setCustomWorkout({ ...customWorkout, name: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="Enter splits, exercises, sets/reps..."
                                        className="bg-background border-input text-foreground min-h-[100px]"
                                        value={customWorkout.details}
                                        onChange={(e) => setCustomWorkout({ ...customWorkout, details: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Sleep & Recovery */}
                    <div className="bg-card p-8 rounded-[2rem] shadow-sm border border-border">
                        <h2 className="font-bold text-card-foreground text-xl mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">03</span>
                            Recovery & Lifestyle
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Water Intake</label>
                                <Input
                                    value={waterIntake}
                                    onChange={(e) => setWaterIntake(e.target.value)}
                                    placeholder="e.g. 4 Liters"
                                    className="bg-background border-input text-foreground focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sleep Target</label>
                                <Input
                                    placeholder="e.g. 8 Hours"
                                    className="bg-background border-input text-foreground focus:ring-primary"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sleep Hygiene / Notes</label>
                                <Textarea
                                    value={sleepProtocol}
                                    onChange={(e) => setSleepProtocol(e.target.value)}
                                    placeholder="Specific recovery instructions..."
                                    className="bg-background border-input text-foreground min-h-[100px] focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Supplements) */}
                <div className="space-y-8">
                    <Card className="bg-card text-card-foreground border-border shadow-md rounded-[2rem] overflow-hidden sticky top-8">
                        <div className="h-2 w-full bg-primary"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary">
                                    <Pill className="h-4 w-4" />
                                </div>
                                Supplement Stack
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                <Input
                                    placeholder="Name (e.g. Whey Protein)"
                                    className="mb-2 bg-transparent border-b border-input rounded-none px-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                                    id="suppName"
                                />
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Input placeholder="Dosage" className="bg-transparent border-b border-input rounded-none px-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0" id="suppDose" />
                                    <Input placeholder="Timing" className="bg-transparent border-b border-input rounded-none px-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0" id="suppTime" />
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
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg h-10 transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {supplements.map((s, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-background rounded-xl border border-border hover:border-primary transition-all group">
                                        <div>
                                            {s.name ? (
                                                <p className="font-bold text-foreground text-sm">{s.name}</p>
                                            ) : (
                                                <p className="font-bold text-muted-foreground text-sm italic">New Item</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">{s.dosage || "-"} • {s.timing || "-"}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-transparent" onClick={() => removeSupplement(index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {supplements.length === 0 && (
                                    <div className="text-center py-8 opacity-50 border-2 border-dashed border-border rounded-xl">
                                        <p className="text-xs text-muted-foreground">No supplements added.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
