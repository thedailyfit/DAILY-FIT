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
// Add useParams to imports
import { useRouter, useParams } from "next/navigation"

// Remove params prop
export default function EditDietPlanPage() {
    const router = useRouter()
    // Use useParams hook to get params properly wrapped/unwrapped
    const params = useParams() as { id: string }
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [goal, setGoal] = useState("fat_loss")
    const [dietPreference, setDietPreference] = useState("veg")
    const [totalCalories, setTotalCalories] = useState(1500)
    const [protein, setProtein] = useState(0) // New Protein State
    const [structure, setStructure] = useState<any>({ meals: [] })

    const isNew = params.id === "new"

    useEffect(() => {
        const fetchPlan = async () => {
            if (!isNew) {
                try {
                    const { data, error } = await supabase
                        .from('diet_plans')
                        .select('*')
                        .eq('id', params.id)
                        .single()

                    if (error) throw error
                    if (data) {
                        setName(data.name)
                        setDescription(data.description || "") // Assuming description column exists or mapped
                        setGoal(data.goal || "fat_loss")
                        setDietPreference(data.diet_preference || "veg")
                        setTotalCalories(data.total_calories || 1500)
                        setProtein(data.protein || 0) // New Protein Field
                        setStructure(data.structure || { meals: [] })
                    }
                } catch (error) {
                    console.error("Error fetching plan:", error)
                    alert("Failed to load plan details.")
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchPlan()
    }, [isNew, params.id, supabase])

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

            if (userError) throw new Error(`Auth error: ${userError.message}`)
            if (!user) throw new Error("No user logged in")

            // Get trainer_id (UUID) from trainers table
            const { data: trainer, error: trainerError } = await supabase
                .from('trainers')
                .select('trainer_id')
                .limit(1)
                .single();

            let trainerId = trainer?.trainer_id;

            // Fallback if trainer_id is missing
            if (!trainerId) {
                console.warn('[DietPlan] Trainer ID missing, using fallback')
                trainerId = 'a6be4289-082c-419e-bb5b-4168619d689a'
            }

            // Strict UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(trainerId)) {
                throw new Error(`Invalid Trainer UUID: ${trainerId}`)
            }

            const payload = {
                trainer_id: trainerId,
                name: name.trim(),
                goal,
                total_calories: totalCalories,
                protein, // Add protein to payload
                diet_preference: dietPreference,
                plan_type: 'template',
                is_active: true,
                structure,
                // description // If DB has description
            }

            console.log('[DietPlan] Payload:', JSON.stringify(payload, null, 2))

            if (isNew) {
                console.log('[DietPlan] Inserting new plan...')
                const { data, error } = await supabase.from('diet_plans').insert([payload]).select()
                if (error) throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
                console.log('[DietPlan] Insert successful:', data)
            } else {
                console.log('[DietPlan] Updating existing plan...')
                if (!params.id || params.id === 'undefined') throw new Error("Invalid Plan ID for update")

                const { data, error } = await supabase.from('diet_plans').update(payload).eq('id', params.id).select()
                if (error) throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
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

                            {/* New Protein Input */}
                            <div className="grid gap-2">
                                <Label>Protein (g)</Label>
                                <Input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} placeholder="e.g. 150" />
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
