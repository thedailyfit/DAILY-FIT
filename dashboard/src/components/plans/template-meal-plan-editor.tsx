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
    time: z.string().optional(),
    items: z.array(foodItemSchema),
})

const mealPlanStructureSchema = z.object({
    meals: z.array(mealSchema),
})

type MealPlanStructureValues = z.infer<typeof mealPlanStructureSchema>

interface TemplateMealPlanEditorProps {
    initialStructure: any
    onChange: (structure: any) => void
}

export function TemplateMealPlanEditor({ initialStructure, onChange }: TemplateMealPlanEditorProps) {
    const form = useForm<MealPlanStructureValues>({
        resolver: zodResolver(mealPlanStructureSchema),
        defaultValues: {
            meals: initialStructure?.meals || [],
        },
    })

    const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
        control: form.control,
        name: "meals",
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Meal Structure</h3>
                    <p className="text-sm text-muted-foreground">
                        Total: {totalCalories} kcal | {totalProtein.toFixed(1)}g Protein
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => appendMeal({ name: "New Meal", items: [] })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Meal
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
