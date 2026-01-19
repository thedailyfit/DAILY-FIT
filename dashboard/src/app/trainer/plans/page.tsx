"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText,
    Dumbbell,
    UtensilsCrossed,
    Star,
    Copy,
    Eye,
    Building2
} from "lucide-react";

interface Plan {
    id: string;
    name: string;
    description: string;
    type: 'workout' | 'diet';
    created_at: string;
    is_template: boolean;
}

export default function TrainerPlansPage() {
    const [workoutPlans, setWorkoutPlans] = useState<Plan[]>([]);
    const [dietPlans, setDietPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [gymName, setGymName] = useState("");

    const supabase = createClient();

    useEffect(() => {
        fetchGymPlans();
    }, []);

    const fetchGymPlans = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer's gym
            const { data: staff } = await supabase
                .from('staff')
                .select('gym_id')
                .eq('auth_id', user.id)
                .single();

            if (!staff) return;

            // Get gym name
            const { data: gym } = await supabase
                .from('gyms')
                .select('gym_name')
                .eq('gym_id', staff.gym_id)
                .single();

            if (gym) setGymName(gym.gym_name);

            // Fetch workout templates from gym
            const { data: workouts } = await supabase
                .from('workout_templates')
                .select('*')
                .eq('gym_id', staff.gym_id)
                .eq('is_template', true);

            // Fetch diet templates from gym
            const { data: diets } = await supabase
                .from('diet_templates')
                .select('*')
                .eq('gym_id', staff.gym_id)
                .eq('is_template', true);

            setWorkoutPlans(workouts?.map(w => ({
                id: w.template_id || w.id,
                name: w.template_name || w.name || 'Workout Plan',
                description: w.description || 'Gym recommended workout',
                type: 'workout',
                created_at: w.created_at,
                is_template: true
            })) || []);

            setDietPlans(diets?.map(d => ({
                id: d.template_id || d.id,
                name: d.template_name || d.name || 'Diet Plan',
                description: d.description || 'Gym recommended diet',
                type: 'diet',
                created_at: d.created_at,
                is_template: true
            })) || []);

        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const PlanCard = ({ plan }: { plan: Plan }) => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {plan.type === 'workout' ? (
                            <Dumbbell className="h-5 w-5 text-orange-500" />
                        ) : (
                            <UtensilsCrossed className="h-5 w-5 text-green-500" />
                        )}
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                        <Building2 className="h-3 w-3 mr-1" />
                        Gym Admin
                    </Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Recommended
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Button>
                        <Button size="sm" className="bg-primary">
                            <Copy className="h-4 w-4 mr-1" />
                            Use for Client
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    Gym Plans
                </h1>
                <p className="text-muted-foreground mt-1">
                    {gymName && <Badge variant="outline" className="mr-2">{gymName}</Badge>}
                    Templates created by your gym admin
                </p>
            </div>

            {/* Plans Tabs */}
            <Tabs defaultValue="workouts" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="workouts" className="gap-2">
                        <Dumbbell className="h-4 w-4" />
                        Workouts ({workoutPlans.length})
                    </TabsTrigger>
                    <TabsTrigger value="diets" className="gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        Diets ({dietPlans.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="workouts" className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : workoutPlans.length === 0 ? (
                        <Card className="py-12">
                            <div className="text-center">
                                <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No workout templates yet</h3>
                                <p className="text-muted-foreground">
                                    Your gym admin hasn't created any workout templates yet.
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {workoutPlans.map((plan) => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="diets" className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : dietPlans.length === 0 ? (
                        <Card className="py-12">
                            <div className="text-center">
                                <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No diet templates yet</h3>
                                <p className="text-muted-foreground">
                                    Your gym admin hasn't created any diet templates yet.
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dietPlans.map((plan) => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
