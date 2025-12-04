import { DatabaseManager } from '../db/DatabaseManager';
import { Member, MealPlan } from '../models/types';

export class DailyScheduler {
    private db: DatabaseManager;

    constructor() {
        this.db = new DatabaseManager();
    }

    // Run daily at 7 AM - sends plans to all active members
    async sendDailyPlans(): Promise<void> {
        console.log('🔔 Running Daily Plan Scheduler...');
        const members = await this.db.read<Member>('members');

        for (const member of members) {
            const plans = await this.db.read<MealPlan>('meal_plans');
            const activePlan = plans.find(p => p.member_id === member.member_id && p.status === 'active');

            if (activePlan) {
                const message = this.formatDailyPlanMessage(member, activePlan);
                console.log(`📤 Sending to ${member.name} (${member.whatsapp_id}):`);
                console.log(message);
                // In production: call WhatsApp API here
            }
        }
    }

    // Send motivational quotes
    async sendMotivationalQuotes(): Promise<void> {
        const quotes = [
            "💪 The only bad workout is the one that didn't happen!",
            "🔥 Your body can stand almost anything. It's your mind you have to convince.",
            "⚡ Success starts with self-discipline.",
            "🏋️ Train like a beast, look like a beauty!",
            "🌟 The pain you feel today will be the strength you feel tomorrow."
        ];

        const members = await this.db.read<Member>('members');
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        console.log(`📣 Sending motivation to ${members.length} members: ${randomQuote}`);
    }

    // Trainer digest - low adherence alerts
    async sendTrainerDigest(): Promise<void> {
        console.log('📊 Generating Trainer Digest...');
        const members = await this.db.read<Member>('members');
        const lowAdherence = members.filter(m => m.adherence_score < 60);

        if (lowAdherence.length > 0) {
            console.log(`⚠️ ${lowAdherence.length} members with low adherence:`);
            lowAdherence.forEach(m => {
                console.log(`  - ${m.name} (${m.member_id}): ${m.adherence_score}%`);
            });
        }
    }

    private formatDailyPlanMessage(member: Member, plan: MealPlan): string {
        const mealSummary = plan.meals.slice(0, 2).map(m => m.name).join(', ');
        return `Good morning ${member.name}! ☀️\n\n` +
            `📋 Today's Plan:\n` +
            `🍽️ Meals: ${mealSummary}...\n` +
            `📊 Calories: ${plan.daily_calories} kcal\n` +
            `💪 Macros: P${plan.macros.protein_g}g C${plan.macros.carbs_g}g F${plan.macros.fat_g}g\n\n` +
            `Reply:\n1️⃣ Done\n2️⃣ Upload meal photo\n3️⃣ Talk to trainer`;
    }

    // Start all scheduled tasks
    startScheduler(): void {
        console.log('🚀 DailyFit Scheduler Started');

        // Run daily plan at 7 AM (simulate with interval for demo)
        setInterval(() => this.sendDailyPlans(), 24 * 60 * 60 * 1000);

        // Send motivation at 10 AM
        setInterval(() => this.sendMotivationalQuotes(), 24 * 60 * 60 * 1000);

        // Trainer digest at 8 PM
        setInterval(() => this.sendTrainerDigest(), 24 * 60 * 60 * 1000);

        // Run once immediately for testing
        setTimeout(() => this.sendDailyPlans(), 2000);
    }
}
