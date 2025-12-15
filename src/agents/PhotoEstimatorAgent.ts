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
You are an expert nutritionist and food analyst.

Your task:
1. Analyze the food image provided.
2. Identify the dish and its components.
3. Estimate the total calories conservatively.
4. Provide a confidence score (0.0 - 1.0).
5. Give a short, helpful summary.

Output strict JSON:
{
  "estimate_cal": 350,
  "dish_label": "Grilled Chicken Salad",
  "confidence": 0.85,
  "notes": "Contains grilled chicken breast (~150g), mixed greens, tomatoes, and light olive oil dressing."
}

If the image is NOT food, return:
{
    "estimate_cal": 0,
    "dish_label": "not_food",
    "confidence": 1.0,
    "notes": "This doesn't look like food. Please send a meal photo!"
}
`;

        try {
            console.log(`📸 Analyzing photo for member ${input.member_id}: ${input.photo_url}`);

            // Only process if we have a valid URL (in real prod, validate URL/downloadability)
            if (!input.photo_url || !input.photo_url.startsWith('http')) {
                throw new Error("Invalid photo URL");
            }

            const response = await this.llm.getVisionAgentResponse<PhotoEstimatorResponse>(
                systemPrompt,
                { member_id: input.member_id },
                input.photo_url
            );

            return response;

        } catch (error) {
            console.error("PhotoEstimatorAgent Error:", error);
            // Fallback response
            return {
                estimate_cal: 0,
                dish_label: "error_analyzing",
                confidence: 0,
                notes: "I successfully received your photo, but my vision is a bit blurry right now! 👓 Check back later."
            };
        }
    }
}
