import { createClient } from "@/lib/supabase"
import { Client } from "@/types/client"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

async function getData(): Promise<Client[]> {
    const supabase = createClient()

    // Fetch members from Supabase
    // Note: In a real app, we might need to handle errors or empty states more gracefully
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching clients:', error)
        return []
    }

    // Map Supabase data to Client type if needed, or cast if it matches
    return (data || []) as Client[]
}

export default async function ClientsPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage your client roster and view their progress.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </div>

            <DataTable columns={columns} data={data} />
        </div>
    )
}
