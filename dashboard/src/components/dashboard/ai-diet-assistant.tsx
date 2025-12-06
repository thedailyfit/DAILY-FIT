"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateDietPlan } from "@/app/actions/generate-diet-plan"
import { Loader2, Sparkles } from "lucide-react"

interface AIDietAssistantProps {
    onPlanGenerated: (plan: any) => void
}

export function AIDietAssistant({ onPlanGenerated }: AIDietAssistantProps) {
    const [loading, setLoading] = useState(false)
    const [calories, setCalories] = useState("2000")
    const [cuisine, setCuisine] = useState("Balanced")
    const [meals, setMeals] = useState("3")

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const plan = await generateDietPlan({
                calories: parseInt(calories),
                cuisine,
                meals: parseInt(meals),
            })
            onPlanGenerated(plan)
        } catch (error) {
            console.error("Failed to generate plan", error)
            alert("Failed to generate plan. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="h-full border-l rounded-none border-y-0 border-r-0 shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Target Calories</Label>
                    <Input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Diet Type / Cuisine</Label>
                    <Select value={cuisine} onValueChange={setCuisine}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Balanced">Balanced</SelectItem>
                            <SelectItem value="Low Carb">Low Carb</SelectItem>
                            <SelectItem value="High Protein">High Protein</SelectItem>
                            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Meals per Day</Label>
                    <Select value={meals} onValueChange={setMeals}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3">3 Meals</SelectItem>
                            <SelectItem value="4">3 Meals + 1 Snack</SelectItem>
                            <SelectItem value="5">3 Meals + 2 Snacks</SelectItem>
                            <SelectItem value="6">6 Small Meals</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Full Day Plan"
                    )}
                </Button>

                <div className="text-xs text-muted-foreground mt-4">
                    <p>Tip: Generated plans are suggestions. You can edit them freely after generation.</p>
                </div>
            </CardContent>
        </Card>
    )
}
