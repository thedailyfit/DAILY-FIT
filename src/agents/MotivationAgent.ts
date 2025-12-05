import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';

interface MotivationInput {
    member_profile: {
        name: string;
        goal: string;
    };
    last_7_days: {
        adherence: number;
        workouts_done: number;
        meals_logged: number;
    };
}

interface MotivationResponse {
    motivation_text: string;
}

export class MotivationAgent implements Agent {
    name = 'motivation';

    constructor(private llm: LLMService) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // Triggered by events or schedule, not usually direct message
        return null;
    }

    async generateMotivation(input: MotivationInput): Promise<string> {
        const systemPrompt = `
You are MotivationAgent for DailyFit.
You generate one short motivational line based on context.

Output JSON format:
{
  "motivation_text": "You completed 4 workouts this week. That’s 4 times you chose discipline over excuses. Keep that streak alive 💪"
}

Keep it under 200 characters. No negativity, no guilt.
`;

        try {
            const response = await this.llm.getAgentResponse<MotivationResponse>(systemPrompt, input);
            return response.motivation_text;
        } catch (error) {
            console.error("MotivationAgent Error:", error);
            return "Keep pushing! You're doing great! 💪";
        }
    }
}
