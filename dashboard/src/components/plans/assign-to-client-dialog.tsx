"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase"

export function AssignToClientDialog({ 
    planId, 
    planName, 
    planType 
}: { 
    planId: string, 
    planName: string, 
    planType: 'diet' | 'workout' | 'program' 
}) {
    const [open, setOpen] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [selectedClient, setSelectedClient] = useState<string>("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            fetchClients()
        }
    }, [open])

    const fetchClients = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get trainer's clients
        const { data } = await supabase
            .from('members')
            .select('member_id, name')
            .eq('trainer_id', user.id) // Assuming members belong to the logged in trainer

        if (data) {
            setClients(data)
        }
    }

    const handleAssign = async () => {
        if (!selectedClient) return
        setLoading(true)
        
        try {
            const supabase = createClient()
            let error
            
            if (planType === 'diet') {
                const { error: err } = await supabase.from('client_programs').insert({
                    client_id: selectedClient,
                    program: { diet_plan_id: planId, name: planName },
                    is_current: true,
                    start_date: new Date().toISOString().split('T')[0]
                })
                error = err
            } else if (planType === 'workout') {
                const { error: err } = await supabase.from('client_programs').insert({
                    client_id: selectedClient,
                    program: { workout_plan_id: planId, name: planName },
                    is_current: true,
                    start_date: new Date().toISOString().split('T')[0]
                })
                error = err
            } else if (planType === 'program') {
                const { error: err } = await supabase.from('client_programs').insert({
                    client_id: selectedClient,
                    program_id: planId,
                    is_current: true,
                    start_date: new Date().toISOString().split('T')[0]
                })
                error = err
            }

            if (error) throw error

            alert("Successfully assigned to client!")
            setOpen(false)
        } catch (err) {
            console.error("Error assigning plan:", err)
            alert("Failed to assign plan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full font-bold bg-green-600 hover:bg-green-700 text-white">
                    Assign to Client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign {planName}</DialogTitle>
                    <DialogDescription>
                        Select a client to assign this {planType} to.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map(client => (
                                <SelectItem key={client.member_id} value={client.member_id}>
                                    {client.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        className="w-full" 
                        onClick={handleAssign} 
                        disabled={!selectedClient || loading}
                    >
                        {loading ? "Assigning..." : "Confirm Assignment"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
