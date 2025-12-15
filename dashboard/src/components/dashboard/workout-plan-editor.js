"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlanEditor = WorkoutPlanEditor;
const react_1 = require("react");
const tabs_1 = require("@/components/ui/tabs");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const scroll_area_1 = require("@/components/ui/scroll-area");
function WorkoutPlanEditor({ initialData, onChange }) {
    const [days, setDays] = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.days) || []);
    const [activeTab, setActiveTab] = (0, react_1.useState)("day-0");
    // Update parent when local state changes
    (0, react_1.useEffect)(() => {
        if (onChange) {
            onChange({ days });
        }
    }, [days, onChange]);
    // Update local state when initialData changes
    (0, react_1.useEffect)(() => {
        if (initialData === null || initialData === void 0 ? void 0 : initialData.days) {
            setDays(initialData.days);
            if (initialData.days.length > 0) {
                setActiveTab("day-0");
            }
        }
    }, [initialData]);
    const addDay = () => {
        const newDays = [...days, { day_name: `Day ${days.length + 1}`, focus: "", exercises: [] }];
        setDays(newDays);
        setActiveTab(`day-${newDays.length - 1}`);
    };
    const addExercise = (dayIndex) => {
        const newDays = [...days];
        newDays[dayIndex].exercises.push({ name: "", sets: "3", reps: "10", notes: "" });
        setDays(newDays);
    };
    const updateExercise = (dayIndex, exIndex, field, value) => {
        const newDays = [...days];
        newDays[dayIndex].exercises[exIndex] = Object.assign(Object.assign({}, newDays[dayIndex].exercises[exIndex]), { [field]: value });
        setDays(newDays);
    };
    const removeExercise = (dayIndex, exIndex) => {
        const newDays = [...days];
        newDays[dayIndex].exercises.splice(exIndex, 1);
        setDays(newDays);
    };
    const updateDayFocus = (dayIndex, value) => {
        const newDays = [...days];
        newDays[dayIndex].focus = value;
        setDays(newDays);
    };
    return (<div className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weekly Schedule</h3>
                <button_1.Button onClick={addDay} size="sm" variant="outline">
                    <lucide_react_1.Plus className="h-4 w-4 mr-2"/> Add Day
                </button_1.Button>
            </div>

            {days.length > 0 ? (<tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <scroll_area_1.ScrollArea className="w-full border-b">
                        <tabs_1.TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                            {days.map((day, index) => (<tabs_1.TabsTrigger key={index} value={`day-${index}`} className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                                    {day.day_name}
                                </tabs_1.TabsTrigger>))}
                        </tabs_1.TabsList>
                    </scroll_area_1.ScrollArea>

                    {days.map((day, dayIndex) => (<tabs_1.TabsContent key={dayIndex} value={`day-${dayIndex}`} className="flex-1 overflow-y-auto pt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">Focus:</label>
                                <input_1.Input value={day.focus} onChange={(e) => updateDayFocus(dayIndex, e.target.value)} placeholder="e.g. Upper Body, Legs, Cardio" className="max-w-md"/>
                            </div>

                            <div className="space-y-2">
                                {day.exercises.map((ex, exIndex) => (<div key={exIndex} className="flex items-center gap-2 p-2 border rounded-md bg-card">
                                        <lucide_react_1.GripVertical className="h-4 w-4 text-muted-foreground cursor-move"/>
                                        <div className="flex-1 grid grid-cols-12 gap-2">
                                            <div className="col-span-5">
                                                <input_1.Input value={ex.name} onChange={(e) => updateExercise(dayIndex, exIndex, 'name', e.target.value)} placeholder="Exercise Name" className="h-8 text-sm"/>
                                            </div>
                                            <div className="col-span-2">
                                                <input_1.Input value={ex.sets} onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', e.target.value)} placeholder="Sets" className="h-8 text-sm"/>
                                            </div>
                                            <div className="col-span-2">
                                                <input_1.Input value={ex.reps} onChange={(e) => updateExercise(dayIndex, exIndex, 'reps', e.target.value)} placeholder="Reps" className="h-8 text-sm"/>
                                            </div>
                                            <div className="col-span-3">
                                                <input_1.Input value={ex.notes} onChange={(e) => updateExercise(dayIndex, exIndex, 'notes', e.target.value)} placeholder="Notes (optional)" className="h-8 text-sm"/>
                                            </div>
                                        </div>
                                        <button_1.Button variant="ghost" size="icon" onClick={() => removeExercise(dayIndex, exIndex)}>
                                            <lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/>
                                        </button_1.Button>
                                    </div>))}
                            </div>

                            <button_1.Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addExercise(dayIndex)}>
                                <lucide_react_1.Plus className="h-4 w-4 mr-2"/> Add Exercise
                            </button_1.Button>
                        </tabs_1.TabsContent>))}
                </tabs_1.Tabs>) : (<div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                    No workout days added. Use the AI Coach or add a day manually.
                </div>)}
        </div>);
}
