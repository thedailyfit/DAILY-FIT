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
exports.DietPlansTable = DietPlansTable;
const React = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const table_1 = require("@/components/ui/table");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
function DietPlansTable({ plans }) {
    // ... (rest of filtering logic unchanged)
    const router = (0, navigation_1.useRouter)();
    const [search, setSearch] = React.useState("");
    const [goalFilter, setGoalFilter] = React.useState("all");
    const [typeFilter, setTypeFilter] = React.useState("all");
    const filteredPlans = React.useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
                (plan.dietPreference || "").toLowerCase().includes(search.toLowerCase());
            const matchesGoal = goalFilter === "all" ? true : (plan.goal || "") === goalFilter;
            const matchesType = typeFilter === "all" ? true : plan.planType === typeFilter;
            return matchesSearch && matchesGoal && matchesType;
        });
    }, [plans, search, goalFilter, typeFilter]);
    function formatGoal(goal) {
        if (!goal)
            return "-";
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
    function formatDietPref(pref) {
        if (!pref)
            return "-";
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
    return (<div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input_1.Input placeholder="Search by name or diet type..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm"/>

                <div className="flex items-center gap-2">
                    <select_1.Select value={goalFilter} onValueChange={(val) => setGoalFilter(val)}>
                        <select_1.SelectTrigger className="w-[160px]">
                            <select_1.SelectValue placeholder="Goal"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Goals</select_1.SelectItem>
                            <select_1.SelectItem value="fat_loss">Fat Loss</select_1.SelectItem>
                            <select_1.SelectItem value="muscle_gain">Muscle Gain</select_1.SelectItem>
                            <select_1.SelectItem value="performance">Performance</select_1.SelectItem>
                            <select_1.SelectItem value="general_fitness">General Fitness</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>

                    <select_1.Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
                        <select_1.SelectTrigger className="w-[140px]">
                            <select_1.SelectValue placeholder="Type"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Types</select_1.SelectItem>
                            <select_1.SelectItem value="template">Template</select_1.SelectItem>
                            <select_1.SelectItem value="custom">Custom</select_1.SelectItem>
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
                            <table_1.TableHead>Goal</table_1.TableHead>
                            <table_1.TableHead>Calories</table_1.TableHead>
                            <table_1.TableHead>Protein</table_1.TableHead> {/* New Header */}
                            <table_1.TableHead>Diet</table_1.TableHead>
                            <table_1.TableHead>Type</table_1.TableHead>
                            <table_1.TableHead>Usage</table_1.TableHead>
                            <table_1.TableHead className="w-[72px] text-right">Actions</table_1.TableHead>
                        </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                        {filteredPlans.length === 0 ? (<table_1.TableRow>
                                <table_1.TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                                    No diet plans found. Try adjusting your filters or add a new plan.
                                </table_1.TableCell>
                            </table_1.TableRow>) : (filteredPlans.map((plan) => {
            var _a;
            return (<table_1.TableRow key={plan.id} className="hover:bg-muted/40">
                                    <table_1.TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {plan.name}
                                            </span>
                                            {((_a = plan.tags) === null || _a === void 0 ? void 0 : _a.length) > 0 && (<div className="mt-1 flex flex-wrap gap-1">
                                                    {plan.tags.map((tag) => (<badge_1.Badge key={tag} variant="outline" className="text-[10px]">
                                                            {tag}
                                                        </badge_1.Badge>))}
                                                </div>)}
                                        </div>
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {formatGoal(plan.goal)}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {plan.totalCalories ? `${plan.totalCalories} kcal` : "-"}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {plan.protein ? `${plan.protein}g` : "-"}
                                    </table_1.TableCell>
                                    <table_1.TableCell className="text-xs">
                                        {formatDietPref(plan.dietPreference)}
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
                    router.push(`/dashboard/plans/diets/${plan.id}`);
                }}>
                                                    View / Edit
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                    // TODO: duplicate plan via API
                    console.log("Duplicate diet plan", plan.id);
                }}>
                                                    Duplicate
                                                </dropdown_menu_1.DropdownMenuItem>
                                                <dropdown_menu_1.DropdownMenuItem onClick={() => {
                    // TODO: archive plan via API
                    console.log("Archive diet plan", plan.id);
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
