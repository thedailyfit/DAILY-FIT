"use client";

import * as React from "react";
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

export type WorkoutPlan = {
    id: string;
    name: string;
    level: string | null;
    frequencyPerWeek: number | null;
    focus: string | null;
    planType: "template" | "custom";
    tags: string[];
    isActive: boolean;
    activeClientsCount: number;
};

type WorkoutPlansTableProps = {
    plans: WorkoutPlan[];
};

export function WorkoutPlansTable({ plans }: WorkoutPlansTableProps) {
    const [search, setSearch] = React.useState("");
    const [levelFilter, setLevelFilter] = React.useState<string>("all");
    const [focusFilter, setFocusFilter] = React.useState<string>("all");

    const filteredPlans = React.useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch =
                plan.name.toLowerCase().includes(search.toLowerCase());

            const matchesLevel =
                levelFilter === "all" ? true : (plan.level || "") === levelFilter;

            const matchesFocus =
                focusFilter === "all" ? true : (plan.focus || "") === focusFilter;

            return matchesSearch && matchesLevel && matchesFocus;
        });
    }, [plans, search, levelFilter, focusFilter]);

    function formatLevel(level: string | null) {
        if (!level) return "-";
        switch (level) {
            case "beginner":
                return "Beginner";
            case "intermediate":
                return "Intermediate";
            case "advanced":
                return "Advanced";
            default:
                return level;
        }
    }

    function formatFocus(focus: string | null) {
        if (!focus) return "-";
        switch (focus) {
            case "strength":
                return "Strength";
            case "hypertrophy":
                return "Hypertrophy";
            case "performance":
                return "Performance";
            case "fat_loss":
                return "Fat Loss";
            case "general_fitness":
                return "General Fitness";
            default:
                return focus;
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Input
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Select
                        value={levelFilter}
                        onValueChange={(val) => setLevelFilter(val)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={focusFilter}
                        onValueChange={(val) => setFocusFilter(val)}
                    >
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Focus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Focus</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="fat_loss">Fat Loss</SelectItem>
                            <SelectItem value="general_fitness">General Fitness</SelectItem>
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
                            <TableHead>Level</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Focus</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No workout plans found. Try adjusting your filters or create a new plan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPlans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-muted/40">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{plan.name}</span>
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
                                        {formatLevel(plan.level)}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {plan.frequencyPerWeek
                                            ? `${plan.frequencyPerWeek} days/week`
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {formatFocus(plan.focus)}
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
                                                        // TODO: navigate to /dashboard/plans/workouts/[id]
                                                        console.log("View/Edit workout plan", plan.id);
                                                    }}
                                                >
                                                    View / Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // TODO: duplicate
                                                        console.log("Duplicate workout plan", plan.id);
                                                    }}
                                                >
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // TODO: archive
                                                        console.log("Archive workout plan", plan.id);
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
