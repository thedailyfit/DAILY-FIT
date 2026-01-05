import { GymProgramManager } from "@/components/gym/gym-program-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Program Builder | DailyFit Gym Admin",
    description: "Create standard workout plans.",
};

export default function GymProgramsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 bg-[#e6e6e6] min-h-screen text-black">
            <div className="flex items-center justify-between space-y-2 mb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase text-[#212121]">Program Builder</h2>
                    <p className="text-zinc-500">Create standard workout templates for your trainers.</p>
                </div>
            </div>

            <GymProgramManager />
        </div>
    );
}
