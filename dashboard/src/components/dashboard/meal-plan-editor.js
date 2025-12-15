"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanEditor = MealPlanEditor;
const react_1 = require("react");
const accordion_1 = require("@/components/ui/accordion");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function MealPlanEditor({ initialData, onChange }) {
    const [meals, setMeals] = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.meals) || []);
    // Update parent when local state changes
    (0, react_1.useEffect)(() => {
        if (onChange) {
            onChange({ meals });
        }
    }, [meals, onChange]);
    // Update local state when initialData changes (e.g. from AI generation)
    (0, react_1.useEffect)(() => {
        if (initialData === null || initialData === void 0 ? void 0 : initialData.meals) {
            setMeals(initialData.meals);
        }
    }, [initialData]);
    const addMeal = () => {
        setMeals([...meals, { name: `Meal ${meals.length + 1}`, items: [], total_calories: 0 }]);
    };
    const removeMeal = (index) => {
        const newMeals = [...meals];
        newMeals.splice(index, 1);
        setMeals(newMeals);
    };
    const addItem = (mealIndex) => {
        const newMeals = [...meals];
        newMeals[mealIndex].items.push({ name: "", portion: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
        setMeals(newMeals);
    };
    const updateItem = (mealIndex, itemIndex, field, value) => {
        const newMeals = [...meals];
        newMeals[mealIndex].items[itemIndex] = Object.assign(Object.assign({}, newMeals[mealIndex].items[itemIndex]), { [field]: value });
        // Recalculate totals (simplified)
        // In a real app, we'd sum up calories here
        setMeals(newMeals);
    };
    const removeItem = (mealIndex, itemIndex) => {
        const newMeals = [...meals];
        newMeals[mealIndex].items.splice(itemIndex, 1);
        setMeals(newMeals);
    };
    return (<div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Daily Meal Plan</h3>
                <button_1.Button onClick={addMeal} size="sm" variant="outline">
                    <lucide_react_1.Plus className="h-4 w-4 mr-2"/> Add Meal
                </button_1.Button>
            </div>

            <accordion_1.Accordion type="single" collapsible className="w-full space-y-2">
                {meals.map((meal, mealIndex) => (<accordion_1.AccordionItem key={mealIndex} value={`item-${mealIndex}`} className="border rounded-md px-4">
                        <accordion_1.AccordionTrigger className="hover:no-underline">
                            <div className="flex justify-between w-full items-center pr-4">
                                <span>{meal.name}</span>
                                <span className="text-sm text-muted-foreground">{meal.total_calories} kcal</span>
                            </div>
                        </accordion_1.AccordionTrigger>
                        <accordion_1.AccordionContent className="pt-4 space-y-4">
                            {meal.items.map((item, itemIndex) => (<div key={itemIndex} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4">
                                        <label className="text-xs text-muted-foreground">Food</label>
                                        <input_1.Input value={item.name} onChange={(e) => updateItem(mealIndex, itemIndex, 'name', e.target.value)} placeholder="e.g. Oatmeal"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-muted-foreground">Portion</label>
                                        <input_1.Input value={item.portion} onChange={(e) => updateItem(mealIndex, itemIndex, 'portion', e.target.value)} placeholder="1 cup"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-muted-foreground">Cals</label>
                                        <input_1.Input type="number" value={item.calories} onChange={(e) => updateItem(mealIndex, itemIndex, 'calories', parseInt(e.target.value))}/>
                                    </div>
                                    <div className="col-span-3 grid grid-cols-3 gap-1">
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">P</label>
                                            <input_1.Input className="h-8 text-xs px-1" placeholder="P" value={item.protein} onChange={(e) => updateItem(mealIndex, itemIndex, 'protein', parseInt(e.target.value))}/>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">C</label>
                                            <input_1.Input className="h-8 text-xs px-1" placeholder="C" value={item.carbs} onChange={(e) => updateItem(mealIndex, itemIndex, 'carbs', parseInt(e.target.value))}/>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground">F</label>
                                            <input_1.Input className="h-8 text-xs px-1" placeholder="F" value={item.fats} onChange={(e) => updateItem(mealIndex, itemIndex, 'fats', parseInt(e.target.value))}/>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <button_1.Button variant="ghost" size="icon" onClick={() => removeItem(mealIndex, itemIndex)}>
                                            <lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/>
                                        </button_1.Button>
                                    </div>
                                </div>))}
                            <div className="flex justify-between pt-2">
                                <button_1.Button variant="ghost" size="sm" className="text-xs" onClick={() => addItem(mealIndex)}>
                                    <lucide_react_1.Plus className="h-3 w-3 mr-1"/> Add Item
                                </button_1.Button>
                                <button_1.Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600" onClick={() => removeMeal(mealIndex)}>
                                    Remove Meal
                                </button_1.Button>
                            </div>
                        </accordion_1.AccordionContent>
                    </accordion_1.AccordionItem>))}
            </accordion_1.Accordion>

            {meals.length === 0 && (<div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
                    No meals added. Use the AI Assistant or add a meal manually.
                </div>)}
        </div>);
}
