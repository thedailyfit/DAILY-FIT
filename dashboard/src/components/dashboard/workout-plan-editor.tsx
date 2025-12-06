"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, GripVertical } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Exercise {
    name: string
    sets: string
    reps: string
    notes?: string
}

interface WorkoutDay {
    day_name: string
    focus: string
    exercises: Exercise[]
}

interface WorkoutPlanEditorProps {
    initialData?: any
    onChange?: (data: any) => void
}

export function WorkoutPlanEditor({ initialData, onChange }: WorkoutPlanEditorProps) {
    const [days, setDays] = useState<WorkoutDay[]>(initialData?.days || [])
    const [activeTab, setActiveTab] = useState("day-0")

    // Update parent when local state changes
    useEffect(() => {
        if (onChange) {
            onChange({ days })
        }
    }, [days, onChange])

    // Update local state when initialData changes
    useEffect(() => {
        if (initialData?.days) {
            setDays(initialData.days)
            if (initialData.days.length > 0) {
                setActiveTab("day-0")
            }
        }
    }, [initialData])

    const addDay = () => {
        const newDays = [...days, { day_name: `Day ${days.length + 1}`, focus: "", exercises: [] }]
        setDays(newDays)
        setActiveTab(`day-${newDays.length - 1}`)
    }

    const addExercise = (dayIndex: number) => {
        const newDays = [...days]
        newDays[dayIndex].exercises.push({ name: "", sets: "3", reps: "10", notes: "" })
        setDays(newDays)
    }

    const updateExercise = (dayIndex: number, exIndex: number, field: keyof Exercise, value: string) => {
        const newDays = [...days]
        newDays[dayIndex].exercises[exIndex] = {
            ...newDays[dayIndex].exercises[exIndex],
            [field]: value
        }
        setDays(newDays)
    }

    const removeExercise = (dayIndex: number, exIndex: number) => {
        const newDays = [...days]
        newDays[dayIndex].exercises.splice(exIndex, 1)
        setDays(newDays)
    }

    const updateDayFocus = (dayIndex: number, value: string) => {
        const newDays = [...days]
        newDays[dayIndex].focus = value
        setDays(newDays)
    }

    return (
        <div className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weekly Schedule</h3>
                <Button onClick={addDay} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Day
                </Button>
            </div>

            {days.length > 0 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <ScrollArea className="w-full border-b">
                        <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                            {days.map((day, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={`day-${index}`}
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                                >
                                    {day.day_name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>

                    {days.map((day, dayIndex) => (
                        <TabsContent key={dayIndex} value={`day-${dayIndex}`} className="flex-1 overflow-y-auto pt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">Focus:</label>
                                <Input
                                    value={day.focus}
                                    onChange={(e) => updateDayFocus(dayIndex, e.target.value)}
                                    placeholder="e.g. Upper Body, Legs, Cardio"
                                    className="max-w-md"
                                />
                            </div>

                            <div className="space-y-2">
                                {day.exercises.map((ex, exIndex) => (
                                    <div key={exIndex} className="flex items-center gap-2 p-2 border rounded-md bg-card">
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                        <div className="flex-1 grid grid-cols-12 gap-2">
                                            <div className="col-span-5">
                                                <Input
                                                    value={ex.name}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'name', e.target.value)}
                                                    placeholder="Exercise Name"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    value={ex.sets}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', e.target.value)}
                                                    placeholder="Sets"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    value={ex.reps}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'reps', e.target.value)}
                                                    placeholder="Reps"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Input
                                                    value={ex.notes}
                                                    onChange={(e) => updateExercise(dayIndex, exIndex, 'notes', e.target.value)}
                                                    placeholder="Notes (optional)"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeExercise(dayIndex, exIndex)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addExercise(dayIndex)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Exercise
                            </Button>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                    No workout days added. Use the AI Coach or add a day manually.
                </div>
            )}
        </div>
    )
}
