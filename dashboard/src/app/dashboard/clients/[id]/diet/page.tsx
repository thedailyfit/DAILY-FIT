import { createClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DietEditorWrapper } from "@/components/dashboard/diet-editor-wrapper"

async function getClientAndPlan(id: string) {
    const supabase = createClient()
    const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()

    const { data: mealPlan } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('member_id', id)
        .eq('status', 'active')
        .single()

    if (!member) return null

    return { member, mealPlan }
}

export default async function DietEditorPage({ params }: { params: { id: string } }) {
    const data = await getClientAndPlan(params.id)

    if (!data) {
        notFound()
    }

    const { member, mealPlan } = data

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/clients/${member.id}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold">Custom Diet Plan</h1>
                            <Badge variant="secondary">Client-Specific</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For {member.name} • {member.goal.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Save as Template</Button>
                    <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <DietEditorWrapper
                initialData={mealPlan || { plan_data: { daily_calories: 2000, meals: [] } }}
                member={member}
            />
        </div>
    )
}
