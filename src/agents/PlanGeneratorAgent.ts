import { Member, MealPlan, Meal } from '../models/types';
import { DatabaseManager } from '../db/DatabaseManager';
import { RAGService } from '../core/RAGService';
import { v4 as uuidv4 } from 'uuid';

export class PlanGeneratorAgent {
    private db: DatabaseManager;
    private rag: RAGService;

    constructor(db: DatabaseManager, rag: RAGService) {
        this.db = db;
        this.rag = rag;
    }

    async generatePlan(member: Member): Promise<MealPlan> {
        // 1. Calculate TDEE & Target Calories
        const tdee = this.calculateTDEE(member);
        let targetCalories = tdee;

        if (member.goal === 'fat_loss') targetCalories -= 500;
        else if (member.goal === 'muscle_gain') targetCalories += 300;

        // 2. Check RAG for similar cases (Trainer Edits)
        const ragQuery = `age${member.age} ${member.diet_preference} ${member.goal}`;
        const similarEdits = await this.rag.search(ragQuery);

        // Apply RAG insights (Simple heuristic for demo)
        if (similarEdits.some(e => e.includes('calories_up'))) {
            targetCalories += 200; // Adjust based on "low energy" feedback found in RAG
        }

        // 3. Calculate Macros
        const protein = Math.round(member.weight_kg * (member.goal === 'muscle_gain' ? 2.0 : 1.6));
        const remainingCals = targetCalories - (protein * 4);
        const fats = Math.round((remainingCals * 0.3) / 9);
        const carbs = Math.round((remainingCals * 0.7) / 4);

        // 4. Generate Meals (Indian Cuisine)
        const meals = this.generateIndianMeals(member.diet_preference, targetCalories, member.allergies);

        const plan: MealPlan = {
            plan_id: uuidv4(),
            member_id: member.member_id,
            version_number: 1,
            daily_calories: Math.round(targetCalories),
            macros: {
                protein_g: protein,
                carbs_g: carbs,
                fat_g: fats
            },
            meals: meals,
            created_by: 'AI',
            status: 'draft',
            created_timestamp: new Date().toISOString(),
            notes: similarEdits.length > 0 ? `Adjusted based on ${similarEdits.length} similar trainer edits.` : undefined
        };

        return plan;
    }

    private calculateTDEE(member: Member): number {
        // Mifflin-St Jeor
        let bmr = 10 * member.weight_kg + 6.25 * member.height_cm - 5 * member.age;
        bmr += member.gender === 'male' ? 5 : -161;
        return Math.round(bmr * 1.35); // Default activity factor
    }

    private generateIndianMeals(preference: string, calories: number, allergies: string[]): Meal[] {
        const isVeg = preference === 'veg' || preference === 'vegan';
        const meals: Meal[] = [];

        // Breakfast
        let breakfast = isVeg ? 'Poha with Peanuts' : 'Omelette & Toast';
        if (allergies.includes('peanut') && breakfast.includes('Peanuts')) breakfast = 'Vegetable Upma';
        meals.push({ time: '08:00', name: breakfast, calories: Math.round(calories * 0.25), protein: 15 });

        // Lunch
        let lunch = isVeg ? 'Roti, Dal Tadka & Sabzi' : 'Chicken Curry & Rice';
        meals.push({ time: '13:00', name: lunch, calories: Math.round(calories * 0.35), protein: 30 });

        // Snack
        let snack = 'Masala Chai & Marie Biscuit'; // Classic Indian
        meals.push({ time: '17:00', name: snack, calories: Math.round(calories * 0.10), protein: 5 });

        // Dinner
        let dinner = isVeg ? 'Paneer Bhurji & Roti' : 'Grilled Fish & Salad';
        meals.push({ time: '20:00', name: dinner, calories: Math.round(calories * 0.30), protein: 25 });

        return meals;
    }
}
