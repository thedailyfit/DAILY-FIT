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
exports.default = SettingsProfilePage;
const react_1 = require("react");
const zod_1 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const separator_1 = require("@/components/ui/separator");
const supabase_1 = require("@/lib/supabase");
const lucide_react_1 = require("lucide-react");
const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }).optional(),
    age: z.number().min(18).optional(),
    phone_number: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }).optional(),
    city: z.string().min(2).optional(),
});
function SettingsProfilePage() {
    const supabase = (0, supabase_1.createClient)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(profileFormSchema),
        defaultValues: {
            name: "",
            email: "",
            age: undefined,
            phone_number: "",
            city: "",
        },
    });
    (0, react_1.useEffect)(() => {
        function loadProfile() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: { user } } = yield supabase.auth.getUser();
                    if (!user)
                        return;
                    const { data: trainer } = yield supabase
                        .from('trainers')
                        .select('*')
                        .eq('trainer_id', user.id)
                        .single();
                    if (trainer) {
                        form.reset({
                            name: trainer.name || "",
                            email: user.email || "", // Email usually comes from auth user
                            age: trainer.age,
                            phone_number: trainer.phone_number || "",
                            city: trainer.city || "",
                        });
                    }
                }
                catch (error) {
                    console.error("Error loading profile:", error);
                }
                finally {
                    setIsLoading(false);
                }
            });
        }
        loadProfile();
    }, [supabase, form]);
    function onSubmit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            setIsSaving(true);
            try {
                const { data: { user } } = yield supabase.auth.getUser();
                if (!user)
                    throw new Error("No user found");
                const { error } = yield supabase
                    .from('trainers')
                    .update({
                    name: data.name,
                    age: data.age,
                    phone_number: data.phone_number,
                    city: data.city,
                })
                    .eq('trainer_id', user.id);
                if (error)
                    throw error;
                alert("Profile updated successfully!");
            }
            catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile. Please try again.");
            }
            finally {
                setIsSaving(false);
            }
        });
    }
    if (isLoading) {
        return <div className="flex justify-center p-8"><lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/></div>;
    }
    return (<div className="space-y-6 max-w-2xl mx-auto py-10">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <separator_1.Separator />
            <form_1.Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
                                <form_1.FormLabel>Name</form_1.FormLabel>
                                <form_1.FormControl>
                                    <input_1.Input placeholder="Your name" {...field}/>
                                </form_1.FormControl>
                                <form_1.FormDescription>
                                    This is your public display name.
                                </form_1.FormDescription>
                                <form_1.FormMessage />
                            </form_1.FormItem>)}/>
                    <div className="grid grid-cols-2 gap-4">
                        <form_1.FormField control={form.control} name="age" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>Age</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input type="number" placeholder="30" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                        <form_1.FormField control={form.control} name="city" render={({ field }) => (<form_1.FormItem>
                                    <form_1.FormLabel>City</form_1.FormLabel>
                                    <form_1.FormControl>
                                        <input_1.Input placeholder="New York" {...field}/>
                                    </form_1.FormControl>
                                    <form_1.FormMessage />
                                </form_1.FormItem>)}/>
                    </div>
                    <form_1.FormField control={form.control} name="phone_number" render={({ field }) => (<form_1.FormItem>
                                <form_1.FormLabel>Phone Number</form_1.FormLabel>
                                <form_1.FormControl>
                                    <input_1.Input placeholder="+1234567890" {...field}/>
                                </form_1.FormControl>
                                <form_1.FormMessage />
                            </form_1.FormItem>)}/>
                    <button_1.Button type="submit" disabled={isSaving}>
                        {isSaving && <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save Changes
                    </button_1.Button>
                </form>
            </form_1.Form>
        </div>);
}
