"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dumbbell,
    Plus,
    Search,
    Clock,
    Users,
    Copy,
    Edit,
    Trash2,
    Target
} from "lucide-react";

interface Workout {
    id: string;
    name: string;
    description: string;
    duration: number;
    exercises: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    assignedClients: number;
    isTemplate: boolean;
    createdAt: string;
}

export default function TrainerWorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer's staff ID
            const { data: staff } = await supabase
                .from('staff')
                .select('id, gym_id')
                .eq('auth_id', user.id)
                .single();

            if (!staff) return;

            // Fetch workout templates
            const { data: workoutData } = await supabase
                .from('workout_templates')
                .select('*')
                .or(`trainer_id.eq.${staff.id},gym_id.eq.${staff.gym_id}`);

            setWorkouts(workoutData?.map(w => ({
                id: w.template_id || w.id,
                name: w.template_name || w.name || 'Workout',
                description: w.description || '',
                duration: w.duration_minutes || 45,
                exercises: w.exercises?.length || 0,
                difficulty: w.difficulty || 'intermediate',
                assignedClients: 0,
                isTemplate: w.is_template || false,
                createdAt: w.created_at
            })) || []);

        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredWorkouts = workouts.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const WorkoutCard = ({ workout }: { workout: Workout }) => (
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{workout.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{workout.description}</CardDescription>
                        </div>
                    </div>
                    {workout.isTemplate && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            Template
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {workout.duration} min
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Target className="h-3 w-3" />
                        {workout.exercises} exercises
                    </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {workout.assignedClients} clients
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <Dumbbell className="h-8 w-8 text-orange-500" />
                        My Workouts
                    </h1>
                    <p className="text-muted-foreground mt-1">Create and manage workout plans for your clients</p>
                </div>
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4" />
                    Create Workout
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search workouts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All ({workouts.length})</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {loading ? (
                        <div className="text-center py-8">Loading workouts...</div>
                    ) : filteredWorkouts.length === 0 ? (
                        <Card className="py-12">
                            <div className="text-center">
                                <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No workouts yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Create your first workout plan to assign to clients
                                </p>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First Workout
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredWorkouts.map((workout) => (
                                <WorkoutCard key={workout.id} workout={workout} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="templates">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkouts.filter(w => w.isTemplate).map((workout) => (
                            <WorkoutCard key={workout.id} workout={workout} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="assigned">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkouts.filter(w => w.assignedClients > 0).map((workout) => (
                            <WorkoutCard key={workout.id} workout={workout} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
