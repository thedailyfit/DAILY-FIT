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
    week_summary: string; // "Great job hitting 4/5 workouts!"
    insights: string[]; // ["Weight trending down 0.5kg", "Protein intake slightly low on weekends"]
    risk_alert: string | null; // "Plateau detected" or "Burnout risk (7 days no rest)"
    next_week_focus: string; // "Focus on hitting protein goal"
}

export class ProgressAnalysisAgent implements Agent {
    name = 'progress_analyst';

    constructor(
        private llm: LLMService,
        private db: DatabaseManager
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        // usually triggered periodically
        return null;
    }

    async generateWeeklyReport(input: ProgressAnalysisInput): Promise<WeeklyReportResponse> {
        const systemPrompt = `
You are ProgressAnalysisAgent for DailyFit.
Analyze the user's weekly fitness data and generate a concise report using motivational but analytical tone.

INPUT DATA:
Goal: ${input.goal}
Adherence: ${input.completed_workouts}/${input.planned_workouts} workouts completed.
Calorie Score: ${input.calorie_adherence_score}%
Weight Log: ${JSON.stringify(input.weight_log)}

Output JSON format:
{
  "week_summary": "Solid week! You hit 80% of your workouts.",
  "insights": ["Weight is stable", "Consistency is improving"],
  "risk_alert": null,
  "next_week_focus": "Try to hit all 5 workouts."
}

LOGIC:
- If adherence < 50%, be encouraging but firm about consistency.
- If weight hasn't moved in 2 weeks (weight log) and goal is loss, flag "Plateau detected" in risk_alert.
- If adherence > 90% and weight moving in right direction, celebrate!
`;

        try {
            return await this.llm.getAgentResponse<WeeklyReportResponse>(systemPrompt, input);
        } catch (error) {
            console.error("ProgressAnalysisAgent Error:", error);
            throw error;
        }
    }
}
