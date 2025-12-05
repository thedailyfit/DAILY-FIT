import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { Member, MealPlan, WorkoutPlan } from '../models/types';
import { WorkoutGeneratorAgent } from './WorkoutGeneratorAgent';
import { NutritionPlanGeneratorAgent } from './NutritionPlanGeneratorAgent';
import { RAGService } from '../core/RAGService';
import { v4 as uuidv4 } from 'uuid';

interface PlanAssemblerInput {
    mode: 'daily_plan' | 'weekly_summary';
    member_profile: any;
    workout_json: any;
    nutrition_plan_json: any;
    rag_examples?: any[];
}

interface PlanAssemblerResponse {
    plan_json: {
        workout: any;
        nutrition: any;
    };
    day_label: string;
    whatsapp_summary: {
        workout_title: string;
        exercise_bullets: string;
        breakfast_summary: string;
        day_number: number;
    };
}

export class PlanGeneratorAgent implements Agent {
    name = 'plan_generator';

    private workoutAgent: WorkoutGeneratorAgent;
    private nutritionAgent: NutritionPlanGeneratorAgent;

    constructor(
        private db: DatabaseManager,
        private rag: RAGService,
        private llm: LLMService
    ) {
        this.workoutAgent = new WorkoutGeneratorAgent(llm);
        this.nutritionAgent = new NutritionPlanGeneratorAgent(llm);
    }

    // Agent interface implementation (optional if used directly)
    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // This agent is mostly used as a service, but could handle "generate plan" commands
        return null;
    }

    // Main service method
    async generatePlan(member: Member): Promise<{ mealPlan: MealPlan, workoutPlan: WorkoutPlan, summary: string }> {
        // 1. Generate Workout
        const workoutRes = await this.workoutAgent.generateWorkout({
            member_profile: {
                age: member.age,
                gender: member.gender,
                height_cm: member.height_cm,
                weight_kg: member.weight_kg,
                goal: member.goal
            }
        });

        // 2. Generate Nutrition
        const nutritionRes = await this.nutritionAgent.generateNutritionPlan({
            member_profile: {
                age: member.age,
                gender: member.gender,
                weight_kg: member.weight_kg,
                height_cm: member.height_cm,
                goal: member.goal,
                diet_pref: member.diet_preference,
                allergies: member.allergies
            }
        });

        // 3. Assemble and Summarize
        const assemblerInput: PlanAssemblerInput = {
            mode: 'daily_plan',
            member_profile: { name: member.name, goal: member.goal },
            workout_json: workoutRes.workout_json,
            nutrition_plan_json: nutritionRes.nutrition_plan_json
        };

        const systemPrompt = `
You are PlanGeneratorAgent for DailyFit.
You merge workout and nutrition plans and produce the final plan_json + WhatsApp-friendly summary.

Output (mode = daily_plan):
{
  "plan_json": {
    "workout": {...},
    "nutrition": {...}
  },
  "day_label": "Day 12 - Upper Body Strength",
  "whatsapp_summary": {
    "workout_title": "Upper Body Strength",
    "exercise_bullets": "Pushups, Dumbbell Rows, Shoulder Press",
    "breakfast_summary": "Oats + Banana, 380 kcal",
    "day_number": 12
  }
}
`;

        const assemblerRes = await this.llm.getAgentResponse<PlanAssemblerResponse>(systemPrompt, assemblerInput);

        // 4. Convert to Domain Models (MealPlan, WorkoutPlan)
        const mealPlan: MealPlan = {
            plan_id: uuidv4(),
            member_id: member.member_id,
            version_number: 1,
            daily_calories: nutritionRes.nutrition_plan_json.target_calories,
            macros: {
                protein_g: nutritionRes.nutrition_plan_json.macros.protein_g,
                carbs_g: nutritionRes.nutrition_plan_json.macros.carbs_g,
                fat_g: nutritionRes.nutrition_plan_json.macros.fats_g
            },
            meals: nutritionRes.nutrition_plan_json.meals.flatMap(m => m.items.map(i => ({
                time: m.time_window.split('-')[0],
                name: i.name,
                calories: i.approx_cal,
                protein: 0 // Placeholder as item level macros aren't fully generated yet
            }))),
            created_by: 'AI',
            status: 'active',
            created_timestamp: new Date().toISOString(),
            notes: assemblerRes.whatsapp_summary.breakfast_summary // simplified
        };

        const workoutPlan: WorkoutPlan = {
            plan_id: uuidv4(),
            member_id: member.member_id,
            version: 1,
            exercises: workoutRes.workout_json.exercises.map(e => ({
                name: e.name,
                sets: e.sets,
                reps: e.reps.toString(),
                rest: '60s'
            })),
            created_by: 'AI',
            status: 'active'
        };

        // Construct a nice summary string
        const summary = `📅 *${assemblerRes.day_label}*\n\n💪 *Workout: ${assemblerRes.whatsapp_summary.workout_title}*\n${assemblerRes.whatsapp_summary.exercise_bullets}\n\n🍳 *Breakfast:* ${assemblerRes.whatsapp_summary.breakfast_summary}\n\nReady to crush it? 🔥`;

        return { mealPlan, workoutPlan, summary };
    }
}
