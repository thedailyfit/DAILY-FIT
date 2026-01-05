"use client";

import { TrainersTable } from "@/components/gym/trainers-table";
import { AddTrainerDialog } from "@/components/gym/add-trainer-dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedPage } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Mock data for demo since we're client component now
const mockTrainers = [
    { id: "1", name: "Alice Fit", email: "alice@gym.com", phone: "555-1234", shift_start: "06:00", shift_end: "14:00", salary: 3500, status: "Active", performance_code: "A1" },
    { id: "2", name: "Bob Builder", email: "bob@gym.com", phone: "555-5678", shift_start: "14:00", shift_end: "22:00", salary: 3200, status: "Active", performance_code: "B2" },
    { id: "3", name: "Charlie Cardio", email: "charlie@gym.com", phone: "555-9999", shift_start: "06:00", shift_end: "22:00", salary: 4000, status: "Active", performance_code: "A1" },
];

export default function GymTrainersPage() {
    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Trainer Management</h1>
                        <p className="text-muted-foreground font-medium">Manage staff, shifts, and performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher />
                        <AddTrainerDialog />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search trainers..."
                        className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-muted-foreground"
                    />
                </div>

                <TrainersTable trainers={mockTrainers} />
            </div>
        </AnimatedPage>
    );
}
