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
exports.default = EditWorkoutPlanPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const card_1 = require("@/components/ui/card");
const template_workout_plan_editor_1 = require("@/components/plans/template-workout-plan-editor");
const supabase_1 = require("@/lib/supabase");
// Add useParams to imports
const navigation_1 = require("next/navigation");
// Remove params prop
function EditWorkoutPlanPage() {
    const router = (0, navigation_1.useRouter)();
    // Use useParams hook to get params properly wrapped/unwrapped
    const params = (0, navigation_1.useParams)();
    const supabase = (0, supabase_1.createClient)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    // Form State
    const [name, setName] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const [level, setLevel] = (0, react_1.useState)("beginner");
    const [focus, setFocus] = (0, react_1.useState)("strength");
    const [frequency, setFrequency] = (0, react_1.useState)(3);
    const [structure, setStructure] = (0, react_1.useState)({ days: [] });
    const isNew = params.id === "new";
    (0, react_1.useEffect)(() => {
        if (!isNew) {
            // TODO: Fetch real data
            // const { data } = await supabase.from('workout_plans').select('*').eq('id', params.id).single()
            // Mock data
            setName("3 Day Beginner Upper/Lower Split");
            setDescription("Great for beginners starting their strength journey.");
            setLevel("beginner");
            setFocus("strength");
            setFrequency(3);
            setStructure({
                days: [
                    { day: "Day 1", focus: "Upper Body", exercises: [{ name: "Bench Press", sets: 3, reps: "8-10", rest: "90s" }] },
                    { day: "Day 2", focus: "Lower Body", exercises: [{ name: "Squat", sets: 3, reps: "8-10", rest: "90s" }] },
                    { day: "Day 3", focus: "Rest", exercises: [] },
                ]
            });
            setLoading(false);
        }
        else {
            setLoading(false);
        }
    }, [isNew]);
    const handleSave = () => __awaiter(this, void 0, void 0, function* () {
        setSaving(true);
        try {
            const { data: { user } } = yield supabase.auth.getUser();
            if (!user)
                throw new Error("No user logged in");
            // Get trainer_id (UUID) from trainers table
            // Get trainer_id (UUID) from trainers table
            const { data: trainer, error: trainerError } = yield supabase
                .from('trainers')
                .select('trainer_id')
                .eq('user_id', user.id)
                .single();
            let trainerId = trainer === null || trainer === void 0 ? void 0 : trainer.trainer_id;
            // If trainer not found, we cannot proceed effectively.
            if (!trainerId) {
                console.warn('[WorkoutPlan] Trainer profile not found. Using user ID as fallback or creating default...');
                // Fallback to user.id if it's a valid UUID, assuming potential trainer_id=user.id mapping
                trainerId = user.id;
            }
            // Strict UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(trainerId)) {
                throw new Error(`Invalid Trainer UUID: ${trainerId}`);
            }
            const payload = {
                trainer_id: trainerId, // Use validated UUID trainer_id
                name,
                level,
                focus,
                frequency_per_week: frequency,
                plan_type: 'template',
                is_active: true,
                structure,
                description
            };
            if (isNew) {
                const { error } = yield supabase.from('workout_plans').insert([payload]);
                if (error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
            }
            else {
                if (!params.id || params.id === 'undefined') {
                    throw new Error("Invalid Plan ID for update");
                }
                const { error } = yield supabase.from('workout_plans').update(payload).eq('id', params.id);
                if (error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
            }
            alert("Plan saved successfully!");
            router.push("/dashboard/plans/workouts");
        }
        catch (error) {
            console.error(error);
            alert(`Failed to save plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setSaving(false);
        }
    });
    if (loading)
        return <div className="p-8">Loading...</div>;
    return (<div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button_1.Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <lucide_react_1.ArrowLeft className="h-4 w-4"/>
                    </button_1.Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isNew ? "Create New Workout Plan" : "Edit Workout Plan"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isNew ? "Design a new training program." : `Editing: ${name}`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button_1.Button variant="outline" onClick={() => router.back()}>Discard</button_1.Button>
                    <button_1.Button onClick={handleSave} disabled={saving}>
                        <lucide_react_1.Save className="mr-2 h-4 w-4"/>
                        {saving ? "Saving..." : "Save Plan"}
                    </button_1.Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Main Editor */}
                <div className="space-y-6">
                    <card_1.Card>
                        <card_1.CardHeader>
                            <card_1.CardTitle className="text-base">Plan Details</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label_1.Label htmlFor="name">Plan Name</label_1.Label>
                                <input_1.Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 5 Day Hypertrophy"/>
                            </div>
                            <div className="grid gap-2">
                                <label_1.Label htmlFor="description">Description</label_1.Label>
                                <textarea_1.Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the goal and structure..."/>
                            </div>
                        </card_1.CardContent>
                    </card_1.Card>

                    <card_1.Card>
                        <card_1.CardHeader className="flex flex-row items-center justify-between">
                            <card_1.CardTitle className="text-base">Weekly Schedule</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent>
                            <template_workout_plan_editor_1.TemplateWorkoutPlanEditor initialStructure={structure} onChange={setStructure}/>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <card_1.Card>
                        <card_1.CardHeader>
                            <card_1.CardTitle className="text-sm">Configuration</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label_1.Label>Level</label_1.Label>
                                <select_1.Select value={level} onValueChange={setLevel}>
                                    <select_1.SelectTrigger>
                                        <select_1.SelectValue />
                                    </select_1.SelectTrigger>
                                    <select_1.SelectContent>
                                        <select_1.SelectItem value="beginner">Beginner</select_1.SelectItem>
                                        <select_1.SelectItem value="intermediate">Intermediate</select_1.SelectItem>
                                        <select_1.SelectItem value="advanced">Advanced</select_1.SelectItem>
                                    </select_1.SelectContent>
                                </select_1.Select>
                            </div>

                            <div className="grid gap-2">
                                <label_1.Label>Focus</label_1.Label>
                                <select_1.Select value={focus} onValueChange={setFocus}>
                                    <select_1.SelectTrigger>
                                        <select_1.SelectValue />
                                    </select_1.SelectTrigger>
                                    <select_1.SelectContent>
                                        <select_1.SelectItem value="strength">Strength</select_1.SelectItem>
                                        <select_1.SelectItem value="hypertrophy">Hypertrophy</select_1.SelectItem>
                                        <select_1.SelectItem value="fat_loss">Fat Loss</select_1.SelectItem>
                                        <select_1.SelectItem value="endurance">Endurance</select_1.SelectItem>
                                    </select_1.SelectContent>
                                </select_1.Select>
                            </div>

                            <div className="grid gap-2">
                                <label_1.Label>Frequency (Days/Week)</label_1.Label>
                                <input_1.Input type="number" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} max={7} min={1}/>
                            </div>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>
            </div>
        </div>);
}
