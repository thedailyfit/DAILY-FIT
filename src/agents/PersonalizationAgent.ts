import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { Member, PersonalizationVector } from '../models/types';

interface PersonalizationInput {
    member_id: string;
    event_type: 'meal_log' | 'workout_log' | 'weekly_summary';
    event_payload: any;
    current_personalization_vector: PersonalizationVector;
}

interface PersonalizationResponse {
    member_id: string;
    updated_personalization_vector: PersonalizationVector;
}

export class PersonalizationAgent implements Agent {
    name = 'personalization';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // This agent is triggered by events, not messages
        // But we can expose a method to trigger it manually if needed
        return null;
    }

    async updatePersonalization(input: PersonalizationInput): Promise<PersonalizationVector> {
        const systemPrompt = `
You are PersonalizationAgent for DailyFit.
You update the personalization_vector based on events.

Output JSON format:
{
  "member_id": "123",
  "updated_personalization_vector": {
    "activity_factor": 1.36,
    "carb_tolerance_score": 0.8,
    "satiety_score": 0.6,
    "breakfast_importance": 0.9,
    "protein_requirement_adjustment": 0,
    "sleep_adjustment_factor": 1,
    "last_updated": "ISO_DATE"
  }
}

Only make small, gradual adjustments. Do not radically change preferences from one event.
`;

        try {
            const response = await this.llm.getAgentResponse<PersonalizationResponse>(systemPrompt, input);

            // Save to DB
            await this.db.upsert('personalization_vectors', response.updated_personalization_vector, 'member_id');

            return response.updated_personalization_vector;
        } catch (error) {
            console.error("PersonalizationAgent Error:", error);
            return input.current_personalization_vector; // Return original on error
        }
    }
}
