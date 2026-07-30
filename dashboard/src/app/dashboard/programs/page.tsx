'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Plus, Search, Users, Activity, MoreVertical, Edit, Trash, Share2 } from "lucide-react"
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'

export default function ProgramsLibraryPage() {
    const [programs, setPrograms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('plan_programs')
                    .select('*')
                    .eq('trainer_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                if (data) {
                    const mapped = data.map(p => ({
                        id: p.id,
                        title: p.name,
                        duration: p.duration || 'N/A',
                        clientsActive: 0,
                        type: p.description ? (p.description.length > 20 ? p.description.substring(0, 20) + '...' : p.description) : 'Master Program',
                        lastUpdated: new Date(p.created_at).toLocaleDateString()
                    }))
                    setPrograms(mapped)
                }
            } catch (err) {
                console.error("Error fetching programs:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchPrograms()
    }, [])

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <Dumbbell className="h-8 w-8 text-primary" /> Master Programs
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Combine Workout and Diet templates into long-term master programs.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Input 
                            placeholder="Search programs..." 
                            className="pl-10 h-10 w-64 bg-card border-border"
                        />
                    </div>
                    <Link href="/dashboard/programs/builder">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
                            <Plus className="h-4 w-4 mr-2" /> Create Master Program
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse bg-card h-64 border-border"></Card>
                    ))}
                </div>
            ) : programs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Master Programs Yet</h3>
                    <p className="text-muted-foreground max-w-md mb-6">Build a long-term master program by combining your existing workout and diet templates.</p>
                    <Link href="/dashboard/programs/builder">
                        <Button className="font-bold"><Plus className="h-4 w-4 mr-2" /> Create First Master Program</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map(program => (
                        <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden flex flex-col">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-bold line-clamp-1" title={program.title}>{program.title}</CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-2">
                                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">{program.type}</span>
                                            <span>• {program.duration}</span>
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground -mt-2 -mr-2">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 flex-1">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Active Clients</span>
                                        <span className="font-black text-2xl flex items-center gap-2">
                                            {program.clientsActive} <Users className="h-5 w-5 text-muted-foreground opacity-50" />
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Last Updated</span>
                                        <span className="font-medium text-foreground">{program.lastUpdated}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 border-t bg-muted/10 gap-2">
                                <Button className="w-full font-bold bg-primary hover:bg-primary/90">
                                    Assign to Client
                                </Button>
                                <Button variant="outline" size="icon" title="Edit Program">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
