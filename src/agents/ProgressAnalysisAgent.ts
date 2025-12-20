import { Agent } from '../core/Agent';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';

interface ProgressAnalysisInput {
    member_id: string;
    weeks_analyzed: number; // usually 1 or 4
    planned_workouts: number;
    completed_workouts: number;
    weight_log: { date: string; weight: number }[];
    calorie_adherence_score: number; // 0-100
    goal: string;
}

interface WeeklyReportResponse {
    week_summary: string;
    insights: string[];
    risk_alert: string | null;
    next_week_focus: string;
}

interface TrainerReportInput {
    trainer_name: string;
    total_clients: number;
    active_clients: number; // adherence > 70%
    at_risk_clients: string[]; // Names of people with low adherence
    revenue_this_week: number;
}

interface TrainerReportResponse {
    business_summary: string; // "You have 20 active clients."
    client_alerts: string[]; // ["Follow up with Rahul (No activity)"]
    upsell_opportunities: string[]; // ["Pitch 'Keto Add-on' to Priya"]
}

export class ProgressAnalysisAgent implements Agent {
    name = 'progress_analyst';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // usually triggered periodically by Scheduler
        return null;
    }

    async generateWeeklyMemberReport(input: ProgressAnalysisInput): Promise<WeeklyReportResponse> {
        const systemPrompt = `
You are ProgressAnalysisAgent for DailyFit.
Generate a Sunday Weekly Report for a gym member.
Tone: Motivational, Professional, but friendly.

INPUT DATA:
Goal: ${input.goal}
Adherence: ${input.completed_workouts}/${input.planned_workouts} workouts.
Calorie Score: ${input.calorie_adherence_score}%
Weight Log: ${JSON.stringify(input.weight_log)}

Output JSON format:
{
  "week_summary": "Solid week! You hit 80% of your workouts.",
  "insights": ["Weight is stable", "Consistency is improving"],
  "risk_alert": null,
  "next_week_focus": "Try to hit all 5 workouts."
}
`;
        return await this.llm.getAgentResponse<WeeklyReportResponse>(systemPrompt, input);
    }

    async generateTrainerReport(input: TrainerReportInput): Promise<TrainerReportResponse> {
        const systemPrompt = `
You are the Business Intelligence AI for a Gym Owner/Trainer.
Generate a Weekly Sunday Business Digest.

INPUT DATA:
Trainer: ${input.trainer_name}
Clients: ${input.active_clients}/${input.total_clients} Active.
At Risk: ${input.at_risk_clients.join(', ')}

OBJECTIVE:
1. Summarize retention.
2. Flag at-risk clients for follow-up.
3. Suggest 2-3 specific Upsell/Add-on packs (e.g., "Supplements", "Personal Diet Review", "Advanced PPL Program") based on the context.

Output JSON format:
{
  "business_summary": "Retention is good (80%).",
  "client_alerts": ["Call Rahul - missing workouts"],
  "upsell_opportunities": ["Pitch 'Whey Protein Pack' to active muscle gainers", "Offer '1-on-1 Form Check' to beginners"]
}
`;
        return await this.llm.getAgentResponse<TrainerReportResponse>(systemPrompt, input);
    }
}
