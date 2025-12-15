"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";
import { useState } from "react";

interface AiGenerationDialogProps {
    onGenerate: (profile: { goal: string; calories: string; diet: string }) => void;
}

export function AiGenerationDialog({ onGenerate }: AiGenerationDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [goal, setGoal] = useState("");
    const [calories, setCalories] = useState("");
    const [diet, setDiet] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate async if needed, but the actual generation happens in parent callback usually
        // Here we just pass data
        await onGenerate({ goal, calories, diet });
        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Generate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate Meal Plan</DialogTitle>
                    <DialogDescription>
                        Use AI to create a balanced meal plan based on requirements.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="goal">Goal</Label>
                        <Input
                            id="goal"
                            placeholder="e.g. Fat Loss"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="calories">Target Calories</Label>
                        <Input
                            id="calories"
                            placeholder="e.g. 1800"
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="diet">Diet Preference</Label>
                        <Input
                            id="diet"
                            placeholder="e.g. Vegetarian, High Protein"
                            value={diet}
                            onChange={(e) => setDiet(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Plan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
