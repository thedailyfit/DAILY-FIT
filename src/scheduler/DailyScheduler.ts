import { DatabaseManager } from '../db/DatabaseManager';
import { Member, MealPlan } from '../models/types';

// M-02: Cron-style scheduling with proper time handling
interface ScheduledTask {
    name: string;
    cronHour: number;     // 0-23 (in server timezone)
    cronMinute: number;   // 0-59
    handler: () => Promise<void>;
    lastRun?: Date;
}

export class DailyScheduler {
    private db: DatabaseManager;
    private tasks: ScheduledTask[] = [];
    private checkInterval: NodeJS.Timeout | null = null;
    private sendMessage: ((to: string, message: string, memberId?: string) => Promise<void>) | null = null;

    constructor(db?: DatabaseManager) {
        // C-05: Accept shared DatabaseManager instance
        this.db = db || new DatabaseManager();

        // Register scheduled tasks
        this.tasks = [
            {
                name: 'Daily Plans',
                cronHour: 7,
                cronMinute: 0,
                handler: () => this.sendDailyPlans()
            },
            {
                name: 'Motivational Quotes',
                cronHour: 10,
                cronMinute: 0,
                handler: () => this.sendMotivationalQuotes()
            },
            {
                name: 'Trainer Digest',
                cronHour: 20,
                cronMinute: 0,
                handler: () => this.sendTrainerDigest()
            }
        ];
    }

    // M-03: Wire up the actual WhatsApp sending function
    setMessageSender(sender: (to: string, message: string, memberId?: string) => Promise<void>) {
        this.sendMessage = sender;
    }

    // M-02: Proper cron-style execution instead of setInterval
    startScheduler(): void {
        console.log('🚀 DailyFit Scheduler Started');
        console.log('📅 Registered tasks:');
        this.tasks.forEach(task => {
            console.log(`   - ${task.name} at ${String(task.cronHour).padStart(2, '0')}:${String(task.cronMinute).padStart(2, '0')}`);
        });

        // Check every minute
        this.checkInterval = setInterval(() => this.tick(), 60 * 1000);

        // Also run immediately on startup for testing
        this.tick();
    }

    stopScheduler(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('🛑 Scheduler stopped');
        }
    }

    private async tick() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (const task of this.tasks) {
            if (task.cronHour === currentHour && task.cronMinute === currentMinute) {
                // Prevent running same task twice in the same minute
                if (task.lastRun && (now.getTime() - task.lastRun.getTime()) < 60000) {
                    continue;
                }

                console.log(`⏰ Running scheduled task: ${task.name}`);
                task.lastRun = now;

                try {
                    await task.handler();
                    console.log(`✅ Task completed: ${task.name}`);
                } catch (error) {
                    console.error(`❌ Task failed: ${task.name}`, error);
                }
            }
        }
    }

    // M-04: Fixed N+1 query — fetch plans once, not per member
    async sendDailyPlans(): Promise<void> {
        console.log('🔔 Running Daily Plan Scheduler...');

        const members = await this.db.read<Member>('members');
        const allPlans = await this.db.read<MealPlan>('meal_plans');

        // Build a lookup map for O(1) access
        const activePlans = new Map<string, MealPlan>();
        for (const plan of allPlans) {
            if (plan.status === 'active') {
                activePlans.set(plan.member_id, plan);
            }
        }

        for (const member of members) {
            const activePlan = activePlans.get(member.member_id);

            if (activePlan && member.whatsapp_id) {
                const message = this.formatDailyPlanMessage(member, activePlan);

                // M-03: Actually send the WhatsApp message
                if (this.sendMessage) {
                    try {
                        await this.sendMessage(member.whatsapp_id, message, member.member_id);
                        console.log(`📤 Sent daily plan to ${member.name}`);
                    } catch (error) {
                        console.error(`❌ Failed to send to ${member.name}:`, error);
                    }
                } else {
                    console.log(`📤 [DRY RUN] Would send to ${member.name} (${member.whatsapp_id})`);
                }
            }
        }
    }

    async sendMotivationalQuotes(): Promise<void> {
        const quotes = [
            "💪 The only bad workout is the one that didn't happen!",
            "🔥 Your body can stand almost anything. It's your mind you have to convince.",
            "⚡ Success starts with self-discipline.",
            "🏋️ Train like a beast, look like a beauty!",
            "🌟 The pain you feel today will be the strength you feel tomorrow.",
            "🎯 A 30-minute workout is only 2% of your day. No excuses!",
            "🍎 You can't out-train a bad diet. Stay focused on your nutrition!",
            "💫 Consistency beats intensity. Show up every day.",
        ];

        const members = await this.db.read<Member>('members');
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        console.log(`📣 Sending motivation to ${members.length} members`);

        for (const member of members) {
            if (member.whatsapp_id && this.sendMessage) {
                try {
                    await this.sendMessage(
                        member.whatsapp_id,
                        `Good morning, ${member.name}! ☀️\n\n${randomQuote}`,
                        member.member_id
                    );
                } catch (error) {
                    console.error(`❌ Failed motivation to ${member.name}:`, error);
                }
            }
        }
    }

    async sendTrainerDigest(): Promise<void> {
        console.log('📊 Generating Trainer Digest...');
        const members = await this.db.read<Member>('members');
        const lowAdherence = members.filter(m => m.adherence_score < 60);

        if (lowAdherence.length > 0) {
            console.log(`⚠️ ${lowAdherence.length} members with low adherence:`);
            lowAdherence.forEach(m => {
                console.log(`  - ${m.name} (${m.member_id}): ${m.adherence_score}%`);
            });

            // TODO: Send digest to trainers via WhatsApp
            // This requires knowing which trainer each member belongs to
        } else {
            console.log('✅ All members have good adherence!');
        }
    }

    private formatDailyPlanMessage(member: Member, plan: MealPlan): string {
        const mealSummary = plan.meals.slice(0, 3).map(m => m.name).join(', ');
        return `Good morning ${member.name}! ☀️\n\n` +
            `📋 Today's Plan:\n` +
            `🍽️ Meals: ${mealSummary}...\n` +
            `📊 Calories: ${plan.daily_calories} kcal\n` +
            `💪 Macros: P${plan.macros.protein_g}g C${plan.macros.carbs_g}g F${plan.macros.fat_g}g\n\n` +
            `Reply:\n1️⃣ Done\n2️⃣ Upload meal photo\n3️⃣ Talk to trainer`;
    }
}
