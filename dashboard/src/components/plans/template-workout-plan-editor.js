"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateWorkoutPlanEditor = TemplateWorkoutPlanEditor;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const select_1 = require("@/components/ui/select");
function TemplateWorkoutPlanEditor({ initialStructure, onChange }) {
    // Ensure we have a valid structure to start with
    const [schedule, setSchedule] = (0, react_1.useState)((initialStructure === null || initialStructure === void 0 ? void 0 : initialStructure.days) || []);
    const [activeDay, setActiveDay] = (0, react_1.useState)("day-1");
    // Propagate changes to parent
    (0, react_1.useEffect)(() => {
        onChange({ days: schedule });
    }, [schedule, onChange]);
    // Helper to ensure we have data for the active day
    const getDayData = (dayIndex) => {
        return schedule[dayIndex] || { day: `Day ${dayIndex + 1}`, focus: "Rest", exercises: [] };
    };
    const updateDayFocus = (dayIndex, focus) => {
        const newSchedule = [...schedule];
        // Fill in gaps if needed
        for (let i = 0; i <= dayIndex; i++) {
            if (!newSchedule[i])
                newSchedule[i] = { day: `Day ${i + 1}`, focus: "Rest", exercises: [] };
        }
        newSchedule[dayIndex].focus = focus;
        setSchedule(newSchedule);
    };
    const addExercise = (dayIndex) => {
        const newSchedule = [...schedule];
        for (let i = 0; i <= dayIndex; i++) {
            if (!newSchedule[i])
                newSchedule[i] = { day: `Day ${i + 1}`, focus: "Rest", exercises: [] };
        }
        if (!newSchedule[dayIndex].exercises)
            newSchedule[dayIndex].exercises = [];
        newSchedule[dayIndex].exercises.push({
            name: "",
            sets: 3,
            reps: "10-12",
            rest: "60s",
            notes: ""
        });
        setSchedule(newSchedule);
    };
    const updateExercise = (dayIndex, exIndex, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].exercises[exIndex] = Object.assign(Object.assign({}, newSchedule[dayIndex].exercises[exIndex]), { [field]: value });
        setSchedule(newSchedule);
    };
    const removeExercise = (dayIndex, exIndex) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].exercises.splice(exIndex, 1);
        setSchedule(newSchedule);
    };
    return (<div className="space-y-6">
            <tabs_1.Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                <tabs_1.TabsList className="grid w-full grid-cols-7 mb-4 h-auto">
                    {[...Array(7)].map((_, i) => (<tabs_1.TabsTrigger key={i} value={`day-${i + 1}`} className="py-2">
                            Day {i + 1}
                        </tabs_1.TabsTrigger>))}
                </tabs_1.TabsList>

                {[...Array(7)].map((_, dayIndex) => {
            var _a;
            const dayData = getDayData(dayIndex);
            return (<tabs_1.TabsContent key={dayIndex} value={`day-${dayIndex + 1}`} className="space-y-4">
                            <div className="flex items-center gap-4 mb-4 p-4 border rounded-lg bg-muted/20">
                                <div className="w-1/3">
                                    <label_1.Label>Day Focus</label_1.Label>
                                    <select_1.Select value={dayData.focus} onValueChange={(val) => updateDayFocus(dayIndex, val)}>
                                        <select_1.SelectTrigger>
                                            <select_1.SelectValue placeholder="Select focus"/>
                                        </select_1.SelectTrigger>
                                        <select_1.SelectContent>
                                            <select_1.SelectItem value="Rest">Rest Day</select_1.SelectItem>
                                            <select_1.SelectItem value="Full Body">Full Body</select_1.SelectItem>
                                            <select_1.SelectItem value="Upper Body">Upper Body</select_1.SelectItem>
                                            <select_1.SelectItem value="Lower Body">Lower Body</select_1.SelectItem>
                                            <select_1.SelectItem value="Push">Push</select_1.SelectItem>
                                            <select_1.SelectItem value="Pull">Pull</select_1.SelectItem>
                                            <select_1.SelectItem value="Cardio">Cardio</select_1.SelectItem>
                                            <select_1.SelectItem value="HIIT">HIIT</select_1.SelectItem>
                                            <select_1.SelectItem value="Active Recovery">Active Recovery</select_1.SelectItem>
                                        </select_1.SelectContent>
                                    </select_1.Select>
                                </div>
                                <div className="flex-1 flex justify-end gap-2 mt-6">
                                    {/* Copy functionality could be added here */}
                                </div>
                            </div>

                            {dayData.focus !== 'Rest' && (<div className="space-y-3">
                                    {(_a = dayData.exercises) === null || _a === void 0 ? void 0 : _a.map((ex, exIndex) => (<div key={exIndex} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md bg-white">
                                            <div className="col-span-4">
                                                <label_1.Label className="text-xs">Exercise</label_1.Label>
                                                <input_1.Input value={ex.name} onChange={(e) => updateExercise(dayIndex, exIndex, 'name', e.target.value)} placeholder="e.g. Bench Press"/>
                                            </div>
                                            <div className="col-span-2">
                                                <label_1.Label className="text-xs">Sets</label_1.Label>
                                                <input_1.Input type="number" value={ex.sets} onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', parseInt(e.target.value))}/>
                                            </div>
                                            <div className="col-span-2">
                                                <label_1.Label className="text-xs">Reps</label_1.Label>
                                                <input_1.Input value={ex.reps} onChange={(e) => updateExercise(dayIndex, exIndex, 'reps', e.target.value)}/>
                                            </div>
                                            <div className="col-span-2">
                                                <label_1.Label className="text-xs">Rest</label_1.Label>
                                                <input_1.Input value={ex.rest} onChange={(e) => updateExercise(dayIndex, exIndex, 'rest', e.target.value)}/>
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <button_1.Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeExercise(dayIndex, exIndex)}>
                                                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                                                </button_1.Button>
                                            </div>
                                        </div>))}
                                    <button_1.Button variant="outline" className="w-full border-dashed" onClick={() => addExercise(dayIndex)}>
                                        <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                                        Add Exercise
                                    </button_1.Button>
                                </div>)}

                            {dayData.focus === 'Rest' && (<div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-md border border-dashed">
                                    Rest Day - No exercises scheduled.
                                </div>)}
                        </tabs_1.TabsContent>);
        })}
            </tabs_1.Tabs>
        </div>);
}
