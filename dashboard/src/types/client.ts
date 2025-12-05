export type Client = {
    id: string
    name: string
    phone: string
    status: 'active' | 'inactive' | 'pending'
    goal: string
    height: number | null
    weight: number | null
    created_at: string
    last_active?: string
}
