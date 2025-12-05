import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';

interface TrainerOverrideInput {
    trainer_id: string;
    member_profile: any;
    before_plan: any;
    after_plan: any;
    reason: string;
}

interface TrainerOverrideResponse {
    rag_doc: string;
    tags: string[];
    update_personalization_delta: {
        activity_factor?: number;
        carb_tolerance_score?: number;
        satiety_score?: number;
        breakfast_importance?: number;
        [key: string]: number | undefined;
    };
}

export class TrainerOverrideAgent implements Agent {
    name = 'trainer_override';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // Triggered by events (trainer edit)
        return null;
    }

    async analyzeOverride(input: TrainerOverrideInput): Promise<TrainerOverrideResponse> {
        const systemPrompt = `
You are TrainerOverrideAgent for DailyFit.
You learn patterns from trainer overrides and generate RAG docs + personalization deltas.

Output JSON format:
{
  "rag_doc": "age 30 vegetarian, low morning energy -> calories 1750→2000, priority: bigger breakfast",
  "tags": ["calorie_increase","breakfast_focus","vegetarian"],
  "update_personalization_delta": {
    "activity_factor": 0.02,
    "satiety_score": -0.03
  }
}

Focus on short, dense, useful RAG sentences.
`;

        try {
            const response = await this.llm.getAgentResponse<TrainerOverrideResponse>(systemPrompt, input);

            // Save RAG doc (simplified)
            // In a real system, we'd embed this and save to vector DB
            // For now, let's just log it or save to a simple 'knowledge_base' table if we had one
            console.log("Learned from override:", response.rag_doc);

            return response;
        } catch (error) {
            console.error("TrainerOverrideAgent Error:", error);
            throw error;
        }
    }
}
