"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AssignPlanDialog = AssignPlanDialog;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const form_1 = require("@/components/ui/form");
const select_1 = require("@/components/ui/select");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
const calendar_1 = require("@/components/ui/calendar");
const popover_1 = require("@/components/ui/popover");
const utils_1 = require("@/lib/utils");
const whatsapp_notifier_1 = require("@/lib/whatsapp-notifier");
const formSchema = z.object({
    programType: z.enum(["diet", "workout"]),
    planId: z.string().min(1, "Please select a plan."),
    startDate: z.date(),
});
function AssignPlanDialog({ clientId, clientName }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [dietPlans, setDietPlans] = (0, react_1.useState)([]);
    const [workoutPlans, setWorkoutPlans] = (0, react_1.useState)([]);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            programType: "diet",
            startDate: new Date(),
        },
    });
    const programType = form.watch("programType");
    (0, react_1.useEffect)(() => {
        if (open) {
            const fetchPlans = () => __awaiter(this, void 0, void 0, function* () {
                const { data: diets } = yield supabase.from('diet_plans').select('id, name').eq('is_active', true);
                const { data: workouts } = yield supabase.from('workout_plans').select('id, name').eq('is_active', true);
                if (diets)
                    setDietPlans(diets);
                if (workouts)
                    setWorkoutPlans(workouts);
            });
            fetchPlans();
        }
    }, [open, supabase]);
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { data: { user } } = yield supabase.auth.getUser();
                if (!user)
                    throw new Error("No user logged in");
                // Get trainer_id (UUID) from trainers table correctly
                const { data: trainer, error: trainerError } = yield supabase
                    .from('trainers')
                    .select('trainer_id')
                    .eq('user_id', user.id)
                    .single();
                let trainerId = trainer === null || trainer === void 0 ? void 0 : trainer.trainer_id;
                // Fallback/Error if trainer not found
                if (!trainerId) {
                    console.warn('[AssignPlan] Trainer profile not found. Using user ID as fallback...');
                    trainerId = user.id;
                }
                // 1. Create a plan_program wrapper
                // Ideally, we should select an existing plan_program or create one on the fly.
                // For this simplified flow, we'll create a new plan_program for this assignment if one doesn't exist for this plan.
                // OR, we can just create a new plan_program every time to represent this specific assignment instance.
                // Let's create a new plan_program to keep it simple and robust.
                const planName = values.programType === 'diet'
                    ? (_a = dietPlans.find(p => p.id === values.planId)) === null || _a === void 0 ? void 0 : _a.name
                    : (_b = workoutPlans.find(p => p.id === values.planId)) === null || _b === void 0 ? void 0 : _b.name;
                const { data: programData, error: programError } = yield supabase
                    .from('plan_programs')
                    .insert({
                    trainer_id: trainerId,
                    name: `${planName} for ${clientName}`,
                    diet_plan_id: values.programType === 'diet' ? values.planId : null,
                    workout_plan_id: values.programType === 'workout' ? values.planId : null,
                    status: 'active'
                })
                    .select()
                    .single();
                if (programError)
                    throw new Error(`Failed to create program: ${programError.message}`);
                // 2. Link to client
                const { error: linkError } = yield supabase
                    .from('client_programs')
                    .insert({
                    client_id: clientId,
                    program_id: programData.id,
                    start_date: (0, date_fns_1.format)(values.startDate, 'yyyy-MM-dd'),
                    status: 'active',
                    is_current: true
                });
                if (linkError)
                    throw linkError;
                // 3. Send WhatsApp notification
                yield (0, whatsapp_notifier_1.notifyClientPlanUpdate)({
                    clientId,
                    planType: values.programType,
                    planName: planName || 'New Plan',
                    action: 'assigned'
                });
                setOpen(false);
                form.reset();
                router.refresh();
                alert("Plan assigned successfully!");
            }
            catch (error) {
                console.error("Error assigning plan:", error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                alert(`Failed to assign plan: ${errorMessage}`);
            }
        });
    }
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button variant="outline" size="sm">
                    Assign Plan
                </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Assign Plan to {clientName}</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Select a diet or workout plan to assign.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form_1.Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <form_1.FormField control={form.control} name="programType" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Type</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger>
                                                <select_1.SelectValue placeholder="Select type"/>
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent>
                                            <select_1.SelectItem value="diet">
                                                <div className="flex items-center">
                                                    <lucide_react_1.Utensils className="mr-2 h-4 w-4"/> Diet Plan
                                                </div>
                                            </select_1.SelectItem>
                                            <select_1.SelectItem value="workout">
                                                <div className="flex items-center">
                                                    <lucide_react_1.Dumbbell className="mr-2 h-4 w-4"/> Workout Plan
                                                </div>
                                            </select_1.SelectItem>
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>

                        <form_1.FormField control={form.control} name="planId" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Select Plan</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger>
                                                <select_1.SelectValue placeholder="Choose a plan"/>
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent>
                                            {programType === 'diet' ? (dietPlans.map(plan => (<select_1.SelectItem key={plan.id} value={plan.id}>{plan.name}</select_1.SelectItem>))) : (workoutPlans.map(plan => (<select_1.SelectItem key={plan.id} value={plan.id}>{plan.name}</select_1.SelectItem>)))}
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>

                        <form_1.FormField control={form.control} name="startDate" render={({ field }) => (<form_1.FormItem className="flex flex-col">
                                    <form_1.FormLabel>Start Date</form_1.FormLabel>
                                    <popover_1.Popover>
                                        <popover_1.PopoverTrigger asChild>
                                            <form_1.FormControl>
                                                <button_1.Button variant={"outline"} className={(0, utils_1.cn)("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? ((0, date_fns_1.format)(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                    <lucide_react_1.CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </button_1.Button>
                                            </form_1.FormControl>
                                        </popover_1.PopoverTrigger>
                                        <popover_1.PopoverContent className="w-auto p-0" align="start">
                                            <calendar_1.Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus/>
                                        </popover_1.PopoverContent>
                                    </popover_1.Popover>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>

                        <dialog_1.DialogFooter>
                            <button_1.Button type="submit">Assign Plan</button_1.Button>
                        </dialog_1.DialogFooter>
                    </form>
                </form_1.Form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
