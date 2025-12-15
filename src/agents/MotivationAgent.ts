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
    recent_sentiment?: 'positive' | 'neutral' | 'negative' | 'stressed'; // New
    mood_signals?: string[]; // e.g. ["User said they are tired", "User missed 3 meals"]
}

interface MotivationResponse {
    motivation_text: string;
    tone_used: string; // "Empathetic", "Drill Sergeant", "Cheerleader"
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
You generate one short motivational line based on context and DETECTED MOOD.

INPUT CONTEXT:
Goal: ${input.member_profile.goal}
Adherence: ${input.last_7_days.workouts_done} workouts done this week.
Sentiment: ${input.recent_sentiment || 'neutral'}
Signals: ${input.mood_signals?.join(', ') || 'None'}

LOGIC - ADAPT YOUR PERSONA:
1. **If Sentiment is Negative/Stressed**: Be EMPATHETIC. "It's okay to rest. Listen to your body."
2. **If Adherence is Low but Sentiment is Neutral**: Be a GENTLE NUDGE. "Small steps matter."
3. **If Adherence is High**: Be a CHEERLEADER. "You are unstoppable!"
4. **If Goal is 'Hardcore' + High Adherence**: Be a DRILL SERGEANT. "Don't stop now."

Output JSON format:
{
  "motivation_text": "I know it's been a tough week. Just 10 minutes of movement today will help clear your mind. 💙",
  "tone_used": "Empathetic"
}

Keep it under 200 characters.
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
