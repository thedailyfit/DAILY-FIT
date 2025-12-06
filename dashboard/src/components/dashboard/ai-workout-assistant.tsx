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
import { generateWorkoutPlan } from "@/app/actions/generate-workout-plan"
import { Loader2, Dumbbell } from "lucide-react"

interface AIWorkoutAssistantProps {
    onPlanGenerated: (plan: any) => void
}

export function AIWorkoutAssistant({ onPlanGenerated }: AIWorkoutAssistantProps) {
    const [loading, setLoading] = useState(false)
    const [goal, setGoal] = useState("Muscle Gain")
    const [level, setLevel] = useState("Intermediate")
    const [days, setDays] = useState("3")
    const [equipment, setEquipment] = useState("Gym")

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const plan = await generateWorkoutPlan({
                goal,
                level,
                days: parseInt(days),
                equipment,
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
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                    AI Coach
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Goal</Label>
                    <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                            <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                            <SelectItem value="Strength">Strength</SelectItem>
                            <SelectItem value="Endurance">Endurance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Days per Week</Label>
                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 Days</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="4">4 Days</SelectItem>
                            <SelectItem value="5">5 Days</SelectItem>
                            <SelectItem value="6">6 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Equipment</Label>
                    <Select value={equipment} onValueChange={setEquipment}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Gym">Full Gym</SelectItem>
                            <SelectItem value="Dumbbells">Dumbbells Only</SelectItem>
                            <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                            <SelectItem value="Home Gym">Home Gym</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Workout Split"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
