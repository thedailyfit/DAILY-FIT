"use client"

import { useState, useEffect } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

interface FoodItem {
    name: string
    portion: string
    calories: number
    protein: number
    carbs: number
    fats: number
}

interface Meal {
    name: string
    items: FoodItem[]
    total_calories: number
}

interface MealPlanEditorProps {
    initialData?: any
    onChange?: (data: any) => void
}

export function MealPlanEditor({ initialData, onChange }: MealPlanEditorProps) {
    const [meals, setMeals] = useState<Meal[]>(initialData?.meals || [])

    // Update parent when local state changes
    useEffect(() => {
        if (onChange) {
            onChange({ meals })
        }
    }, [meals, onChange])

    // Update local state when initialData changes (e.g. from AI generation)
    useEffect(() => {
        if (initialData?.meals) {
            setMeals(initialData.meals)
        }
    }, [initialData])

    const addMeal = () => {
        setMeals([...meals, { name: `Meal ${meals.length + 1}`, items: [], total_calories: 0 }])
    }

    const removeMeal = (index: number) => {
        const newMeals = [...meals]
        newMeals.splice(index, 1)
        setMeals(newMeals)
    }

    const addItem = (mealIndex: number) => {
        const newMeals = [...meals]
        newMeals[mealIndex].items.push({ name: "", portion: "", calories: 0, protein: 0, carbs: 0, fats: 0 })
        setMeals(newMeals)
    }

    const updateItem = (mealIndex: number, itemIndex: number, field: keyof FoodItem, value: any) => {
        const newMeals = [...meals]
        newMeals[mealIndex].items[itemIndex] = {
            ...newMeals[mealIndex].items[itemIndex],
            [field]: value
        }
        // Recalculate totals (simplified)
        // In a real app, we'd sum up calories here
        setMeals(newMeals)
    }

    const removeItem = (mealIndex: number, itemIndex: number) => {
        const newMeals = [...meals]
        newMeals[mealIndex].items.splice(itemIndex, 1)
        setMeals(newMeals)
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Daily Meal Plan</h3>
                <Button onClick={addMeal} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Meal
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {meals.map((meal, mealIndex) => (
                    <AccordionItem key={mealIndex} value={`item-${mealIndex}`} className="border rounded-md px-4">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex justify-between w-full items-center pr-4">
                                <span>{meal.name}</span>
                                <span className="text-sm text-muted-foreground">{meal.total_calories} kcal</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            {meal.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4">
                                        <label className="text-xs text-muted-foreground">Food</label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => updateItem(mealIndex, itemIndex, 'name', e.target.value)}
                                            placeholder="e.g. Oatmeal"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-muted-foreground">Portion</label>
                                        <Input
                                            value={item.portion}
                                            onChange={(e) => updateItem(mealIndex, itemIndex, 'portion', e.target.value)}
                                            placeholder="1 cup"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-muted-foreground">Cals</label>
                                        <Input
                                            type="number"
                                            value={item.calories}
                                            onChange={(e) => updateItem(mealIndex, itemIndex, 'calories', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-3 grid grid-cols-3 gap-1">
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">P</label>
                                            <Input className="h-8 text-xs px-1" placeholder="P" value={item.protein} onChange={(e) => updateItem(mealIndex, itemIndex, 'protein', parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">C</label>
                                            <Input className="h-8 text-xs px-1" placeholder="C" value={item.carbs} onChange={(e) => updateItem(mealIndex, itemIndex, 'carbs', parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">F</label>
                                            <Input className="h-8 text-xs px-1" placeholder="F" value={item.fats} onChange={(e) => updateItem(mealIndex, itemIndex, 'fats', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(mealIndex, itemIndex)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-2">
                                <Button variant="ghost" size="sm" className="text-xs" onClick={() => addItem(mealIndex)}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Item
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600" onClick={() => removeMeal(mealIndex)}>
                                    Remove Meal
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {meals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
                    No meals added. Use the AI Assistant or add a meal manually.
                </div>
            )}
        </div>
    )
}
