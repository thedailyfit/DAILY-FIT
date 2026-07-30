"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { TrainersTable } from "@/components/gym/trainers-table";
import { AddTrainerDialog } from "@/components/gym/add-trainer-dialog";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedPage } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymTrainersPage() {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('staff').select('*');
            if (error) {
                console.error("Error fetching trainers from staff:", error);
                setTrainers([]);
            } else if (data) {
                const mapped = data.map((item: any) => ({
                    id: String(item.id || item.staff_id || ""),
                    name: item.name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Unknown",
                    email: item.email || "",
                    phone: item.phone || item.phone_number || item.whatsapp_notification_number || "",
                    shift_start: item.shift_start || undefined,
                    shift_end: item.shift_end || undefined,
                    salary: item.salary ? Number(item.salary) : undefined,
                    status: item.status || "Active",
                    performance_code: item.performance_code || item.code || "N/A",
                }));
                setTrainers(mapped);
            }
        } catch (err) {
            console.error("Failed to fetch trainers:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTrainers = trainers.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Trainer Management</h1>
                        <p className="text-muted-foreground font-medium">Manage staff, shifts, and performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <AddTrainerDialog />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search trainers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-muted-foreground"
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading trainers...</span>
                    </div>
                ) : (
                    <TrainersTable trainers={filteredTrainers} />
                )}
            </div>
        </AnimatedPage>
    );
}

