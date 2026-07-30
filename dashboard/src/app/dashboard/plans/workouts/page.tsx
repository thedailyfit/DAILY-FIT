"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus, Search, Users, Edit, Copy, Trash, Wand2 } from "lucide-react"
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { AssignToClientDialog } from "@/components/plans/assign-to-client-dialog"

export default function WorkoutPlansLibraryPage() {
    const [plans, setPlans] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all") // all, active, draft, archived
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchPlans = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("workout_plans")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const mapped = data.map((plan: any) => ({
                id: plan.id,
                title: plan.name,
                duration: `${plan.frequency_per_week || 3} Days/Week`,
                clientsActive: 0,
                type: plan.focus?.replace('_', ' ') || "General",
                lastUpdated: new Date(plan.created_at).toLocaleDateString(),
                status: plan.status || 'active', // default to active if not present
                raw: plan
            }));
            setPlans(mapped);
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const handleDuplicate = async (plan: any) => {
        const newPlan = { ...plan.raw }
        delete newPlan.id
        delete newPlan.created_at
        newPlan.name = `Copy of ${plan.title}`
        
        const { error } = await supabase.from('workout_plans').insert([newPlan])
        if (!error) {
            fetchPlans()
        } else {
            alert("Failed to duplicate plan")
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this workout plan?")) {
            const { error } = await supabase.from('workout_plans').delete().eq('id', id)
            if (!error) {
                fetchPlans()
            } else {
                alert("Failed to delete plan")
            }
        }
    }

    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' ? true : plan.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <Activity className="h-8 w-8 text-blue-500" /> Workout Plans
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage and assign your workout routines.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                        <Input 
                            placeholder="Search workout plans..." 
                            className="pl-10 h-10 w-64 bg-card border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="secondary"
                        onClick={async () => {
                            const title = prompt("What kind of workout plan do you want to generate (e.g. '4-Day Split for Mass')?");
                            if (title) {
                                const newPlan = {
                                    name: title,
                                    description: "AI Generated Plan",
                                    frequency_per_week: 4,
                                    focus: "Full Body",
                                    status: "draft"
                                };
                                await supabase.from('workout_plans').insert([newPlan]);
                                fetchPlans();
                            }
                        }}
                    >
                        <Wand2 className="h-4 w-4 mr-2" /> AI Generate
                    </Button>
                    <Link href="/dashboard/plans/workouts/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
                            <Plus className="h-4 w-4 mr-2" /> Create Workout Plan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 border-b pb-2">
                {['all', 'active', 'draft', 'archived'].map((status) => (
                    <Button 
                        key={status}
                        variant={statusFilter === status ? "default" : "ghost"} 
                        className={statusFilter === status ? "bg-blue-600 hover:bg-blue-700 text-white capitalize font-bold" : "capitalize"}
                        onClick={() => setStatusFilter(status)}
                        size="sm"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="p-12 text-center">Loading...</div>
            ) : filteredPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed">
                    <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Workout Plans Found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">Create workout routines to quickly assign to your clients.</p>
                    <Link href="/dashboard/plans/workouts/new">
                        <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white"><Plus className="h-4 w-4 mr-2" /> Create Plan</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                    {filteredPlans.map((plan: any, index: number) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="h-full"
                        >
                            <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-border bg-gradient-to-br from-card to-blue-500/5 overflow-hidden flex flex-col rounded-2xl h-full min-h-[400px]">
                                <CardHeader className="border-b bg-blue-500/10 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl font-bold line-clamp-1 capitalize" title={plan.title}>{plan.title}</CardTitle>
                                            <CardDescription className="mt-1 flex items-center gap-2">
                                                <span className="bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-bold capitalize">{plan.type}</span>
                                                <span className="font-mono text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">• {plan.duration}</span>
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-1 -mt-2 -mr-2">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-black/5" onClick={() => handleDuplicate(plan)} title="Duplicate Plan">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(plan.id)} title="Delete Plan">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 flex-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Active Clients</span>
                                            <span className="font-black text-2xl flex items-center gap-2">
                                                {plan.clientsActive} <Users className="h-5 w-5 text-muted-foreground opacity-50" />
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Created On</span>
                                            <span className="font-medium text-foreground">{plan.lastUpdated}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 border-t bg-muted/10 gap-2">
                                    <div className="flex-1">
                                        <AssignToClientDialog planId={plan.id} planName={plan.title} planType="workout" />
                                    </div>
                                    <Link href={`/dashboard/plans/workouts/${plan.id}`}>
                                        <Button variant="outline" size="icon" title="Edit Plan" className="bg-white hover:bg-gray-100">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
