"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().optional(),
    whatsapp_number: z.string().min(10, { message: "WhatsApp number must be at least 10 digits." }),
    gender: z.string().min(1, { message: "Please select a gender." }),
    goal: z.string().min(1, { message: "Select a goal." }),
    custom_goal: z.string().optional(),
    age: z.coerce.number().min(1).optional(),
    height: z.coerce.number().min(1).optional(),
    weight: z.coerce.number().min(1).optional(),
    monthly_fee: z.coerce.number().min(0),
    dietPlanId: z.string().optional(),
    workoutPlanId: z.string().optional(),
    status: z.string(),
})

interface AddClientDialogProps {
    dietPlans?: { id: string, name: string }[];
    workoutPlans?: { id: string, name: string }[];
}

export function AddClientDialog({ dietPlans = [], workoutPlans = [] }: AddClientDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            whatsapp_number: "",
            gender: "",
            goal: "",
            custom_goal: "", // For "Other"
            monthly_fee: 0,
            status: "Active",
            dietPlanId: "",
            workoutPlanId: "",
        },
    })

    const selectedGoal = form.watch("goal");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user logged in")

            // Get trainer_id
            const { data: trainer } = await supabase
                .from('trainers')
                .select('trainer_id')
                .limit(1)
                .single();

            if (!trainer) throw new Error("No trainer found.")

            const finalGoal = values.goal === "other" ? values.custom_goal : values.goal;

            // 1. Create Member
            const { data: member, error } = await supabase.from('members').insert({
                trainer_id: trainer.trainer_id,
                name: values.name,
                email: values.email || null,
                whatsapp_id: values.whatsapp_number,
                phone_number: values.whatsapp_number,
                gender: values.gender,
                goal: finalGoal,
                height_cm: values.height || null,
                weight_kg: values.weight || null,
                age: values.age || null,
                monthly_fee: values.monthly_fee,
                status: values.status,
            }).select().single();

            if (error) throw error

            // 2. Assign Diet Plan if selected
            if (values.dietPlanId && values.dietPlanId !== "none" && values.dietPlanId !== "") {
                const planName = dietPlans.find(p => p.id === values.dietPlanId)?.name;
                const { data: prog } = await supabase.from('plan_programs').insert({
                    trainer_id: trainer.trainer_id,
                    name: `${planName} for ${values.name}`,
                    diet_plan_id: values.dietPlanId,
                    status: 'active'
                }).select().single();

                if (prog) {
                    await supabase.from('client_programs').insert({
                        client_id: member.member_id,
                        program_id: prog.id,
                        start_date: format(new Date(), 'yyyy-MM-dd'),
                        status: 'active',
                        is_current: true
                    });
                }
            }

            // 3. Assign Workout Plan if selected
            if (values.workoutPlanId && values.workoutPlanId !== "none" && values.workoutPlanId !== "") {
                const planName = workoutPlans.find(p => p.id === values.workoutPlanId)?.name;
                const { data: prog } = await supabase.from('plan_programs').insert({
                    trainer_id: trainer.trainer_id,
                    name: `${planName} for ${values.name}`,
                    workout_plan_id: values.workoutPlanId,
                    status: 'active'
                }).select().single();

                if (prog) {
                    await supabase.from('client_programs').insert({
                        client_id: member.member_id,
                        program_id: prog.id,
                        start_date: format(new Date(), 'yyyy-MM-dd'),
                        status: 'active',
                        is_current: true
                    });
                }
            }

            setOpen(false)
            form.reset()
            router.refresh()
            // alert("Client created successfully!") // Removed alert effectively replacing with UI feedback if needed, but keeping flow smooth
        } catch (error) {
            console.error("Error adding client:", error)
            alert(`Failed to add client: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Add New Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-black max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase text-[#212121]">Add New Client</DialogTitle>
                    <DialogDescription>
                        Create a new client profile and assign initial protocols.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="whatsapp_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91 9876543210" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Physical Stats */}
                        <div className="p-4 bg-zinc-50 rounded-xl grid grid-cols-3 gap-4 border">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-zinc-500">Gender</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-zinc-500">Age</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="25" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-zinc-500">Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="70" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold text-zinc-500">Height (cm)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="175" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="goal"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-xs uppercase font-bold text-zinc-500">Primary Goal</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select Goal" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="fat_loss">Fat Loss</SelectItem>
                                                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                                <SelectItem value="strength">Strength</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="other">Custom Goal...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {selectedGoal === "other" && (
                                <FormField
                                    control={form.control}
                                    name="custom_goal"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            <FormControl>
                                                <Input placeholder="Enter custom goal..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Financials & Plans */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="monthly_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Fee (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="5000" {...field} className="font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <FormField
                                    control={form.control}
                                    name="dietPlanId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assign Diet Plan</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || "none"}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {dietPlans.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="workoutPlanId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assign Workout Plan</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || "none"}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {workoutPlans.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full bg-[#212121] text-white hover:bg-black font-bold">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Creating Client..." : "Create Client Profile"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
