"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TemplateWorkoutPlanEditorProps {
    initialStructure: any
    onChange: (structure: any) => void
}

export function TemplateWorkoutPlanEditor({ initialStructure, onChange }: TemplateWorkoutPlanEditorProps) {
    // Ensure we have a valid structure to start with
    const [schedule, setSchedule] = useState<any[]>(initialStructure?.days || [])
    const [activeDay, setActiveDay] = useState("day-1")

    // Propagate changes to parent
    useEffect(() => {
        onChange({ days: schedule })
    }, [schedule, onChange])

    // Helper to ensure we have data for the active day
    const getDayData = (dayIndex: number) => {
        return schedule[dayIndex] || { day: `Day ${dayIndex + 1}`, focus: "Rest", exercises: [] }
    }

    const updateDayFocus = (dayIndex: number, focus: string) => {
        const newSchedule = [...schedule]
        // Fill in gaps if needed
        for (let i = 0; i <= dayIndex; i++) {
            if (!newSchedule[i]) newSchedule[i] = { day: `Day ${i + 1}`, focus: "Rest", exercises: [] }
        }
        newSchedule[dayIndex].focus = focus
        setSchedule(newSchedule)
    }

    const addExercise = (dayIndex: number) => {
        const newSchedule = [...schedule]
        for (let i = 0; i <= dayIndex; i++) {
            if (!newSchedule[i]) newSchedule[i] = { day: `Day ${i + 1}`, focus: "Rest", exercises: [] }
        }

        if (!newSchedule[dayIndex].exercises) newSchedule[dayIndex].exercises = []

        newSchedule[dayIndex].exercises.push({
            name: "",
            sets: 3,
            reps: "10-12",
            rest: "60s",
            notes: ""
        })
        setSchedule(newSchedule)
    }

    const updateExercise = (dayIndex: number, exIndex: number, field: string, value: any) => {
        const newSchedule = [...schedule]
        newSchedule[dayIndex].exercises[exIndex] = {
            ...newSchedule[dayIndex].exercises[exIndex],
            [field]: value
        }
        setSchedule(newSchedule)
    }

    const removeExercise = (dayIndex: number, exIndex: number) => {
        const newSchedule = [...schedule]
        newSchedule[dayIndex].exercises.splice(exIndex, 1)
        setSchedule(newSchedule)
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                <TabsList className="grid w-full grid-cols-7 mb-4 h-auto">
                    {[...Array(7)].map((_, i) => (
                        <TabsTrigger key={i} value={`day-${i + 1}`} className="py-2">
                            Day {i + 1}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {[...Array(7)].map((_, dayIndex) => {
                    const dayData = getDayData(dayIndex)
                    return (
                        <TabsContent key={dayIndex} value={`day-${dayIndex + 1}`} className="space-y-4">
                            <div className="flex items-center gap-4 mb-4 p-4 border rounded-lg bg-muted/20">
                                <div className="w-1/3">
                                    <Label>Day Focus</Label>
                                    <Select
                                        value={dayData.focus}
                                        onValueChange={(val) => updateDayFocus(dayIndex, val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select focus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Rest">Rest Day</SelectItem>
                                            <SelectItem value="Full Body">Full Body</SelectItem>
                                            <SelectItem value="Upper Body">Upper Body</SelectItem>
                                            <SelectItem value="Lower Body">Lower Body</SelectItem>
                                            <SelectItem value="Push">Push</SelectItem>
                                            <SelectItem value="Pull">Pull</SelectItem>
                                            <SelectItem value="Cardio">Cardio</SelectItem>
                                            <SelectItem value="HIIT">HIIT</SelectItem>
                                            <SelectItem value="Active Recovery">Active Recovery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 flex justify-end gap-2 mt-6">
                                    {/* Copy functionality could be added here */}
                                </div>
                            </div>

                            {dayData.focus !== 'Rest' && (
                                <div className="space-y-3">
                                    {dayData.exercises?.map((ex: any, exIndex: number) => (
                                        <div key={exIndex} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md bg-white">
                                            <div className="col-span-4">
                                                <Label className="text-xs">Exercise</Label>
                                                <Input
                                                    value={ex.name}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'name', e.target.value)}
                                                    placeholder="e.g. Bench Press"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-xs">Sets</Label>
                                                <Input
                                                    type="number"
                                                    value={ex.sets}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-xs">Reps</Label>
                                                <Input
                                                    value={ex.reps}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'reps', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-xs">Rest</Label>
                                                <Input
                                                    value={ex.rest}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'rest', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeExercise(dayIndex, exIndex)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => addExercise(dayIndex)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Exercise
                                    </Button>
                                </div>
                            )}

                            {dayData.focus === 'Rest' && (
                                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-md border border-dashed">
                                    Rest Day - No exercises scheduled.
                                </div>
                            )}
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}
