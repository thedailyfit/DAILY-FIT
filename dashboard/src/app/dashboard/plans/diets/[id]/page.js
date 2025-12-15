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
exports.default = EditDietPlanPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const card_1 = require("@/components/ui/card");
const template_meal_plan_editor_1 = require("@/components/plans/template-meal-plan-editor");
const supabase_1 = require("@/lib/supabase");
// Add useParams to imports
const navigation_1 = require("next/navigation");
// Remove params prop
function EditDietPlanPage() {
    const router = (0, navigation_1.useRouter)();
    // Use useParams hook to get params properly wrapped/unwrapped
    const params = (0, navigation_1.useParams)();
    const supabase = (0, supabase_1.createClient)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    // Form State
    const [name, setName] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const [goal, setGoal] = (0, react_1.useState)("fat_loss");
    const [dietPreference, setDietPreference] = (0, react_1.useState)("veg");
    const [totalCalories, setTotalCalories] = (0, react_1.useState)(1500);
    const [protein, setProtein] = (0, react_1.useState)(0); // New Protein State
    const [structure, setStructure] = (0, react_1.useState)({ meals: [] });
    const isNew = params.id === "new";
    (0, react_1.useEffect)(() => {
        const fetchPlan = () => __awaiter(this, void 0, void 0, function* () {
            if (!isNew) {
                try {
                    const { data, error } = yield supabase
                        .from('diet_plans')
                        .select('*')
                        .eq('id', params.id)
                        .single();
                    if (error)
                        throw error;
                    if (data) {
                        setName(data.name);
                        setDescription(data.description || ""); // Assuming description column exists or mapped
                        setGoal(data.goal || "fat_loss");
                        setDietPreference(data.diet_preference || "veg");
                        setTotalCalories(data.total_calories || 1500);
                        setProtein(data.protein || 0); // New Protein Field
                        setStructure(data.structure || { meals: [] });
                    }
                }
                catch (error) {
                    console.error("Error fetching plan:", error);
                    alert("Failed to load plan details.");
                }
                finally {
                    setLoading(false);
                }
            }
            else {
                setLoading(false);
            }
        });
        fetchPlan();
    }, [isNew, params.id, supabase]);
    const handleSave = () => __awaiter(this, void 0, void 0, function* () {
        setSaving(true);
        console.log('[DietPlan] Starting save...');
        try {
            // Validate required fields
            if (!name || name.trim() === '') {
                throw new Error("Plan name is required");
            }
            console.log('[DietPlan] Getting user...');
            const { data: { user }, error: userError } = yield supabase.auth.getUser();
            if (userError)
                throw new Error(`Auth error: ${userError.message}`);
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
                console.warn('[DietPlan] Trainer profile not found for user. Creating default...');
                // Try to create a trainer profile on the fly? 
                // Alternatively, error out telling user to go to settings.
                // Let's error out for safety, or check if 'trainers' table uses user.id as PK (it doesn't, it uses a separate UUID usually, or maybe it DOES?).
                // looking at settings page: .eq('trainer_id', user.id) implies trainer_id IS user.id in some contexts?
                // The task.md said "Convert trainer_id to UUID".
                // In early migrations, we might have set trainer_id = user.id.
                // Let's try to use user.id As trainer_id as a fallback IF it is a valid UUID.
                trainerId = user.id;
            }
            // Strict UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(trainerId)) {
                throw new Error(`Invalid Trainer UUID: ${trainerId}`);
            }
            const payload = {
                trainer_id: trainerId,
                name: name.trim(),
                goal,
                total_calories: totalCalories,
                protein, // Add protein to payload
                diet_preference: dietPreference,
                plan_type: 'template',
                is_active: true,
                structure,
                // description // If DB has description
            };
            console.log('[DietPlan] Payload:', JSON.stringify(payload, null, 2));
            if (isNew) {
                console.log('[DietPlan] Inserting new plan...');
                const { data, error } = yield supabase.from('diet_plans').insert([payload]).select();
                if (error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
                console.log('[DietPlan] Insert successful:', data);
            }
            else {
                console.log('[DietPlan] Updating existing plan...');
                if (!params.id || params.id === 'undefined')
                    throw new Error("Invalid Plan ID for update");
                const { data, error } = yield supabase.from('diet_plans').update(payload).eq('id', params.id).select();
                if (error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
                console.log('[DietPlan] Update successful:', data);
            }
            alert("Plan saved successfully!");
            router.push("/dashboard/plans/diets");
        }
        catch (error) {
            console.error('[DietPlan] Save failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to save plan: ${errorMessage}`);
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
                            {isNew ? "Create New Diet Plan" : "Edit Diet Plan"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isNew ? "Design a new nutrition template." : `Editing: ${name}`}
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
                                <input_1.Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 12 Week Fat Loss"/>
                            </div>
                            <div className="grid gap-2">
                                <label_1.Label htmlFor="description">Description</label_1.Label>
                                <textarea_1.Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe who this plan is for..."/>
                            </div>
                        </card_1.CardContent>
                    </card_1.Card>

                    <card_1.Card>
                        <card_1.CardHeader>
                            <card_1.CardTitle className="text-base">Meal Structure</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent>
                            <template_meal_plan_editor_1.TemplateMealPlanEditor initialStructure={structure} onChange={setStructure}/>
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
                                <label_1.Label>Goal</label_1.Label>
                                <select_1.Select value={goal} onValueChange={setGoal}>
                                    <select_1.SelectTrigger>
                                        <select_1.SelectValue />
                                    </select_1.SelectTrigger>
                                    <select_1.SelectContent>
                                        <select_1.SelectItem value="fat_loss">Fat Loss</select_1.SelectItem>
                                        <select_1.SelectItem value="muscle_gain">Muscle Gain</select_1.SelectItem>
                                        <select_1.SelectItem value="maintenance">Maintenance</select_1.SelectItem>
                                    </select_1.SelectContent>
                                </select_1.Select>
                            </div>

                            <div className="grid gap-2">
                                <label_1.Label>Diet Preference</label_1.Label>
                                <select_1.Select value={dietPreference} onValueChange={setDietPreference}>
                                    <select_1.SelectTrigger>
                                        <select_1.SelectValue />
                                    </select_1.SelectTrigger>
                                    <select_1.SelectContent>
                                        <select_1.SelectItem value="veg">Vegetarian</select_1.SelectItem>
                                        <select_1.SelectItem value="non_veg">Non-Vegetarian</select_1.SelectItem>
                                        <select_1.SelectItem value="vegan">Vegan</select_1.SelectItem>
                                        <select_1.SelectItem value="egg">Eggetarian</select_1.SelectItem>
                                    </select_1.SelectContent>
                                </select_1.Select>
                            </div>

                            <div className="grid gap-2">
                                <label_1.Label>Total Calories</label_1.Label>
                                <input_1.Input type="number" value={totalCalories} onChange={(e) => setTotalCalories(Number(e.target.value))}/>
                            </div>

                            {/* New Protein Input */}
                            <div className="grid gap-2">
                                <label_1.Label>Protein (g)</label_1.Label>
                                <input_1.Input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} placeholder="e.g. 150"/>
                            </div>

                        </card_1.CardContent>
                    </card_1.Card>
                </div>
            </div>
        </div>);
}
