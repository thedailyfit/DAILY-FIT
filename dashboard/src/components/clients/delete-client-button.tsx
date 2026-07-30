"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function DeleteClientButton({ clientId }: { clientId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
            return
        }

        setIsDeleting(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.from('members').delete().eq('member_id', clientId)

            if (error) throw error

            router.push('/dashboard/clients')
            router.refresh()
        } catch (error) {
            console.error("Error deleting client:", error)
            alert("Failed to delete client")
            setIsDeleting(false)
        }
    }

    return (
        <Button 
            variant="outline" 
            className="border-red-500/20 text-red-600 hover:bg-red-50 hover:border-red-500"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <span className="flex items-center gap-2">
                {isDeleting ? "Deleting..." : "Delete Client"}
            </span>
        </Button>
    )
}
