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
exports.LogProgressDialog = LogProgressDialog;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const slider_1 = require("@/components/ui/slider");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const formSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    weight: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Weight must be a positive number",
    }),
    bodyFat: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100), {
        message: "Body fat must be between 0 and 100",
    }),
    adherence: z.number().min(1).max(10).optional(),
    notes: z.string().optional(),
});
function LogProgressDialog({ clientId }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            weight: "",
            bodyFat: "",
            adherence: 8,
            notes: "",
        },
    });
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = yield supabase
                    .from('client_progress_entries')
                    .insert({
                    client_id: clientId,
                    date: values.date,
                    weight_kg: parseFloat(values.weight),
                    body_fat_percentage: values.bodyFat ? parseFloat(values.bodyFat) : null,
                    adherence_score: values.adherence || null,
                    notes: values.notes || null,
                });
                if (error) {
                    throw error;
                }
                setOpen(false);
                form.reset();
                router.refresh();
            }
            catch (error) {
                console.error("Error logging progress:", error);
                alert("Failed to log progress. Please try again.");
            }
        });
    }
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button size="sm">
                    <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                    Log Progress
                </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Log Client Progress</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Record a new weight, body composition, or adherence entry.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form_1.Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <form_1.FormField control={form.control} name="date" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Date</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input type="date" {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <div className="grid grid-cols-2 gap-4">
                            <form_1.FormField control={form.control} name="weight" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>Weight (kg)</form_1.FormLabel>
                                        <form_1.FormControl>
                                            <input_1.Input type="number" step="0.1" placeholder="e.g. 75.5" {...field}/>
                                        </form_1.FormControl>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                            <form_1.FormField control={form.control} name="bodyFat" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>Body Fat % (Optional)</form_1.FormLabel>
                                        <form_1.FormControl>
                                            <input_1.Input type="number" step="0.1" placeholder="e.g. 15.0" {...field}/>
                                        </form_1.FormControl>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                        </div>

                        <form_1.FormField control={form.control} name="adherence" render={({ field: { value, onChange } }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Adherence Score (1-10)</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <div className="flex items-center gap-4">
                                            <slider_1.Slider min={1} max={10} step={1} value={[value || 8]} onValueChange={(vals) => onChange(vals[0])} className="flex-1"/>
                                            <span className="w-8 text-center font-medium">{value}</span>
                                        </div>
                                    </form_1.FormControl>
                                    <form_1.FormDescription className="text-xs">
                                        How well did they stick to the plan?
                                    </form_1.FormDescription>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>

                        <form_1.FormField control={form.control} name="notes" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Notes (Optional)</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <textarea_1.Textarea placeholder="How are they feeling?" {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <dialog_1.DialogFooter>
                            <button_1.Button type="submit">Save Entry</button_1.Button>
                        </dialog_1.DialogFooter>
                    </form>
                </form_1.Form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
