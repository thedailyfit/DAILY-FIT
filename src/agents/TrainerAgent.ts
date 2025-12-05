import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { Trainer, Member, MealPlan } from '../models/types';

interface TrainerAgentResponse {
    action_type: 'edit_plan' | 'view_client' | 'list_clients' | 'unknown';
    member_id?: string;
    plan_id?: string;
    before?: any;
    after?: any;
    reason?: string;
    publish?: boolean;
    reply_text?: string;
}

export class TrainerAgent implements Agent {
    name = 'trainer';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // Only handle trainers
        if (user.type !== 'trainer') return null;
        const trainer = user.profile as Trainer;

        // Basic command parsing to fetch context
        const parts = message.trim().split(' ');
        const command = parts[0].toLowerCase();
        const targetMemberId = parts[1];

        let memberContext: Member | undefined = undefined;
        let planContext: MealPlan | undefined = undefined;

        if (targetMemberId && targetMemberId.startsWith('M')) {
            memberContext = await this.db.findOne<Member>('members', m => m.member_id === targetMemberId);
            if (memberContext) {
                const plans = await this.db.read<MealPlan>('meal_plans');
                planContext = plans.find(p => p.member_id === targetMemberId && p.status === 'active') || undefined;
            }
        }

        // Construct input for LLM
        const input = {
            trainer_id: trainer.trainer_id,
            text: message,
            member_profile: memberContext ? {
                name: memberContext.name,
                age: memberContext.age,
                goal: memberContext.goal
            } : null,
            current_plan: planContext
        };

        const systemPrompt = `
You are TrainerAgent for DailyFit.
You interpret trainer commands (starting with #) into structured actions.

Commands:
- #clients: List all clients
- #view Mxxx: View member details
- #edit Mxxx [changes] reason "[reason]": Edit a meal plan

Input JSON will contain the command text and context (member profile, current plan).

If action is 'edit_plan', you MUST return the 'after' plan object with the requested changes applied to the 'current_plan'.
Ensure the JSON is valid and strict.

Output JSON format:
{
  "action_type": "edit_plan" | "view_client" | "list_clients" | "unknown",
  "member_id": "M123",
  "plan_id": "P-...",
  "before": {...},
  "after": {...},
  "reason": "low morning energy",
  "publish": true,
  "reply_text": "Optional response text to send back to trainer"
}
`;

        try {
            const response = await this.llm.getAgentResponse<TrainerAgentResponse>(systemPrompt, input);

            if (response.action_type === 'edit_plan' && response.after && response.member_id) {
                // Execute the update
                await this.db.upsert('meal_plans', response.after, 'plan_id');

                // Log the change (optional, but good practice)
                // const changeLog = { ... };
                // await this.db.upsert('change_logs', changeLog, 'change_id');

                return response.reply_text || `✅ Plan updated for ${response.member_id}. Reason: ${response.reason}`;
            } else if (response.action_type === 'list_clients') {
                // We can handle this locally or let LLM generate the text if we passed the list
                // For now, let's do it locally as passing all clients to LLM might be too big
                const members = await this.db.read<Member>('members');
                const clientList = members.map(m => `${m.member_id}: ${m.name} - ${m.goal}`).join('\n');
                return `📋 Your Clients:\n${clientList}`;
            }

            return response.reply_text || "Command processed.";

        } catch (error) {
            console.error("TrainerAgent Error:", error);
            return "Error processing command.";
        }
    }
}
