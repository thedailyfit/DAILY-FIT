"use client"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Wand2 } from "lucide-react"
import { AiGenerationDialog } from "./ai-generation-dialog"

// Schema for validation
const numberSchema = z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val) || 0;
    if (typeof val === 'number') return val;
    return 0;
}, z.number());

const foodItemSchema = z.object({
    item: z.string().min(1, "Item name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    macros: z.object({
        calories: numberSchema,
        protein: numberSchema,
        carbs: numberSchema,
        fats: numberSchema,
    }),
})

const mealSchema = z.object({
    name: z.string().min(1, "Meal name is required"),
    time: z.string().optional(),
    items: z.array(foodItemSchema),
})

const supplementSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    timing: z.string().min(1, "Timing is required"),
})

const mealPlanStructureSchema = z.object({
    meals: z.array(mealSchema),
    supplements: z.array(supplementSchema).optional(),
    sleep_guidelines: z.string().optional(),
})

type MealPlanStructureValues = z.infer<typeof mealPlanStructureSchema>

interface TemplateMealPlanEditorProps {
    initialStructure: any
    onChange: (structure: any) => void
}

export function TemplateMealPlanEditor({ initialStructure, onChange }: TemplateMealPlanEditorProps) {
    const form = useForm<MealPlanStructureValues>({
        defaultValues: {
            meals: initialStructure?.meals || [],
            supplements: initialStructure?.supplements || [],
            sleep_guidelines: initialStructure?.sleep_guidelines || "",
        },
    })

    const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
        control: form.control,
        name: "meals",
    })

    const { fields: suppFields, append: appendSupp, remove: removeSupp } = useFieldArray({
        control: form.control,
        name: "supplements",
    })

    // Watch changes and propagate to parent
    form.watch((data) => {
        onChange(data)
    })

    // Calculate totals in real-time
    const watchedMeals = form.watch("meals")
    const totalCalories = watchedMeals?.reduce((acc, meal) => {
        return acc + (meal?.items?.reduce((mAcc, item) => mAcc + (item?.macros?.calories || 0), 0) || 0)
    }, 0) || 0

    const totalProtein = watchedMeals?.reduce((acc, meal) => {
        return acc + (meal?.items?.reduce((mAcc, item) => mAcc + (item?.macros?.protein || 0), 0) || 0)
    }, 0) || 0

    return (
        <div className="space-y-8">
            {/* --- MEAL SECTION --- */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Nutrition Protocol</h3>
                        <p className="text-sm text-muted-foreground">
                            Target: {totalCalories} kcal | {totalProtein.toFixed(1)}g Protein
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                                const goal = prompt("Enter generic goal (e.g., 'Fat Loss, 1800 kcal, Vegetarian')");
                                if (!goal) return;
                                try {
                                    const { generateAiMealPlan } = await import("@/app/actions/generate-plan");
                                    const aiPlan = await generateAiMealPlan({ goal });
                                    if (aiPlan && aiPlan.meals) {
                                        form.reset({ meals: aiPlan.meals, supplements: [], sleep_guidelines: "" });
                                        onChange({ meals: aiPlan.meals });
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("AI Generation failed");
                                }
                            }}
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            AI Generate
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendMeal({ name: "New Meal", items: [] })}>
                            <Plus className="w-4 h-4 mr-2" /> Add Meal
                        </Button>
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {mealFields.map((meal, index) => (
                        <AccordionItem value={`item-${index}`} key={meal.id}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            {...form.register(`meals.${index}.name`)}
                                            className="h-8 w-40"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Input
                                            {...form.register(`meals.${index}.time`)}
                                            className="h-8 w-24 text-xs"
                                            placeholder="Time"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">
                                            {watchedMeals?.[index]?.items?.reduce((acc, item) => acc + (item?.macros?.calories || 0), 0) || 0} kcal
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeMeal(index)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                                <MealItemsEditor nestIndex={index} control={form.control} register={form.register} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* --- SUPPLEMENT SECTION --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Supplement Stack</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSupp({ name: "", dosage: "", timing: "" })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Supplement
                    </Button>
                </div>
                {suppFields.length === 0 && (
                    <div className="text-sm text-slate-500 italic">No supplements added.</div>
                )}
                {suppFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end border p-3 rounded-md bg-slate-50">
                        <div className="space-y-1">
                            <Label className="text-xs">Supplement Name</Label>
                            <Input {...form.register(`supplements.${index}.name`)} placeholder="e.g. Whey Protein" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Dosage</Label>
                            <Input {...form.register(`supplements.${index}.dosage`)} placeholder="e.g. 1 scoop" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Timing</Label>
                            <Input {...form.register(`supplements.${index}.timing`)} placeholder="e.g. Post-workout" />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 mb-0.5"
                            onClick={() => removeSupp(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* --- SLEEP/NOTES SECTION --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Sleep & Recovery Protocol</h3>
                <Card>
                    <CardContent className="pt-4">
                        <div className="space-y-2">
                            <Label>Guidelines</Label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Sleep 7-8 hours, use blue light blockers after 8 PM..."
                                {...form.register("sleep_guidelines")}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function MealItemsEditor({ nestIndex, control, register }: any) {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `meals.${nestIndex}.items`,
    })

    return (
        <div className="space-y-4">
            {fields.map((item, k) => (
                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end border-b pb-4">
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
                        <Input {...register(`meals.${nestIndex}.items.${k}.macros.calories`)} type="number" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Protein (g)</Label>
                        <Input {...register(`meals.${nestIndex}.items.${k}.macros.protein`)} type="number" placeholder="0" />
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
                <Plus className="w-4 h-4 mr-2" /> Add Food Item
            </Button>
        </div>
    )
}
