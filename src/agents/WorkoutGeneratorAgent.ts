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
        day_focus: string;
        warmup: { name: string; duration_min: number }[];
        exercises: { name: string; sets: number; reps: number | string; notes?: string }[];
        cooldown: { name: string; duration_sec: number }[];
    };
}

export class WorkoutGeneratorAgent {
    name = 'workout_generator';

    constructor(private llm: LLMService) { }

    async generateWorkout(input: WorkoutGeneratorInput): Promise<WorkoutPlanResponse> {
        const systemPrompt = `
You are WorkoutGeneratorAgent for DailyFit. You generate structured daily workout plans.

Output JSON format:
{
  "workout_json": {
    "day_focus": "upper_body_strength",
    "warmup": [
      {"name": "treadmill_walk", "duration_min": 5}
    ],
    "exercises": [
      {"name": "pushup", "sets": 4, "reps": 12, "notes": "slow controlled"},
      {"name": "dumbbell_row", "sets": 4, "reps": 10}
    ],
    "cooldown": [
      {"name": "shoulder_stretch", "duration_sec": 30}
    ]
  }
}

Respect injuries and avoid overtraining the same muscle group two days in a row.
`;

        try {
            return await this.llm.getAgentResponse<WorkoutPlanResponse>(systemPrompt, input);
        } catch (error) {
            console.error("WorkoutGeneratorAgent Error:", error);
            throw error;
        }
    }
}
