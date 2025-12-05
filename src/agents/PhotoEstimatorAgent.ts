import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';

interface PhotoEstimatorInput {
    photo_url: string;
    member_id: string;
}

interface PhotoEstimatorResponse {
    estimate_cal: number;
    dish_label: string;
    confidence: number;
    notes: string;
}

export class PhotoEstimatorAgent implements Agent {
    name = 'photo_estimator';

    constructor(private llm: LLMService) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // This agent is primarily triggered by events (media), not direct messages
        // But if called directly with a photo URL in context, it can work
        if (context?.photo_url) {
            const result = await this.estimateCalories({
                photo_url: context.photo_url,
                member_id: user.profile?.member_id || 'unknown'
            });
            return `I see ${result.dish_label}! Estimated ${result.estimate_cal} calories. ${result.notes}`;
        }
        return null;
    }

    async estimateCalories(input: PhotoEstimatorInput): Promise<PhotoEstimatorResponse> {
        const systemPrompt = `
You are PhotoEstimatorAgent for DailyFit.
You estimate calories and label dishes from a meal photo.

Output JSON format:
{
  "estimate_cal": 420,
  "dish_label": "oats_with_banana",
  "confidence": 0.72,
  "notes": "1.5 cup cooked oats, 1 medium banana"
}

Always stay conservative and realistic. If confidence < 0.4, say so clearly in notes.
`;

        try {
            return await this.llm.getVisionAgentResponse<PhotoEstimatorResponse>(systemPrompt, input, input.photo_url);
        } catch (error) {
            console.error("PhotoEstimatorAgent Error:", error);
            // Fallback response
            return {
                estimate_cal: 0,
                dish_label: "unknown_dish",
                confidence: 0,
                notes: "Could not analyze image."
            };
        }
    }
}
