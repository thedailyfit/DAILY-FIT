import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';

interface GymMetrics {
    total_active_members: number;
    new_signups_this_week: number;
    churn_rate: number;
    trainer_performance: { trainer_name: string; active_clients: number; avg_client_rating: number }[];
    revenue_this_month: number;
}

interface GymAdminResponse {
    executive_summary: string;
    action_items: string[]; // "Hire more trainers", "Contact at-risk client X"
    flags: string[]; // "Client Y has been inactive for 14 days"
}

export class GymAdminAgent implements Agent {
    name = 'gym_admin';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // Admin commands logic could go here
        return null;
    }

    async analyzeGymHealth(metrics: GymMetrics): Promise<GymAdminResponse> {
        const systemPrompt = `
You are GymAdminAgent. You help Gym Owners manage their business.
Analyze the provided metrics and suggest business decisions.

metrics:
${JSON.stringify(metrics, null, 2)}

Output JSON:
{
  "executive_summary": "Growth is steady, but churn is creeping up.",
  "action_items": ["Run a reactivation campaign", "Review Trainer John's workload"],
  "flags": ["Trainer Sarah has too many clients (40)"]
}
`;
        try {
            return await this.llm.getAgentResponse<GymAdminResponse>(systemPrompt, metrics);
        } catch (error) {
            console.error("GymAdminAgent Error:", error);
            throw error;
        }
    }
}
