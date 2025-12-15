import { LLMService } from '../core/LLMService';

interface WorkoutGeneratorInput {
  member_profile: {
    age: number;
    gender: string;
    height_cm: number;
    weight_kg: number;
    goal: string;
    experience_level?: string;
    equipment?: string[];
    injuries?: string[];
  };
  last_7_days?: {
    workouts_done: number;
    muscle_groups_stressed?: string[];
    fatigue_flags?: string[];
  };
}

interface WorkoutPlanResponse {
  workout_json: {
    workout_type: string; // PPL, Bro-Split, Full Body
    day_focus: string;
    difficulty_level: string;
    warmup: { name: string; duration_min: number }[];
    exercises: {
      name: string;
      sets: number;
      reps: number | string;
      notes?: string;
      tempo?: string; // New: 2-0-2
      rest_sec: number;
    }[];
    cooldown: { name: string; duration_sec: number }[];
    progressive_overload_tip: string; // New
  };
}

export class WorkoutGeneratorAgent {
  name = 'workout_generator';

  constructor(private llm: LLMService) { }

  async generateWorkout(input: WorkoutGeneratorInput): Promise<WorkoutPlanResponse> {
    const systemPrompt = `
You are WorkoutGeneratorAgent for DailyFit. You generate structured daily workout plans.

INPUT CONTEXT:
Experience: ${input.member_profile.experience_level || 'Beginner'}
Equipment: ${input.member_profile.equipment?.join(', ') || 'Gym Standard'}
Injuries: ${input.member_profile.injuries?.join(', ') || 'None'}
Goal: ${input.member_profile.goal}

Output JSON format:
{
  "workout_json": {
    "workout_type": "Push Pull Legs",
    "day_focus": "Pull (Back & Biceps)",
    "difficulty_level": "Intermediate",
    "warmup": [
      {"name": "treadmill_walk", "duration_min": 5},
      {"name": "arm_circles", "duration_min": 2}
    ],
    "exercises": [
      {
          "name": "pullups", 
          "sets": 3, 
          "reps": "8-10", 
          "notes": "Assist if needed, focus on lats",
          "tempo": "2-1-2",
          "rest_sec": 90
      },
      {"name": "dumbbell_row", "sets": 3, "reps": 12, "rest_sec": 60}
    ],
    "cooldown": [
      {"name": "dead_hang", "duration_sec": 30}
    ],
    "progressive_overload_tip": "Increase weight by 2.5kg on Dumbbell Row compared to last week."
  }
}

RULES:
1. **Injuries**: STRICTLY avoid exercises aggravating: ${input.member_profile.injuries?.join(', ')}. Provide safe alternatives.
2. **Splits**: 
    - Beginner: Full Body 3x/week.
    - Intermediate: Upper/Lower or PPL.
    - Advanced: Body Part Split or Specialized PPL.
    - Check 'day_focus' avoids muscles stressed in 'last_7_days.muscle_groups_stressed'.
3. **Progressive Overload**: Include a specific tip on how to make it harder than last time (reps, weight, or tempo).
4. **Home vs Gym**: If equipment is limited (e.g. "Dumbbells Only"), adhere strictly to it.
`;

    try {
      return await this.llm.getAgentResponse<WorkoutPlanResponse>(systemPrompt, input);
    } catch (error) {
      console.error("WorkoutGeneratorAgent Error:", error);
      throw error;
    }
  }
}
