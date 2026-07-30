"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Clock } from "lucide-react"

const MEAL_WINDOWS = [
    "Early Morning",
    "Breakfast",
    "Mid-Morning",
    "Lunch",
    "Pre-workout",
    "Post-workout",
    "Dinner"
]

interface TemplateMealPlanEditorProps {
    initialStructure: any
    onChange: (structure: any) => void
}

export function TemplateMealPlanEditor({ initialStructure, onChange }: TemplateMealPlanEditorProps) {
    // Initialize meals based on MEAL_WINDOWS
    const [meals, setMeals] = useState<any[]>(() => {
        const initMeals = initialStructure?.meals || []
        return MEAL_WINDOWS.map(windowName => {
            const existing = initMeals.find((m: any) => m.name === windowName)
            if (existing) return existing
            return {
                name: windowName,
                time: "",
                food_options: "",
                macros: { calories: 0, protein: 0, carbs: 0, fats: 0 }
            }
        })
    })

    // Calculate totals
    const totalCalories = meals.reduce((acc, meal) => acc + (Number(meal.macros?.calories) || 0), 0)
    const totalProtein = meals.reduce((acc, meal) => acc + (Number(meal.macros?.protein) || 0), 0)

    // Propagate changes
    useEffect(() => {
        onChange({ meals })
    }, [meals, onChange])

    const updateMeal = (index: number, field: string, value: any) => {
        const newMeals = [...meals]
        if (field.startsWith('macros.')) {
            const macroField = field.split('.')[1]
            newMeals[index].macros = {
                ...newMeals[index].macros,
                [macroField]: value
            }
        } else {
            newMeals[index][field] = value
        }
        setMeals(newMeals)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm gap-4">
                <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Nutrition Protocol</h3>
                    <p className="text-sm text-muted-foreground font-medium">Configure strict meal windows.</p>
                </div>
                <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border border-border w-full md:w-auto justify-around">
                    <div className="text-center">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Calories</div>
                        <div className="font-black text-xl text-primary">{totalCalories} kcal</div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Protein</div>
                        <div className="font-black text-xl text-primary">{totalProtein}g</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {meals.map((meal, index) => (
                    <Card key={meal.name} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-muted/30 py-3 border-b border-border flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {meal.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 w-32 md:w-48">
                                <Input 
                                    placeholder="Time (e.g. 8:00 AM)" 
                                    className="h-8 text-xs bg-background"
                                    value={meal.time || ""}
                                    onChange={(e) => updateMeal(index, 'time', e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Food Options</Label>
                                <Textarea 
                                    placeholder={`Enter food options for ${meal.name.toLowerCase()}...`} 
                                    className="min-h-[80px] bg-background resize-y"
                                    value={meal.food_options || ""}
                                    onChange={(e) => updateMeal(index, 'food_options', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-3 rounded-lg border border-border/50">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Calories</Label>
                                    <Input 
                                        type="number" 
                                        className="h-8 text-sm" 
                                        value={meal.macros?.calories || ""}
                                        onChange={(e) => updateMeal(index, 'macros.calories', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Protein (g)</Label>
                                    <Input 
                                        type="number" 
                                        className="h-8 text-sm"
                                        value={meal.macros?.protein || ""}
                                        onChange={(e) => updateMeal(index, 'macros.protein', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Carbs (g)</Label>
                                    <Input 
                                        type="number" 
                                        className="h-8 text-sm"
                                        value={meal.macros?.carbs || ""}
                                        onChange={(e) => updateMeal(index, 'macros.carbs', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fats (g)</Label>
                                    <Input 
                                        type="number" 
                                        className="h-8 text-sm"
                                        value={meal.macros?.fats || ""}
                                        onChange={(e) => updateMeal(index, 'macros.fats', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

