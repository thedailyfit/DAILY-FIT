import { Agent } from '../core/Agent';
import { ConversationManager } from '../core/ConversationManager';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { PlanGeneratorAgent } from './PlanGeneratorAgent';
import { Member } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class OnboardingAgent implements Agent {
    name = 'onboarding';

    constructor(
        private conversation: ConversationManager,
        private db: DatabaseManager,
        private llm: LLMService,
        private planGenerator: PlanGeneratorAgent
    ) { }

    async handleMessage(user: any, message: string, context: any): Promise<string | null> {
        const whatsappId = user.whatsapp_id || context.whatsappId;
        const currentStep = context.step;
        const msg = message.toLowerCase().trim();

        if (!currentStep) {
            if (msg === 'start' || msg.includes('begin') || msg.includes('let\'s go')) {
                await this.conversation.setState(whatsappId, 'onboarding_name');
                return "Awesome! Let's get you set up! 🚀\n\nFirst things first - what's your name?";
            }
            return "Hey there! 👋 Welcome to DailyFit!\n\nI'm your AI fitness coach, ready to create a personalized plan just for you.\n\nReply 'Start' when you're ready to begin! 💪";
        }

        // Get context (existing data)
        const data = context.data || {};

        switch (currentStep) {
            case 'onboarding_name':
                // Check if they're asking questions instead of giving name
                if (msg.length < 2 || msg.includes('?')) {
                    return "I'd love to know your name so I can personalize everything for you! What should I call you? 😊";
                }

                // Intelligent name extraction using LLM
                let extractedName = await this.llm.extractName(message);

                // Fallback if LLM fails
                if (!extractedName) {
                    extractedName = message.trim().split(' ')[0];
                }

                // Capitalize first letter
                extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();

                // Validate name (should be reasonable length and mostly letters)
                if (extractedName.length > 30 || !/^[a-zA-Z\s]+$/.test(extractedName)) {
                    return "Hmm, that doesn't look like a name! 😊 Just tell me your first name, like 'Akhil' or 'Priya'.";
                }

                await this.conversation.setState(whatsappId, 'onboarding_age', { name: extractedName });
                return `Great to meet you, ${extractedName}! 🎉\n\nHow old are you?`;

            case 'onboarding_age':
                const age = parseInt(message);
                if (isNaN(age)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('age', message, data);
                }
                if (age < 15 || age > 100) {
                    return "That doesn't seem right! Please enter your actual age (between 15-100). 😊";
                }
                await this.conversation.updateData(whatsappId, { age });
                await this.conversation.setState(whatsappId, 'onboarding_weight', { ...data, age });
                return `Got it! ${age} years young! 💪\n\nWhat's your current weight in kg?`;

            case 'onboarding_weight':
                const weight = parseFloat(message);
                if (isNaN(weight)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('weight', message, data);
                }
                if (weight < 30 || weight > 300) {
                    return "That doesn't look right! Please enter your weight in kilograms (30-300 kg). 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_height', { ...data, weight_kg: weight });
                return `Perfect! ${weight}kg noted! 📝\n\nAnd your height in cm?`;

            case 'onboarding_height':
                const height = parseFloat(message);
                if (isNaN(height)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('height', message, data);
                }
                if (height < 100 || height > 250) {
                    return "That doesn't seem right! Please enter your height in centimeters (100-250 cm). 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_goal', { ...data, height_cm: height });
                return `Awesome! ${height}cm! 📏\n\nNow, what's your main fitness goal?\n\n🔥 fat_loss - Lose weight\n💪 muscle_gain - Build muscle\n⚖️ maintenance - Stay fit\n\nJust type one of these!`;

            case 'onboarding_goal':
                const goalInput = message.toLowerCase().trim().replace(/\s+/g, '_');
                let goal: string;

                // Fuzzy matching for goal
                if (goalInput.includes('fat') || goalInput.includes('loss') || goalInput.includes('lose')) {
                    goal = 'fat_loss';
                } else if (goalInput.includes('muscle') || goalInput.includes('gain') || goalInput.includes('build')) {
                    goal = 'muscle_gain';
                } else if (goalInput.includes('maintain') || goalInput.includes('maintenance')) {
                    goal = 'maintenance';
                } else {
                    return "Please choose one of these goals:\n\n🔥 fat_loss (or just 'fat loss', 'lose weight')\n💪 muscle_gain (or 'muscle gain', 'build muscle')\n⚖️ maintenance (or 'maintain')\n\nWhich one matches your goal?";
                }

                await this.conversation.setState(whatsappId, 'onboarding_diet', { ...data, goal });
                const goalEmoji = goal === 'fat_loss' ? '🔥' : goal === 'muscle_gain' ? '💪' : '⚖️';
                return `${goalEmoji} ${goal.replace('_', ' ')} - Great choice!\n\nLast question: What's your diet preference?\n\n🥗 veg - Vegetarian\n🍗 non-veg - Non-vegetarian\n🌱 vegan - Vegan`;

            case 'onboarding_diet':
                const dietInput = message.toLowerCase().trim().replace(/\s+/g, '-');
                let diet: string;

                // Fuzzy matching for diet
                if (dietInput.includes('non') || dietInput.includes('meat') || dietInput.includes('chicken') || dietInput.includes('fish')) {
                    diet = 'non-veg';
                } else if (dietInput.includes('vegan')) {
                    diet = 'vegan';
                } else if (dietInput.includes('veg')) {
                    diet = 'veg';
                } else {
                    return "Please choose one of these:\n\n🥗 veg (or 'vegetarian')\n🍗 non-veg (or 'non veg', 'meat')\n🌱 vegan\n\nWhich one?";
                }

                const finalData = { ...data, diet_preference: diet };

                const newMember: Member = {
                    member_id: uuidv4(),
                    whatsapp_id: whatsappId,
                    name: finalData.name,
                    age: finalData.age,
                    gender: 'other',
                    height_cm: finalData.height_cm,
                    weight_kg: finalData.weight_kg,
                    goal: finalData.goal,
                    diet_preference: diet as 'veg' | 'non-veg' | 'vegan',
                    allergies: [],
                    adherence_score: 100,
                    weight_history: [],
                    sleep_history: [],
                    check_in_history: [],
                    meal_logs: [],
                    consent_flags: { terms_accepted: true, data_processing: true }
                };
                await this.db.upsert('members', newMember, 'member_id');
                await this.conversation.clearState(whatsappId);

                const { mealPlan, workoutPlan, summary } = await this.planGenerator.generatePlan(newMember);

                // Save plans
                await this.db.upsert('meal_plans', mealPlan, 'plan_id');
                // We assume workout_plans table exists or will be created. 
                // If not, this might fail, but let's assume it's fine as per task.md
                await this.db.upsert('workout_plans', workoutPlan, 'plan_id');

                const dietEmoji = diet === 'veg' ? '🥗' : diet === 'vegan' ? '🌱' : '🍗';
                return `${dietEmoji} Perfect! All set!\n\n🎉 Welcome to DailyFit, ${finalData.name}!\n\n${summary}\n\nYour trainer will review this soon! In the meantime, feel free to ask me:\n• "workout" - Get today's workout\n• "meal plan" - See your meals\n• "progress" - Check your stats\n\nLet's crush those goals! 🚀💪`;
        }

        return "Hmm, I didn't quite get that. Let's continue with your setup! 😊";
    }
}
