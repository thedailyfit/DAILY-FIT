"use client";

import { PtClientsTable } from "@/components/gym/pt-clients-table";
import { ImportClientsDialog } from "@/components/clients/import-clients-dialog";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedPage, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function PtClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [dietPlans, setDietPlans] = useState<any[]>([]);
    const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();

            const { data: members } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: trainersData } = await supabase.from('trainers').select('*');
            const { data: diets } = await supabase.from('diet_plans').select('id, name');
            const { data: workouts } = await supabase.from('workout_plans').select('id, name');

            const mappedClients = (members || []).map((m: any) => ({
                ...m,
                id: m.member_id,
                phone: m.whatsapp_id || m.phone_number || "",
                status: m.status || 'Active',
                planName: 'N/A',
                nextPaymentDate: null,
                lastActive: null
            }));

            setClients(mappedClients);
            setTrainers(trainersData || [{ id: 'mock1', name: 'Alice Trainer' }]);
            setDietPlans(diets || []);
            setWorkoutPlans(workouts || []);
        }
        loadData();
    }, []);

    return (
        <AnimatedPage>
            <div className="p-8 space-y-6 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Personal Training</h1>
                        <p className="text-muted-foreground font-medium">Manage PT clients, assignments, and progress.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <ThemeSwitcher variant="gym" />
                        <ImportClientsDialog />
                        <Button className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-10 px-6 shadow-lg transition-all">
                            <UserPlus className="mr-2 h-4 w-4" /> Add PT Client
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <SlideIn direction="down" delay={0.1}>
                    <Card className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search PT clients..."
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 text-foreground placeholder:text-muted-foreground"
                        />
                    </Card>
                </SlideIn>

                {/* Table */}
                <SlideIn direction="up" delay={0.2}>
                    <PtClientsTable
                        clients={clients}
                        trainers={trainers}
                        dietPlans={dietPlans}
                        workoutPlans={workoutPlans}
                    />
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
