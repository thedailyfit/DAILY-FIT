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
import { TemplateMealPlanEditor } from "@/components/plans/template-meal-plan-editor"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function EditDietPlanPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [goal, setGoal] = useState("fat_loss")
    const [dietPreference, setDietPreference] = useState("veg")
    const [totalCalories, setTotalCalories] = useState(1500)
    const [structure, setStructure] = useState<any>({ meals: [] })

    const isNew = params.id === "new"

    useEffect(() => {
        if (!isNew) {
            // TODO: Fetch real data
            // const { data } = await supabase.from('diet_plans').select('*').eq('id', params.id).single()

            // Mock data for now
            setName("Veg Fat Loss – 1500 kcal")
            setDescription("A balanced vegetarian diet for gradual fat loss.")
            setGoal("fat_loss")
            setDietPreference("veg")
            setTotalCalories(1500)
            setStructure({
                meals: [
                    {
                        name: "Breakfast",
                        time: "08:00",
                        items: [{ item: "Oats", quantity: "50g", macros: { calories: 150, protein: 5, carbs: 25, fats: 3 } }]
                    },
                    {
                        name: "Lunch",
                        time: "13:00",
                        items: [{ item: "Roti", quantity: "2 pcs", macros: { calories: 200, protein: 6, carbs: 30, fats: 4 } }]
                    },
                ]
            })
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [isNew])

    const handleSave = async () => {
        setSaving(true)
        console.log('[DietPlan] Starting save...')

        try {
            // Validate required fields
            if (!name || name.trim() === '') {
                throw new Error("Plan name is required")
            }

            console.log('[DietPlan] Getting user...')
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError) {
                console.error('[DietPlan] User error:', userError)
                throw new Error(`Auth error: ${userError.message}`)
            }

            if (!user) {
                console.error('[DietPlan] No user found')
                throw new Error("No user logged in")
            }

            console.log('[DietPlan] User found:', user.id)

            // Get trainer_id (UUID) from trainers table
            console.log('[DietPlan] Fetching trainer...')
            const { data: trainer, error: trainerError } = await supabase
                .from('trainers')
                .select('trainer_id')
                .limit(1)
                .single();

            if (trainerError) {
                console.error('[DietPlan] Trainer error:', trainerError)
                throw new Error(`Trainer fetch error: ${trainerError.message}`)
            }

            if (!trainer) {
                console.error('[DietPlan] No trainer found')
                throw new Error("No trainer found in database")
            }

            console.log('[DietPlan] Trainer found:', trainer.trainer_id)

            const payload = {
                trainer_id: trainer.trainer_id,
                name: name.trim(),
                goal,
                total_calories: totalCalories,
                diet_preference: dietPreference,
                plan_type: 'template',
                is_active: true,
                structure,
            }

            console.log('[DietPlan] Payload:', JSON.stringify(payload, null, 2))

            if (isNew) {
                console.log('[DietPlan] Inserting new plan...')
                const { data, error } = await supabase.from('diet_plans').insert([payload]).select()

                if (error) {
                    console.error('[DietPlan] Insert error:', error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
                }

                console.log('[DietPlan] Insert successful:', data)
            } else {
                console.log('[DietPlan] Updating existing plan...')
                const { data, error } = await supabase.from('diet_plans').update(payload).eq('id', params.id).select()

                if (error) {
                    console.error('[DietPlan] Update error:', error)
                    throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
                }

                console.log('[DietPlan] Update successful:', data)
            }

            alert("Plan saved successfully!")
            router.push("/dashboard/plans/diets")
        } catch (error) {
            console.error('[DietPlan] Save failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            alert(`Failed to save plan: ${errorMessage}`)
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
                            {isNew ? "Create New Diet Plan" : "Edit Diet Plan"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isNew ? "Design a new nutrition template." : `Editing: ${name}`}
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
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 12 Week Fat Loss" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe who this plan is for..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Meal Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TemplateMealPlanEditor
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
                                <Label>Goal</Label>
                                <Select value={goal} onValueChange={setGoal}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fat_loss">Fat Loss</SelectItem>
                                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Diet Preference</Label>
                                <Select value={dietPreference} onValueChange={setDietPreference}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="veg">Vegetarian</SelectItem>
                                        <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                                        <SelectItem value="vegan">Vegan</SelectItem>
                                        <SelectItem value="egg">Eggetarian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Total Calories</Label>
                                <Input type="number" value={totalCalories} onChange={(e) => setTotalCalories(Number(e.target.value))} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
