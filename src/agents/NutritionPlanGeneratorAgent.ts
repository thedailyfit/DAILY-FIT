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
    culture_food_context?: string; // New: Indian, Mexican, Generic, etc.
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
      items: { name: string; approx_cal: number; notes?: string; swap_option?: string }[]; // Added swap_option
    }[];
    flex_snacks_allowed: boolean;
    snack_guidelines: string;
    cultural_notes: string; // New
  };
}

export class NutritionPlanGeneratorAgent {
  name = 'nutrition_generator';

  constructor(private llm: LLMService) { }

  async generateNutritionPlan(input: NutritionGeneratorInput): Promise<NutritionPlanResponse> {
    const systemPrompt = `
You are NutritionPlanGeneratorAgent for DailyFit.
Your job is to create a structured daily nutrition plan compatible with the member’s profile, calories, macros, cultural preferences, and recent behavior.

INPUT CONTEXT:
Diet Preference: ${input.member_profile.diet_pref}
Culture Context: ${input.member_profile.culture_food_context || 'Standard Global'}
Goal: ${input.member_profile.goal}
Weight: ${input.member_profile.weight_kg}kg

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
            {
                "name": "masala_oats_with_peas", 
                "approx_cal": 380, 
                "notes": "use less oil, added veggies for volume",
                "swap_option": "Vegetable Poha with peanuts"
            },
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
    "snack_guidelines": "handful of roasted chana or fruit, max 150 kcal",
    "cultural_notes": "Focused on high-protein Indian options as requested."
  }
}

RULES:
1. **Culture**: If culture_food_context is set (e.g., "South Indian"), strictly suggest relevant dishes (e.g., Dosa/Idli over Pancakes).
2. **Swaps**: For every main item, provide a "swap_option" that has similar macros but different taste/texture.
3. **Macro Adjust**: 
    - Muscle Gain: Prioritize pre/post workout carbs.
    - Weight Loss: Prioritize volume (veggies) and protein.
4. **Allergies**: STRICTLY exclude: ${input.member_profile.allergies.join(', ')}.
5. **Calorie Logic**: 
    - If losing weight too fast (>1kg/week), increase calories by 10%.
    - If stalled (no weight loss for 2 weeks), decrease calories by 5%.
`;

    try {
      return await this.llm.getAgentResponse<NutritionPlanResponse>(systemPrompt, input);
    } catch (error) {
      console.error("NutritionPlanGeneratorAgent Error:", error);
      throw error;
    }
  }
}
