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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

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
})

interface LogProgressDialogProps {
    clientId: string
}

export function LogProgressDialog({ clientId }: LogProgressDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            weight: "",
            bodyFat: "",
            adherence: 8,
            notes: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { error } = await supabase
                .from('client_progress_entries')
                .insert({
                    client_id: clientId,
                    date: values.date,
                    weight_kg: parseFloat(values.weight),
                    body_fat_percentage: values.bodyFat ? parseFloat(values.bodyFat) : null,
                    adherence_score: values.adherence || null,
                    notes: values.notes || null,
                })

            if (error) {
                throw error
            }

            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error) {
            console.error("Error logging progress:", error)
            alert("Failed to log progress. Please try again.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Progress
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log Client Progress</DialogTitle>
                    <DialogDescription>
                        Record a new weight, body composition, or adherence entry.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" placeholder="e.g. 75.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bodyFat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body Fat % (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" placeholder="e.g. 15.0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="adherence"
                            render={({ field: { value, onChange } }) => (
                                <FormItem>
                                    <FormLabel>Adherence Score (1-10)</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-4">
                                            <Slider
                                                min={1}
                                                max={10}
                                                step={1}
                                                value={[value || 8]}
                                                onValueChange={(vals) => onChange(vals[0])}
                                                className="flex-1"
                                            />
                                            <span className="w-8 text-center font-medium">{value}</span>
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        How well did they stick to the plan?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="How are they feeling?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save Entry</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
