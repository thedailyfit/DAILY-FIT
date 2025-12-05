import { createClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MessageSquare, TrendingUp, Utensils, Dumbbell, Calendar } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClientWeightChart } from "./weight-chart"
import { MealPlanEditor } from "@/components/dashboard/meal-plan-editor"

async function getClient(id: string) {
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

    const { data: workoutPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('member_id', id)
        .eq('status', 'active')
        .single()

    if (!member) return null

    return { member, mealPlan, workoutPlan }
}

export default async function ClientPage({ params }: { params: { id: string } }) {
    const data = await getClient(params.id)

    if (!data) {
        notFound()
    }

    const { member, mealPlan, workoutPlan } = data

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{member.name}</h1>
                    <p className="text-sm text-muted-foreground">Client Profile</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                    </Button>
                    <Button size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <Card className="h-fit">
                    <CardContent className="pt-6 text-center space-y-4">
                        <Avatar className="w-24 h-24 mx-auto">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{member.name}</h2>
                            <p className="text-sm text-muted-foreground">{member.phone}</p>
                        </div>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="px-4 py-1">
                            {member.status.toUpperCase()}
                        </Badge>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                                <p className="text-xs text-muted-foreground">Age</p>
                                <p className="font-medium">{member.age || '--'} yrs</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Gender</p>
                                <p className="font-medium capitalize">{member.gender || '--'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Height</p>
                                <p className="font-medium">{member.height || '--'} cm</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Weight</p>
                                <p className="font-medium">{member.weight || '--'} kg</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="text-left">
                            <p className="text-xs text-muted-foreground mb-1">Primary Goal</p>
                            <p className="text-sm font-medium leading-tight">{member.goal || 'No goal set'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                        <TabsTrigger value="fitness">Fitness</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                                    <Utensils className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{mealPlan?.plan_data?.daily_calories || '--'}</div>
                                    <p className="text-xs text-muted-foreground">kcal target</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Workouts/Week</CardTitle>
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{workoutPlan?.plan_data?.days_per_week || '--'}</div>
                                    <p className="text-xs text-muted-foreground">sessions scheduled</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Plan Duration</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4</div>
                                    <p className="text-xs text-muted-foreground">weeks remaining</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Weight Progress</CardTitle>
                                <CardDescription>Last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ClientWeightChart />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* NUTRITION TAB */}
                    <TabsContent value="nutrition" className="mt-6">
                        {mealPlan ? (
                            <MealPlanEditor initialData={mealPlan} clientId={member.id} />
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    No active meal plan found.
                                    <Button className="mt-4" variant="outline">Create Plan</Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* FITNESS TAB */}
                    <TabsContent value="fitness" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Workout Plan</CardTitle>
                                <CardDescription>Active since {new Date(workoutPlan?.created_at || Date.now()).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                    <pre className="text-sm">{JSON.stringify(workoutPlan?.plan_data, null, 2)}</pre>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PROGRESS TAB */}
                    <TabsContent value="progress" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Analytics</CardTitle>
                                <CardDescription>Coming soon...</CardDescription>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
