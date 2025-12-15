import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';

interface MemberUpsellProfile {
    member_id: string;
    name: string;
    current_plan: string; // "Basic", "Premium"
    tenure_months: number;
    results_score: number; // 0-100 (high results = happy client)
    interaction_frequency: string; // "High", "Low"
}

interface UpsellSuggestion {
    should_pitch: boolean;
    product_to_pitch: string | null; // "1-on-1 Coaching", "Diet Pack", "Annual Plan"
    pitch_message: string;
    reasoning: string;
}

export class PricingUpsellAgent implements Agent {
    name = 'pricing_upsell';

    constructor(private llm: LLMService) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        return null;
    }

    async evaluateUpsellOpportunity(profile: MemberUpsellProfile): Promise<UpsellSuggestion> {
        const systemPrompt = `
You are PricingUpsellAgent. Identify revenue opportunities for DailyFit.

Logic:
- High results + High interaction = Pitch "Premium Layer" or "Long-term renewal".
- Low results = Do NOT pitch. Focus on retention.
- Tenure > 6 months = Pitch "Annual Plan" discount.

Input:
${JSON.stringify(profile)}

Output JSON:
{
  "should_pitch": true,
  "product_to_pitch": "Transformation Challenge",
  "pitch_message": "Hey [Name], given your amazing progress, you'd crush our Summer Challenge!",
  "reasoning": "Client is highly engaged and seeing results."
}
`;
        try {
            return await this.llm.getAgentResponse<UpsellSuggestion>(systemPrompt, profile);
        } catch (error) {
            console.error("PricingUpsellAgent Error:", error);
            throw error;
        }
    }
}
