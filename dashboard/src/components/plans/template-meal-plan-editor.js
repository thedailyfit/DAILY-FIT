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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateMealPlanEditor = TemplateMealPlanEditor;
const react_hook_form_1 = require("react-hook-form");
const z = __importStar(require("zod"));
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const accordion_1 = require("@/components/ui/accordion");
const lucide_react_1 = require("lucide-react");
// Schema for validation
const numberSchema = z.preprocess((val) => {
    if (typeof val === 'string')
        return parseFloat(val) || 0;
    if (typeof val === 'number')
        return val;
    return 0;
}, z.number());
const foodItemSchema = z.object({
    item: z.string().min(1, "Item name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    macros: z.object({
        calories: numberSchema,
        protein: numberSchema,
        carbs: numberSchema,
        fats: numberSchema,
    }),
});
const mealSchema = z.object({
    name: z.string().min(1, "Meal name is required"),
    time: z.string().optional(),
    items: z.array(foodItemSchema),
});
const mealPlanStructureSchema = z.object({
    meals: z.array(mealSchema),
});
function TemplateMealPlanEditor({ initialStructure, onChange }) {
    const form = (0, react_hook_form_1.useForm)({
        defaultValues: {
            meals: (initialStructure === null || initialStructure === void 0 ? void 0 : initialStructure.meals) || [],
        },
    });
    const { fields: mealFields, append: appendMeal, remove: removeMeal } = (0, react_hook_form_1.useFieldArray)({
        control: form.control,
        name: "meals",
    });
    // Watch changes and propagate to parent
    form.watch((data) => {
        onChange(data);
    });
    // Calculate totals in real-time
    const watchedMeals = form.watch("meals");
    const totalCalories = (watchedMeals === null || watchedMeals === void 0 ? void 0 : watchedMeals.reduce((acc, meal) => {
        var _a;
        return acc + (((_a = meal === null || meal === void 0 ? void 0 : meal.items) === null || _a === void 0 ? void 0 : _a.reduce((mAcc, item) => { var _a; return mAcc + (((_a = item === null || item === void 0 ? void 0 : item.macros) === null || _a === void 0 ? void 0 : _a.calories) || 0); }, 0)) || 0);
    }, 0)) || 0;
    const totalProtein = (watchedMeals === null || watchedMeals === void 0 ? void 0 : watchedMeals.reduce((acc, meal) => {
        var _a;
        return acc + (((_a = meal === null || meal === void 0 ? void 0 : meal.items) === null || _a === void 0 ? void 0 : _a.reduce((mAcc, item) => { var _a; return mAcc + (((_a = item === null || item === void 0 ? void 0 : item.macros) === null || _a === void 0 ? void 0 : _a.protein) || 0); }, 0)) || 0);
    }, 0)) || 0;
    return (<div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Meal Structure</h3>
                    <p className="text-sm text-muted-foreground">
                        Total: {totalCalories} kcal | {totalProtein.toFixed(1)}g Protein
                    </p>
                </div>
                <div className="flex gap-2">
                    <button_1.Button type="button" variant="secondary" size="sm" onClick={() => __awaiter(this, void 0, void 0, function* () {
            // Simple prompt for now, could be a dialog
            const goal = prompt("Enter generic goal (e.g., 'Fat Loss, 1800 kcal, Vegetarian')");
            if (!goal)
                return;
            try {
                const { generateAiMealPlan } = yield Promise.resolve().then(() => __importStar(require("@/app/actions/generate-plan")));
                const aiPlan = yield generateAiMealPlan({ goal });
                if (aiPlan && aiPlan.meals) {
                    // Reset form with new data
                    form.reset({ meals: aiPlan.meals });
                    // Also notify parent
                    onChange({ meals: aiPlan.meals });
                }
            }
            catch (e) {
                alert("Failed to generate plan. Please try again.");
                console.error(e);
            }
        })}>
                        <lucide_react_1.Wand2 className="w-4 h-4 mr-2"/>
                        Generate with AI
                    </button_1.Button>
                    <button_1.Button type="button" variant="outline" size="sm" onClick={() => appendMeal({ name: "New Meal", items: [] })}>
                        <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                        Add Meal
                    </button_1.Button>
                </div>
            </div>

            <accordion_1.Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {mealFields.map((meal, index) => {
            var _a, _b;
            return (<accordion_1.AccordionItem value={`item-${index}`} key={meal.id}>
                        <accordion_1.AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-2">
                                    <input_1.Input {...form.register(`meals.${index}.name`)} className="h-8 w-40" onClick={(e) => e.stopPropagation()}/>
                                    <input_1.Input {...form.register(`meals.${index}.time`)} className="h-8 w-24 text-xs" placeholder="Time" onClick={(e) => e.stopPropagation()}/>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {((_b = (_a = watchedMeals === null || watchedMeals === void 0 ? void 0 : watchedMeals[index]) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.reduce((acc, item) => { var _a; return acc + (((_a = item === null || item === void 0 ? void 0 : item.macros) === null || _a === void 0 ? void 0 : _a.calories) || 0); }, 0)) || 0} kcal
                                    </span>
                                    <button_1.Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={(e) => {
                    e.stopPropagation();
                    removeMeal(index);
                }}>
                                        <lucide_react_1.Trash2 className="w-4 h-4"/>
                                    </button_1.Button>
                                </div>
                            </div>
                        </accordion_1.AccordionTrigger>
                        <accordion_1.AccordionContent className="p-4 space-y-4">
                            <MealItemsEditor nestIndex={index} control={form.control} register={form.register}/>
                        </accordion_1.AccordionContent>
                    </accordion_1.AccordionItem>);
        })}
            </accordion_1.Accordion>
        </div>);
}
function MealItemsEditor({ nestIndex, control, register }) {
    const { fields, remove, append } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: `meals.${nestIndex}.items`,
    });
    return (<div className="space-y-4">
            {fields.map((item, k) => (<div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end border-b pb-4">
                    <div className="space-y-1">
                        <label_1.Label className="text-xs">Food Item</label_1.Label>
                        <input_1.Input {...register(`meals.${nestIndex}.items.${k}.item`)} placeholder="e.g. Oatmeal"/>
                    </div>
                    <div className="space-y-1">
                        <label_1.Label className="text-xs">Qty</label_1.Label>
                        <input_1.Input {...register(`meals.${nestIndex}.items.${k}.quantity`)} placeholder="e.g. 1 cup"/>
                    </div>
                    <div className="space-y-1">
                        <label_1.Label className="text-xs">Cals</label_1.Label>
                        <input_1.Input {...register(`meals.${nestIndex}.items.${k}.macros.calories`)} type="number" placeholder="0"/>
                    </div>
                    <div className="space-y-1">
                        <label_1.Label className="text-xs">Protein (g)</label_1.Label>
                        <input_1.Input {...register(`meals.${nestIndex}.items.${k}.macros.protein`)} type="number" placeholder="0"/>
                    </div>
                    <button_1.Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="text-red-500">
                        <lucide_react_1.Trash2 className="w-4 h-4"/>
                    </button_1.Button>
                </div>))}
            <button_1.Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => append({ item: "", quantity: "", macros: { calories: 0, protein: 0, carbs: 0, fats: 0 } })}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/> Add Food Item
            </button_1.Button>
        </div>);
}
