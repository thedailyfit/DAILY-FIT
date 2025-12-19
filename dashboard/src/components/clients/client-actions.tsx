"use client"

import { useState } from "react"
import { MoreHorizontal, Trash, Power, PowerOff, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Client } from "@/types/client"
import { EditClientDialog } from "./edit-client-dialog"

interface ClientActionsProps {
    client: Client
}

export function ClientActions({ client }: ClientActionsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    async function toggleStatus() {
        if (loading) return
        setLoading(true)
        try {
            const newStatus = client.status === 'Active' ? 'Inactive' : 'Active'
            const { error } = await supabase
                .from('members')
                .update({ status: newStatus })
                .eq('member_id', client.id)

            if (error) throw error
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    async function deleteClient() {
        if (!confirm("Are you sure you want to delete this client? This cannot be undone.")) return

        if (loading) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('member_id', client.id)

            if (error) throw error
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to delete client")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(client.phone)}
                >
                    Copy Phone
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clients/${client.id}`}>View Details</Link>
                </DropdownMenuItem>

                {/* We trigger the Edit Dialog from here? 
                    Actually EditDialog is a trigger button. 
                    We can render it here but that puts a button inside a menu item which is bad.
                    Better to put it as a separate action or handle open state.
                    For now, let's keep it simple.
                */}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={toggleStatus}>
                    {client.status === 'Active' ? (
                        <>
                            <PowerOff className="mr-2 h-4 w-4 text-orange-500" />
                            Mark Inactive
                        </>
                    ) : (
                        <>
                            <Power className="mr-2 h-4 w-4 text-green-500" />
                            Mark Active
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteClient} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Client
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
