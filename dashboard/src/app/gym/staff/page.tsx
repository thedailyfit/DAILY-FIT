"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Mail, Phone } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([])
    const [gymId, setGymId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: gym } = await supabase
                .from('gyms')
                .select('gym_id')
                .eq('owner_id', user.id)
                .single()

            if (gym) {
                setGymId(gym.gym_id)
                const { data: staffMembers } = await supabase
                    .from('staff')
                    .select('*')
                    .eq('gym_id', gym.gym_id)

                setStaff(staffMembers || [])
            }
        } catch (error) {
            console.error('Error fetching staff:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        Staff Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your trainers and their permissions.
                    </p>
                </div>
                <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                    <UserPlus className="h-4 w-4" />
                    Invite Trainer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Team</CardTitle>
                    <CardDescription>
                        Trainers who have access to your gym's client base.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">Loading team...</div>
                    ) : staff.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No staff yet</h3>
                            <p className="text-muted-foreground mb-4">Invite your first trainer to get started.</p>
                            <Button variant="outline">
                                Invite Trainer
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            {member.name || 'Pending...'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={member.role === 'admin' ? "default" : "secondary"}>
                                                {member.role || 'trainer'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Mail className="h-3 w-3" /> {member.email}
                                                </span>
                                                {member.whatsapp_notification_number && (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <Phone className="h-3 w-3" /> {member.whatsapp_notification_number}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(member.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
