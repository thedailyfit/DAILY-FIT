"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type DietPlan = {
    id: string;
    name: string;
    goal: string | null;
    totalCalories: number | null;
    dietPreference: string | null;
    planType: "template" | "custom";
    tags: string[];
    isActive: boolean;
    activeClientsCount: number;
};

type DietPlansTableProps = {
    plans: DietPlan[];
};

export function DietPlansTable({ plans }: DietPlansTableProps) {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [goalFilter, setGoalFilter] = React.useState<string>("all");
    const [typeFilter, setTypeFilter] = React.useState<string>("all");

    const filteredPlans = React.useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch =
                plan.name.toLowerCase().includes(search.toLowerCase()) ||
                (plan.dietPreference || "").toLowerCase().includes(search.toLowerCase());

            const matchesGoal =
                goalFilter === "all" ? true : (plan.goal || "") === goalFilter;

            const matchesType =
                typeFilter === "all" ? true : plan.planType === (typeFilter as "template" | "custom");

            return matchesSearch && matchesGoal && matchesType;
        });
    }, [plans, search, goalFilter, typeFilter]);

    function formatGoal(goal: string | null) {
        if (!goal) return "-";
        switch (goal) {
            case "fat_loss":
                return "Fat Loss";
            case "muscle_gain":
                return "Muscle Gain";
            case "performance":
                return "Performance";
            case "general_fitness":
                return "General Fitness";
            default:
                return goal;
        }
    }

    function formatDietPref(pref: string | null) {
        if (!pref) return "-";
        switch (pref) {
            case "veg":
                return "Veg";
            case "non_veg":
                return "Non-Veg";
            case "vegan":
                return "Vegan";
            case "egg":
            case "eggitarian":
                return "Egg";
            default:
                return pref;
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Input
                    placeholder="Search by name or diet type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <div className="flex items-center gap-2">
                    <Select
                        value={goalFilter}
                        onValueChange={(val) => setGoalFilter(val)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Goal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Goals</SelectItem>
                            <SelectItem value="fat_loss">Fat Loss</SelectItem>
                            <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="general_fitness">General Fitness</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={typeFilter}
                        onValueChange={(val) => setTypeFilter(val)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="template">Template</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Goal</TableHead>
                            <TableHead>Calories</TableHead>
                            <TableHead>Diet</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No diet plans found. Try adjusting your filters or add a new plan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPlans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-muted/40">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {plan.name}
                                            </span>
                                            {plan.tags?.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {plan.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-[10px]">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {formatGoal(plan.goal)}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {plan.totalCalories ? `${plan.totalCalories} kcal` : "-"}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {formatDietPref(plan.dietPreference)}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        <Badge variant="outline">
                                            {plan.planType === "template" ? "Template" : "Custom"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {plan.activeClientsCount} client
                                        {plan.activeClientsCount === 1 ? "" : "s"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        router.push(`/dashboard/plans/diets/${plan.id}`);
                                                    }}
                                                >
                                                    View / Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // TODO: duplicate plan via API
                                                        console.log("Duplicate diet plan", plan.id);
                                                    }}
                                                >
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // TODO: archive plan via API
                                                        console.log("Archive diet plan", plan.id);
                                                    }}
                                                >
                                                    Archive
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
