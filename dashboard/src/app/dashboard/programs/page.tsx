'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Plus, Search, Users, Edit, Copy, Trash } from "lucide-react"
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import { motion } from "framer-motion"
import { AssignToClientDialog } from "@/components/plans/assign-to-client-dialog"
import { useRouter } from 'next/navigation'

export default function ProgramsLibraryPage() {
    const [programs, setPrograms] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    const fetchPrograms = async () => {
        setLoading(true)
        try {
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
                    lastUpdated: new Date(p.created_at).toLocaleDateString(),
                    raw: p
                }))
                setPrograms(mapped)
            }
        } catch (err) {
            console.error("Error fetching programs:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrograms()
    }, [])

    const handleDuplicate = async (program: any) => {
        const newProgram = { ...program.raw }
        delete newProgram.id
        delete newProgram.created_at
        newProgram.name = `Copy of ${program.title}`
        
        const { error } = await supabase.from('plan_programs').insert([newProgram])
        if (!error) {
            fetchPrograms()
        } else {
            alert("Failed to duplicate program")
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this program?")) {
            const { error } = await supabase.from('plan_programs').delete().eq('id', id)
            if (!error) {
                fetchPrograms()
            } else {
                alert("Failed to delete program")
            }
        }
    }

    const filteredPrograms = programs.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
            ) : filteredPrograms.length === 0 ? (
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
                    {filteredPrograms.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="h-full"
                        >
                            <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-border bg-gradient-to-br from-card to-primary/5 overflow-hidden flex flex-col rounded-2xl h-full">
                                <CardHeader className="border-b bg-primary/10 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl font-bold line-clamp-1" title={program.title}>{program.title}</CardTitle>
                                            <CardDescription className="mt-1 flex items-center gap-2">
                                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-bold">{program.type}</span>
                                                <span>• {program.duration}</span>
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-1 -mt-2 -mr-2">
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-black/5" onClick={() => handleDuplicate(program)} title="Duplicate Program">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(program.id)} title="Delete Program">
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
                                    <div className="flex-1">
                                        <AssignToClientDialog planId={program.id} planName={program.title} planType="program" />
                                    </div>
                                    <Link href={`/dashboard/programs/builder?edit=${program.id}`}>
                                        <Button variant="outline" size="icon" title="Edit Program" className="bg-white hover:bg-gray-100">
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
