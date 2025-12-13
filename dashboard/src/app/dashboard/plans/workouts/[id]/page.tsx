"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateWorkoutPlanEditor } from "@/components/plans/template-workout-plan-editor"
import { createClient } from "@/lib/supabase"
// Add useParams to imports
import { useRouter, useParams } from "next/navigation"

// Remove params prop
export default function EditWorkoutPlanPage() {
    const router = useRouter()
    // Use useParams hook to get params properly wrapped/unwrapped
    const params = useParams() as { id: string }
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [level, setLevel] = useState("beginner")
    const [focus, setFocus] = useState("strength")
    const [frequency, setFrequency] = useState(3)
    const [structure, setStructure] = useState<any>({ days: [] })

    const isNew = params.id === "new"

    useEffect(() => {
        if (!isNew) {
            // TODO: Fetch real data
            // const { data } = await supabase.from('workout_plans').select('*').eq('id', params.id).single()

            // Mock data
            setName("3 Day Beginner Upper/Lower Split")
            setDescription("Great for beginners starting their strength journey.")
            setLevel("beginner")
            setFocus("strength")
            setFrequency(3)
            setStructure({
                days: [
                    { day: "Day 1", focus: "Upper Body", exercises: [{ name: "Bench Press", sets: 3, reps: "8-10", rest: "90s" }] },
                    { day: "Day 2", focus: "Lower Body", exercises: [{ name: "Squat", sets: 3, reps: "8-10", rest: "90s" }] },
                    { day: "Day 3", focus: "Rest", exercises: [] },
                ]
            })
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [isNew])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user logged in")

            // Get trainer_id (UUID) from trainers table
            // Get trainer_id (UUID) from trainers table
            const { data: trainer, error: trainerError } = await supabase
                .from('trainers')
                .select('trainer_id')
                .eq('user_id', user.id)
                .single();

            let trainerId = trainer?.trainer_id;

            // If trainer not found, we cannot proceed effectively.
            if (!trainerId) {
                console.warn('[WorkoutPlan] Trainer profile not found. Using user ID as fallback or creating default...');
                // Fallback to user.id if it's a valid UUID, assuming potential trainer_id=user.id mapping
                trainerId = user.id;
            }

            // Strict UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(trainerId)) {
                throw new Error(`Invalid Trainer UUID: ${trainerId}`)
            }

            const payload = {
                trainer_id: trainerId,  // Use validated UUID trainer_id
                name,
                level,
                focus,
                frequency_per_week: frequency,
                plan_type: 'template',
                is_active: true,
                structure,
                description
            }

            if (isNew) {
                const { error } = await supabase.from('workout_plans').insert([payload])
                if (error) throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
            } else {
                if (!params.id || params.id === 'undefined') {
                    throw new Error("Invalid Plan ID for update")
                }
                const { error } = await supabase.from('workout_plans').update(payload).eq('id', params.id)
                if (error) throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
            }

            alert("Plan saved successfully!")
            router.push("/dashboard/plans/workouts")
        } catch (error) {
            console.error(error)
            alert(`Failed to save plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isNew ? "Create New Workout Plan" : "Edit Workout Plan"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isNew ? "Design a new training program." : `Editing: ${name}`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Discard</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Plan"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Main Editor */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Plan Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Plan Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 5 Day Hypertrophy" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the goal and structure..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Weekly Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TemplateWorkoutPlanEditor
                                initialStructure={structure}
                                onChange={setStructure}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Level</Label>
                                <Select value={level} onValueChange={setLevel}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Focus</Label>
                                <Select value={focus} onValueChange={setFocus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="strength">Strength</SelectItem>
                                        <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                                        <SelectItem value="fat_loss">Fat Loss</SelectItem>
                                        <SelectItem value="endurance">Endurance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Frequency (Days/Week)</Label>
                                <Input type="number" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} max={7} min={1} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
