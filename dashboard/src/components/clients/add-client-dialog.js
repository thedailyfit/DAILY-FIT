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
exports.AddClientDialog = AddClientDialog;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }).optional().or(z.literal('')),
    whatsapp_number: z.string().min(10, {
        message: "WhatsApp number must be at least 10 digits.",
    }),
    gender: z.string().min(1, {
        message: "Please select a gender.",
    }),
    goal: z.string().optional(),
    status: z.string(),
});
function AddClientDialog() {
    const [open, setOpen] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, supabase_1.createClient)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            name: "",
            email: "",
            whatsapp_number: "",
            gender: "",
            goal: "",
            status: "Active",
        },
    });
    function onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { user } } = yield supabase.auth.getUser();
                if (!user) {
                    throw new Error("No user logged in");
                }
                // Get trainer_id (UUID) from trainers table
                // For now, use the first trainer (you can add user matching later)
                const { data: trainer, error: trainerError } = yield supabase
                    .from('trainers')
                    .select('trainer_id')
                    .limit(1)
                    .single();
                if (trainerError || !trainer) {
                    throw new Error("No trainer found. Please create a trainer account first.");
                }
                const { error } = yield supabase.from('members').insert({
                    trainer_id: trainer.trainer_id, // Use UUID trainer_id
                    name: values.name,
                    email: values.email || null,
                    whatsapp_id: values.whatsapp_number,
                    phone_number: values.whatsapp_number,
                    gender: values.gender,
                    goal: values.goal,
                    status: values.status,
                });
                if (error) {
                    throw error;
                }
                setOpen(false);
                form.reset();
                router.refresh();
                alert("Client added successfully!");
            }
            catch (error) {
                console.error("Error adding client:", error);
                alert(`Failed to add client: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button>
                    <lucide_react_1.Plus className="mr-2 h-4 w-4"/> Add Client
                </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Add New Client</dialog_1.DialogTitle>
                    <dialog_1.DialogDescription>
                        Enter the details of the new client here. Click save when you're done.
                    </dialog_1.DialogDescription>
                </dialog_1.DialogHeader>
                <form_1.Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Name</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input placeholder="John Doe" {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <div className="grid grid-cols-2 gap-4">
                            <form_1.FormField control={form.control} name="whatsapp_number" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>WhatsApp Number</form_1.FormLabel>
                                        <form_1.FormControl>
                                            <input_1.Input placeholder="+91 9876543210" {...field}/>
                                        </form_1.FormControl>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                            <form_1.FormField control={form.control} name="gender" render={({ field }) => (<form_1.FormItem>
                                        <form_1.FormLabel>Gender</form_1.FormLabel>
                                        <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <form_1.FormControl>
                                                <select_1.SelectTrigger>
                                                    <select_1.SelectValue placeholder="Select"/>
                                                </select_1.SelectTrigger>
                                            </form_1.FormControl>
                                            <select_1.SelectContent>
                                                <select_1.SelectItem value="male">Male</select_1.SelectItem>
                                                <select_1.SelectItem value="female">Female</select_1.SelectItem>
                                                <select_1.SelectItem value="other">Other</select_1.SelectItem>
                                            </select_1.SelectContent>
                                        </select_1.Select>
                                        <form_1.FormMessage />
                                    </form_1.FormItem>)}/>
                        </div>
                        <form_1.FormField control={form.control} name="email" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Email (Optional)</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input placeholder="john@example.com" {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <form_1.FormField control={form.control} name="goal" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Goal</form_1.FormLabel>
                                    <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <form_1.FormControl>
                                            <select_1.SelectTrigger>
                                                <select_1.SelectValue placeholder="Select a goal"/>
                                            </select_1.SelectTrigger>
                                        </form_1.FormControl>
                                        <select_1.SelectContent>
                                            <select_1.SelectItem value="fat_loss">Fat Loss</select_1.SelectItem>
                                            <select_1.SelectItem value="muscle_gain">Muscle Gain</select_1.SelectItem>
                                            <select_1.SelectItem value="maintenance">Maintenance</select_1.SelectItem>
                                            <select_1.SelectItem value="strength">Strength</select_1.SelectItem>
                                            <select_1.SelectItem value="endurance">Endurance</select_1.SelectItem>
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <dialog_1.DialogFooter>
                            <button_1.Button type="submit">Save Client</button_1.Button>
                        </dialog_1.DialogFooter>
                    </form>
                </form_1.Form>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
}
