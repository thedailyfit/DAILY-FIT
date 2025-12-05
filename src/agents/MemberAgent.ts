import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { Member } from '../models/types';
import { PhotoEstimatorAgent } from './PhotoEstimatorAgent';

interface MemberAgentResponse {
    reply_text: string | null;
    next_questions?: string[];
    events?: {
        event_type: 'onboarding_profile' | 'workout_log' | 'meal_photo' | 'trainer_help_request';
        payload: any;
    }[];
}

export class MemberAgent implements Agent {
    name = 'member';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager,
        private photoEstimator: PhotoEstimatorAgent
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // Only handle members
        if (user.type !== 'member') return null;
        const member = user.profile as Member;

        // Fetch active plans to provide context
        const mealPlans = await this.db.read<any>('meal_plans');
        const activeMealPlan = mealPlans.find(p => p.member_id === member.member_id && p.status === 'active');

        // Construct the input for the LLM
        const input = {
            whatsapp_id: member.whatsapp_id,
            text: message,
            mediaUrl: context?.mediaUrl || null,
            member_profile: {
                name: member.name,
                goal: member.goal,
                diet_preference: member.diet_preference
            },
            current_meal_plan: activeMealPlan ? {
                daily_calories: activeMealPlan.daily_calories,
                macros: activeMealPlan.macros,
                meals: activeMealPlan.meals
            } : null
        };

        const systemPrompt = `
You are MemberAgent, the front-desk assistant for DailyFit on WhatsApp.
Your job is to handle member messages, onboard new members, and route events.

Responsibilities:
1. If member says "done workout", "missed workout", or similar → output an event object { "event_type": "workout_log", ... }.
2. If member sends only text questions, answer briefly, and when needed, output an escalation event { "event_type": "trainer_help_request" }.
3. If mediaUrl is provided and looks like food → emit event { "event_type":"meal_photo", "photo_url": "...", ... }.

Output JSON format:
{
  "reply_text": "string or null",
  "next_questions": ["optional", "questions"],
  "events": [
    {
      "event_type": "onboarding_profile" | "workout_log" | "meal_photo" | "trainer_help_request",
      "payload": { }
    }
  ]
}

Never send WhatsApp templates directly; just produce structured events and short reply_text.
`;

        try {
            const response = await this.llm.getAgentResponse<MemberAgentResponse>(systemPrompt, input);

            // Handle events
            if (response.events && response.events.length > 0) {
                for (const event of response.events) {
                    await this.handleEvent(member, event);
                }
            }

            return response.reply_text || null;
        } catch (error) {
            console.error("MemberAgent Error:", error);
            return "I'm having a bit of trouble processing that. Could you try again?";
        }
    }

    private async handleEvent(member: Member, event: { event_type: string, payload: any }) {
        console.log(`Handling event ${event.event_type} for ${member.name}`, event.payload);

        switch (event.event_type) {
            case 'workout_log':
                const checkIn = {
                    date: new Date().toISOString(),
                    mood: 'workout_done'
                };
                if (!member.check_in_history) member.check_in_history = [];
                member.check_in_history.push(checkIn);
                await this.db.upsert('members', member, 'member_id');
                break;

            case 'meal_photo':
                // Use PhotoEstimatorAgent
                if (event.payload.photo_url) {
                    const estimate = await this.photoEstimator.estimateCalories({
                        photo_url: event.payload.photo_url,
                        member_id: member.member_id
                    });

                    const mealLog = {
                        date: new Date().toISOString(),
                        meal_name: estimate.dish_label,
                        calories: estimate.estimate_cal,
                        photo_url: event.payload.photo_url
                    };
                    if (!member.meal_logs) member.meal_logs = [];
                    member.meal_logs.push(mealLog);
                    await this.db.upsert('members', member, 'member_id');

                    // We might want to notify the user about the estimate, but handleMessage returns a string.
                    // The LLM response might already include a generic "Thanks for the photo".
                    // We could append the estimate to the log or send a separate message if the architecture supported it.
                }
                break;

            case 'trainer_help_request':
                console.log(`ESCALATION: Member ${member.name} needs help!`);
                break;
        }
    }
}
