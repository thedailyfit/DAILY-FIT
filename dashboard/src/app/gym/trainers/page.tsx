
import { TrainersTable } from "@/components/gym/trainers-table";
import { AddTrainerDialog } from "@/components/gym/add-trainer-dialog";
import { createClient } from "@/lib/supabase";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function GymTrainersPage() {
    const supabase = createClient();

    // Fetch trainers
    const { data: trainersData, error } = await supabase
        .from('trainers')
        .select('*');

    if (error) {
        console.error("Error fetching trainers:", error);
    }

    const trainers = trainersData || [];

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Trainer Management</h1>
                    <p className="text-zinc-500 font-medium">Manage staff, shifts, and performance.</p>
                </div>
                <div>
                    <AddTrainerDialog />
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                <Search className="h-4 w-4 text-zinc-400" />
                <Input
                    placeholder="Search trainers..."
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-zinc-400"
                />
            </div>

            <TrainersTable trainers={trainers} />
        </div>
    );
}
