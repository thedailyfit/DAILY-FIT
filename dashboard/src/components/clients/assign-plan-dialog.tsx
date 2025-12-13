"use client"

import { useState, useEffect } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { CalendarIcon, Dumbbell, Utensils } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { notifyClientPlanUpdate } from "@/lib/whatsapp-notifier"

const formSchema = z.object({
    programType: z.enum(["diet", "workout"]),
    planId: z.string().min(1, "Please select a plan."),
    startDate: z.date(),
})

interface AssignPlanDialogProps {
    clientId: string
    clientName: string
}

export function AssignPlanDialog({ clientId, clientName }: AssignPlanDialogProps) {
    const [open, setOpen] = useState(false)
    const [dietPlans, setDietPlans] = useState<any[]>([])
    const [workoutPlans, setWorkoutPlans] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            programType: "diet",
            startDate: new Date(),
        },
    })

    const programType = form.watch("programType")

    useEffect(() => {
        if (open) {
            const fetchPlans = async () => {
                const { data: diets } = await supabase.from('diet_plans').select('id, name').eq('is_active', true)
                const { data: workouts } = await supabase.from('workout_plans').select('id, name').eq('is_active', true)

                if (diets) setDietPlans(diets)
                if (workouts) setWorkoutPlans(workouts)
            }
            fetchPlans()
        }
    }, [open, supabase])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user logged in")

            // Get trainer_id (UUID) from trainers table correctly
            const { data: trainer, error: trainerError } = await supabase
                .from('trainers')
                .select('trainer_id')
                .eq('user_id', user.id)
                .single();

            let trainerId = trainer?.trainer_id;

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
                ? dietPlans.find(p => p.id === values.planId)?.name
                : workoutPlans.find(p => p.id === values.planId)?.name

            const { data: programData, error: programError } = await supabase
                .from('plan_programs')
                .insert({
                    trainer_id: trainerId,
                    name: `${planName} for ${clientName}`,
                    diet_plan_id: values.programType === 'diet' ? values.planId : null,
                    workout_plan_id: values.programType === 'workout' ? values.planId : null,
                    status: 'active'
                })
                .select()
                .single()

            if (programError) throw new Error(`Failed to create program: ${programError.message}`)

            // 2. Link to client
            const { error: linkError } = await supabase
                .from('client_programs')
                .insert({
                    client_id: clientId,
                    program_id: programData.id,
                    start_date: format(values.startDate, 'yyyy-MM-dd'),
                    status: 'active',
                    is_current: true
                })

            if (linkError) throw linkError

            // 3. Send WhatsApp notification
            await notifyClientPlanUpdate({
                clientId,
                planType: values.programType,
                planName: planName || 'New Plan',
                action: 'assigned'
            });

            setOpen(false)
            form.reset()
            router.refresh()
            alert("Plan assigned successfully!")
        } catch (error) {
            console.error("Error assigning plan:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to assign plan: ${errorMessage}`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Assign Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Plan to {clientName}</DialogTitle>
                    <DialogDescription>
                        Select a diet or workout plan to assign.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="programType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="diet">
                                                <div className="flex items-center">
                                                    <Utensils className="mr-2 h-4 w-4" /> Diet Plan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="workout">
                                                <div className="flex items-center">
                                                    <Dumbbell className="mr-2 h-4 w-4" /> Workout Plan
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Plan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a plan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {programType === 'diet' ? (
                                                dietPlans.map(plan => (
                                                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                                ))
                                            ) : (
                                                workoutPlans.map(plan => (
                                                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Assign Plan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
