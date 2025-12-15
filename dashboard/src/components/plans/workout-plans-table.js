"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlansTable = WorkoutPlansTable;
const React = __importStar(require("react"));
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const table_1 = require("@/components/ui/table");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
function WorkoutPlansTable({ plans }) {
    const [search, setSearch] = React.useState("");
    const [levelFilter, setLevelFilter] = React.useState("all");
    const [focusFilter, setFocusFilter] = React.useState("all");
    const filteredPlans = React.useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase());
            const matchesLevel = levelFilter === "all" ? true : (plan.level || "") === levelFilter;
            const matchesFocus = focusFilter === "all" ? true : (plan.focus || "") === focusFilter;
            return matchesSearch && matchesLevel && matchesFocus;
        });
    }, [plans, search, levelFilter, focusFilter]);
    function formatLevel(level) {
        if (!level)
            return "-";
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
    function formatFocus(focus) {
        if (!focus)
            return "-";
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
    return (<div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input_1.Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm"/>
                <div className="flex items-center gap-2">
                    <select_1.Select value={levelFilter} onValueChange={(val) => setLevelFilter(val)}>
                        <select_1.SelectTrigger className="w-[150px]">
                            <select_1.SelectValue placeholder="Level"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Levels</select_1.SelectItem>
                            <select_1.SelectItem value="beginner">Beginner</select_1.SelectItem>
                            <select_1.SelectItem value="intermediate">Intermediate</select_1.SelectItem>
                            <select_1.SelectItem value="advanced">Advanced</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>

                    <select_1.Select value={focusFilter} onValueChange={(val) => setFocusFilter(val)}>
                        <select_1.SelectTrigger className="w-[170px]">
                            <select_1.SelectValue placeholder="Focus"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Focus</select_1.SelectItem>
                            <select_1.SelectItem value="strength">Strength</select_1.SelectItem>
                            <select_1.SelectItem value="hypertrophy">Hypertrophy</select_1.SelectItem>
                            <select_1.SelectItem value="performance">Performance</select_1.SelectItem>
                            <select_1.SelectItem value="fat_loss">Fat Loss</select_1.SelectItem>
                            <select_1.SelectItem value="general_fitness">General Fitness</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table_1.Table>
                    <table_1.TableHeader>
                        <table_1.TableRow>
                            <table_1.TableHead>Name</table_1.TableHead>
                            <table_1.TableHead>Level</table_1.TableHead>
                            <table_1.TableHead>Frequency</table_1.TableHead>
                            <table_1.TableHead>Focus</table_1.TableHead>
                            <table_1.TableHead>Type</table_1.TableHead>
                            <table_1.TableHead>Usage</table_1.TableHead>
                            <table_1.TableHead className="w-[72px] text-right">Actions</table_1.TableHead>
                        </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {filteredPlans.length === 0 ? (<table_1.TableRow>
                                <table_1.TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                                    No workout plans found. Try adjusting your filters or create a new plan.
                                </table_1.TableCell>
                            </table_1.TableRow>) : (filteredPlans.map((plan) => {
            var _a;
            return (<table_1.TableRow key={plan.id} className="hover:bg-muted/40">
                                    <table_1.TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{plan.name}</span>
                                            {((_a = plan.tags) === null || _a === void 0 ? void 0 : _a.length) > 0 && (<div className="mt-1 flex flex-wrap gap-1">
                                                    {plan.tags.map((tag) => (<badge_1.Badge key={tag} variant="outline" className="text-[10px]">
                                                            {tag}
                                                        </badge_1.Badge>))}
                                                </div>)}
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {formatLevel(plan.level)}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {plan.frequencyPerWeek
                    ? `${plan.frequencyPerWeek} days/week`
                    : "-"}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {formatFocus(plan.focus)}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        <badge_1.Badge variant="outline">
                                            {plan.planType === "template" ? "Template" : "Custom"}
                                        </badge_1.Badge>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {plan.activeClientsCount} client
                                        {plan.activeClientsCount === 1 ? "" : "s"}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-right">
                                        <dropdown_menu_1.DropdownMenu>
                                            <dropdown_menu_1.DropdownMenuTrigger asChild>
                                                <button_1.Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">Open menu</span>
                                                </button_1.Button>
                                            </dropdown_menu_1.DropdownMenuTrigger>
                                            <dropdown_menu_1.DropdownMenuContent align="end">
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                    // TODO: navigate to /dashboard/plans/workouts/[id]
                    console.log("View/Edit workout plan", plan.id);
                }}>
                                                    View / Edit
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                    // TODO: duplicate
                    console.log("Duplicate workout plan", plan.id);
                }}>
                                                    Duplicate
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                    // TODO: archive
                    console.log("Archive workout plan", plan.id);
                }}>
                                                    Archive
                                                </dropdown_menu_1.DropdownMenuItem>
                                            </dropdown_menu_1.DropdownMenuContent>
                                        </dropdown_menu_1.DropdownMenu>
                                    </table_1.TableCell>
                                </table_1.TableRow>);
        }))}
                    </table_1.TableBody>
                </table_1.Table>
            </div>
        </div>);
}
