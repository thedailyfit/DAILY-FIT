import { Member, MealPlan, Meal } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class MealPlanAgent {

    async generatePlan(member: Member): Promise<MealPlan> {
        // In a real system, this would call an LLM with the prompt defined in Module 9.1
        // For this demo, we generate a plan based on simple logic.

        const tdee = this.calculateTDEE(member);
        const goalAdjustment = member.goal === 'fat_loss' ? -500 : member.goal === 'muscle_gain' ? 300 : 0;
        const targetCalories = tdee + goalAdjustment;

        const protein = Math.round(member.weight_kg * 2); // 2g per kg
        const remainingCals = targetCalories - (protein * 4);
        const fats = Math.round((remainingCals * 0.3) / 9);
        const carbs = Math.round((remainingCals * 0.7) / 4);

        const plan: MealPlan = {
            plan_id: uuidv4(),
            member_id: member.member_id,
            version_number: 1,
            daily_calories: targetCalories,
            macros: {
                protein_g: protein,
                carbs_g: carbs,
                fat_g: fats
            },
            meals: this.generateMeals(member.diet_preference, targetCalories),
            created_by: 'AI',
            status: 'draft',
            created_timestamp: new Date().toISOString()
        };

        return plan;
    }

    private calculateTDEE(member: Member): number {
        // Mifflin-St Jeor Equation
        let bmr = 10 * member.weight_kg + 6.25 * member.height_cm - 5 * member.age;
        bmr += member.gender === 'male' ? 5 : -161;
        return Math.round(bmr * 1.2); // Sedentary multiplier for now
    }

    private generateMeals(preference: string, calories: number): Meal[] {
        // Simple template
        const isVeg = preference === 'veg' || preference === 'vegan';

        return [
            {
                time: '08:00',
                name: isVeg ? 'Oats & Nuts' : 'Eggs & Toast',
                calories: Math.round(calories * 0.25),
                protein: 20
            },
            {
                time: '13:00',
                name: isVeg ? 'Dal, Rice & Sabzi' : 'Chicken Curry & Rice',
                calories: Math.round(calories * 0.35),
                protein: 30
            },
            {
                time: '20:00',
                name: isVeg ? 'Paneer Salad' : 'Grilled Fish & Veggies',
                calories: Math.round(calories * 0.25),
                protein: 25
            },
            {
                time: '17:00',
                name: 'Protein Shake / Fruit',
                calories: Math.round(calories * 0.15),
                protein: 15
            }
        ];
    }
}
