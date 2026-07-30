import { DatabaseManager } from '../db/DatabaseManager';
import { Member, Trainer, MealPlan } from '../models/types';
import { MotivationAgent } from '../agents/MotivationAgent';
import { LLMService } from '../core/LLMService';

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
    private motivationAgent?: MotivationAgent;

    constructor(db?: DatabaseManager, llm?: LLMService) {
        // C-05: Accept shared DatabaseManager instance
        this.db = db || new DatabaseManager();
        if (llm) {
            this.motivationAgent = new MotivationAgent(llm);
        }

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
                    let quote = randomQuote;
                    if (this.motivationAgent) {
                        quote = await this.motivationAgent.generateMotivation({
                            member_profile: { name: member.name, goal: member.goal || 'fat_loss' },
                            last_7_days: {
                                adherence: member.adherence_score || 80,
                                workouts_done: 3,
                                meals_logged: member.meal_logs?.length || 15
                            }
                        });
                    }

                    await this.sendMessage(
                        member.whatsapp_id,
                        `Good morning, ${member.name}! ☀️\n\n${quote}`,
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
        const trainers = await this.db.read<Trainer>('trainers');

        if (!trainers || trainers.length === 0) {
            console.log('ℹ️ No trainers found to send digest to.');
            return;
        }

        for (const trainer of trainers) {
            const trainerMembers = members.filter(m => m.trainer_id === trainer.trainer_id || trainer.assigned_member_ids?.includes(m.member_id));
            const lowAdherenceMembers = trainerMembers.filter(m => (m.adherence_score ?? 100) < 60);

            if (lowAdherenceMembers.length > 0 && trainer.whatsapp_id && this.sendMessage) {
                const memberListStr = lowAdherenceMembers
                    .map(m => `• ${m.name} (${m.adherence_score ?? 0}% adherence)`)
                    .join('\n');

                const digestMsg = `📊 *DailyFit Evening Digest for Coach ${trainer.name}*\n\n` +
                    `⚠️ *Clients Needing Attention (${lowAdherenceMembers.length}):*\n${memberListStr}\n\n` +
                    `💡 _Tip: Reach out to them via WhatsApp or check their daily logs in your dashboard!_`;

                try {
                    await this.sendMessage(trainer.whatsapp_id, digestMsg, trainer.trainer_id);
                    console.log(`✅ Sent trainer digest to ${trainer.name} (${trainer.whatsapp_id})`);
                } catch (error) {
                    console.error(`❌ Failed to send digest to ${trainer.name}:`, error);
                }
            } else {
                console.log(`ℹ️ Coach ${trainer.name}: All clients doing great (${trainerMembers.length} active clients).`);
            }
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
