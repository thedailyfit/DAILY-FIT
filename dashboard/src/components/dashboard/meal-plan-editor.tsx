"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MealPlan, MealPlanData } from "@/types/meal-plan"
import { Trash2, Plus, Save, Wand2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast" // We'll need to create this hook or use a library

// Schema for validation
const foodItemSchema = z.object({
    item: z.string().min(1, "Item name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    macros: z.object({
        calories: z.coerce.number().min(0),
        protein: z.coerce.number().min(0),
        carbs: z.coerce.number().min(0),
        fats: z.coerce.number().min(0),
    }),
})

const mealSchema = z.object({
    name: z.string().min(1, "Meal name is required"),
    items: z.array(foodItemSchema),
})

const mealPlanSchema = z.object({
    daily_calories: z.coerce.number().min(500),
    meals: z.array(mealSchema),
})

type MealPlanFormValues = z.infer<typeof mealPlanSchema>

interface MealPlanEditorProps {
    initialData: MealPlan
    clientId: string
}

export function MealPlanEditor({ initialData, clientId }: MealPlanEditorProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<MealPlanFormValues>({
        resolver: zodResolver(mealPlanSchema) as any,
        defaultValues: {
            daily_calories: initialData.plan_data.daily_calories,
            meals: initialData.plan_data.meals || [],
        },
    })

    const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
        control: form.control,
        name: "meals",
    })

    // Calculate totals in real-time
    const watchedMeals = form.watch("meals")
    const totalCalories = watchedMeals?.reduce((acc, meal) => {
        return acc + (meal.items?.reduce((mAcc, item) => mAcc + (item.macros?.calories || 0), 0) || 0)
    }, 0) || 0

    const totalProtein = watchedMeals?.reduce((acc, meal) => {
        return acc + (meal.items?.reduce((mAcc, item) => mAcc + (item.macros?.protein || 0), 0) || 0)
    }, 0) || 0

    const onSubmit = async (data: MealPlanFormValues) => {
        setIsSaving(true)
        try {
            // Construct the full plan data object
            const updatedPlanData: MealPlanData = {
                ...initialData.plan_data,
                daily_calories: data.daily_calories,
                meals: data.meals,
            }

            const { error } = await supabase
                .from('meal_plans')
                .update({ plan_data: updatedPlanData })
                .eq('id', initialData.id)

            if (error) throw error

            router.refresh()
            // toast({ title: "Plan updated successfully" }) // Add toast later
            alert("Plan updated successfully!")
        } catch (error) {
            console.error("Error updating plan:", error)
            alert("Failed to update plan")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Plan Settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Target: {form.getValues("daily_calories")} kcal | Actual: {totalCalories} kcal
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm">
                        <Wand2 className="w-4 h-4 mr-2" />
                        AI Auto-Fill
                    </Button>
                    <Button type="submit" disabled={isSaving} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Daily Calorie Target</Label>
                            <Input {...form.register("daily_calories")} type="number" />
                        </div>
                        <div className="space-y-2">
                            <Label>Protein Target (g)</Label>
                            <div className="p-2 border rounded-md bg-muted text-muted-foreground">
                                {totalProtein.toFixed(1)} g (Calculated)
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {mealFields.map((meal, index) => (
                    <AccordionItem value={`item-${index}`} key={meal.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <span>{meal.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {meal.items?.reduce((acc, item) => acc + (item.macros?.calories || 0), 0)} kcal
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 space-y-4">
                            <MealItemsEditor nestIndex={index} control={form.control} register={form.register} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </form>
    )
}

// Sub-component for editing items within a meal
function MealItemsEditor({ nestIndex, control, register }: any) {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `meals.${nestIndex}.items`,
    })

    return (
        <div className="space-y-4">
            {fields.map((item, k) => (
                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end border-b pb-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Food Item</Label>
                        <Input {...register(`meals.${nestIndex}.items.${k}.item`)} placeholder="e.g. Oatmeal" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Qty</Label>
                        <Input {...register(`meals.${nestIndex}.items.${k}.quantity`)} placeholder="e.g. 1 cup" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Cals</Label>
                        <Input {...register(`meals.${nestIndex}.items.${k}.macros.calories`)} type="number" />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => append({ item: "", quantity: "", macros: { calories: 0, protein: 0, carbs: 0, fats: 0 } })}
            >
                <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
        </div>
    )
}
