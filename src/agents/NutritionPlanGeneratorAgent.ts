import { LLMService } from '../core/LLMService';

interface NutritionGeneratorInput {
    member_profile: {
        age: number;
        gender: string;
        weight_kg: number;
        height_cm: number;
        goal: string;
        diet_pref: string;
        allergies: string[];
        culture_food_context?: string;
    };
    personalization_vector?: {
        activity_factor: number;
        carb_tolerance_score: number;
        satiety_score: number;
        breakfast_importance: number;
    };
    last_7_days?: {
        avg_calories: number;
        weight_trend: number[];
        adherence: number;
        meal_logging_consistency: number;
    };
}

interface NutritionPlanResponse {
    nutrition_plan_json: {
        target_calories: number;
        macros: {
            protein_g: number;
            carbs_g: number;
            fats_g: number;
        };
        meals: {
            label: string;
            time_window: string;
            items: { name: string; approx_cal: number; notes?: string }[];
        }[];
        flex_snacks_allowed: boolean;
        snack_guidelines: string;
    };
}

export class NutritionPlanGeneratorAgent {
    name = 'nutrition_generator';

    constructor(private llm: LLMService) { }

    async generateNutritionPlan(input: NutritionGeneratorInput): Promise<NutritionPlanResponse> {
        const systemPrompt = `
You are NutritionPlanGeneratorAgent for DailyFit.
Your job is to create a structured daily nutrition plan compatible with the member’s profile, calories, macros and recent behavior.

Output JSON format:
{
  "nutrition_plan_json": {
    "target_calories": 1800,
    "macros": {
      "protein_g": 130,
      "carbs_g": 170,
      "fats_g": 60
    },
    "meals": [
      {
        "label": "breakfast",
        "time_window": "07:00-09:00",
        "items": [
          {"name": "oats_with_banana", "approx_cal": 380, "notes": "use skim milk"},
          {"name": "black_coffee", "approx_cal": 10}
        ]
      },
      {
        "label": "lunch",
        "time_window": "12:30-14:30",
        "items": []
      }
    ],
    "flex_snacks_allowed": true,
    "snack_guidelines": "handful of nuts or fruit, max 150 kcal per snack, 1–2x/day"
  }
}

Always:
1. Avoid allergen ingredients.
2. Respect diet preference.
3. Adjust calories based on trend: if losing too fast, gently increase, if too slow, gently reduce.
`;

        try {
            return await this.llm.getAgentResponse<NutritionPlanResponse>(systemPrompt, input);
        } catch (error) {
            console.error("NutritionPlanGeneratorAgent Error:", error);
            throw error;
        }
    }
}
