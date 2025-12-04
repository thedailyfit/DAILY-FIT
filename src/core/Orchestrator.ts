import { MessageRouter } from './MessageRouter';
import { DatabaseManager } from '../db/DatabaseManager';
import { ConversationManager } from './ConversationManager';
import { MealPlanAgent } from '../agents/MealPlanAgent';
import { WorkoutPlanAgent } from '../agents/WorkoutPlanAgent';
import { PlanGeneratorAgent } from '../agents/PlanGeneratorAgent';
import { RAGService } from './RAGService';
import { LLMService } from './LLMService';
import { Member, Trainer, MealPlan } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class Orchestrator {
    private db: DatabaseManager;
    private router: MessageRouter;
    private conversation: ConversationManager;
    private mealAgent: MealPlanAgent;
    private workoutAgent: WorkoutPlanAgent;
    private planGenerator: PlanGeneratorAgent;
    private rag: RAGService;
    private llm: LLMService;

    constructor() {
        this.db = new DatabaseManager();
        this.router = new MessageRouter(this.db);
        this.conversation = new ConversationManager(this.db);
        this.rag = new RAGService();
        this.mealAgent = new MealPlanAgent();
        this.workoutAgent = new WorkoutPlanAgent();
        this.planGenerator = new PlanGeneratorAgent(this.db, this.rag);
        this.llm = new LLMService();
    }

    async handleIncomingMessage(whatsappId: string, messageBody: string, mediaUrl?: string): Promise<string> {
        const user = await this.router.identifyUser(whatsappId);
        const state = await this.conversation.getState(whatsappId);

        if (user.type === 'unknown' || (state && state.step.startsWith('onboarding_'))) {
            return this.handleOnboarding(whatsappId, messageBody, state?.step);
        }

        if (user.type === 'member') {
            return this.handleMemberMessage(user.profile as Member, messageBody, mediaUrl);
        }

        if (user.type === 'trainer') {
            return this.handleTrainerMessage(user.profile as Trainer, messageBody);
        }

        return "Error: User type not recognized.";
    }

    private async handleOnboarding(whatsappId: string, input: string, currentStep?: string): Promise<string> {
        const msg = input.toLowerCase().trim();

        if (!currentStep) {
            if (msg === 'start' || msg.includes('begin') || msg.includes('let\'s go')) {
                await this.conversation.setState(whatsappId, 'onboarding_name');
                return "Awesome! Let's get you set up! 🚀\n\nFirst things first - what's your name?";
            }
            return "Hey there! 👋 Welcome to DailyFit!\n\nI'm your AI fitness coach, ready to create a personalized plan just for you.\n\nReply 'Start' when you're ready to begin! 💪";
        }

        // Get context (existing data)
        const context = await this.getData(whatsappId);

        switch (currentStep) {
            case 'onboarding_name':
                // Check if they're asking questions instead of giving name
                if (msg.length < 2 || msg.includes('?')) {
                    return "I'd love to know your name so I can personalize everything for you! What should I call you? 😊";
                }

                // Intelligent name extraction using LLM
                let extractedName = await this.llm.extractName(input);

                // Fallback if LLM fails
                if (!extractedName) {
                    extractedName = input.trim().split(' ')[0];
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
                const age = parseInt(input);
                if (isNaN(age)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('age', input, context);
                }
                if (age < 15 || age > 100) {
                    return "That doesn't seem right! Please enter your actual age (between 15-100). 😊";
                }
                await this.conversation.updateData(whatsappId, { age });
                await this.conversation.setState(whatsappId, 'onboarding_weight', { ...context, age });
                return `Got it! ${age} years young! 💪\n\nWhat's your current weight in kg?`;

            case 'onboarding_weight':
                const weight = parseFloat(input);
                if (isNaN(weight)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('weight', input, context);
                }
                if (weight < 30 || weight > 300) {
                    return "That doesn't look right! Please enter your weight in kilograms (30-300 kg). 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_height', { ...context, weight_kg: weight });
                return `Perfect! ${weight}kg noted! 📝\n\nAnd your height in cm?`;

            case 'onboarding_height':
                const height = parseFloat(input);
                if (isNaN(height)) {
                    // Use LLM to handle conversational interruptions
                    return await this.llm.generateOnboardingResponse('height', input, context);
                }
                if (height < 100 || height > 250) {
                    return "That doesn't seem right! Please enter your height in centimeters (100-250 cm). 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_goal', { ...context, height_cm: height });
                return `Awesome! ${height}cm! 📏\n\nNow, what's your main fitness goal?\n\n🔥 fat_loss - Lose weight\n💪 muscle_gain - Build muscle\n⚖️ maintenance - Stay fit\n\nJust type one of these!`;

            case 'onboarding_goal':
                const goalInput = input.toLowerCase().trim().replace(/\s+/g, '_');
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

                await this.conversation.setState(whatsappId, 'onboarding_diet', { ...context, goal });
                const goalEmoji = goal === 'fat_loss' ? '🔥' : goal === 'muscle_gain' ? '💪' : '⚖️';
                return `${goalEmoji} ${goal.replace('_', ' ')} - Great choice!\n\nLast question: What's your diet preference?\n\n🥗 veg - Vegetarian\n🍗 non-veg - Non-vegetarian\n🌱 vegan - Vegan`;

            case 'onboarding_diet':
                const dietInput = input.toLowerCase().trim().replace(/\s+/g, '-');
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

                const data = await this.getData(whatsappId);
                data.diet_preference = diet as 'veg' | 'non-veg' | 'vegan';


                const newMember: Member = {
                    member_id: uuidv4(),
                    whatsapp_id: whatsappId,
                    name: data.name,
                    age: data.age,
                    gender: 'other',
                    height_cm: data.height_cm,
                    weight_kg: data.weight_kg,
                    goal: data.goal,
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

                const mealPlan = await this.planGenerator.generatePlan(newMember);
                mealPlan.status = 'active';
                await this.db.upsert('meal_plans', mealPlan, 'plan_id');

                const dietEmoji = diet === 'veg' ? '🥗' : diet === 'vegan' ? '🌱' : '🍗';
                return `${dietEmoji} Perfect! All set!\n\n🎉 Welcome to DailyFit, ${data.name}!\n\nI've created your personalized meal plan:\n📊 Daily Calories: ${mealPlan.daily_calories}\n💪 Protein: ${mealPlan.macros.protein_g}g\n🍚 Carbs: ${mealPlan.macros.carbs_g}g\n🥑 Fats: ${mealPlan.macros.fat_g}g\n\n${mealPlan.notes || ''}\n\nYour trainer will review this soon! In the meantime, feel free to ask me:\n• "workout" - Get today's workout\n• "meal plan" - See your meals\n• "progress" - Check your stats\n\nLet's crush those goals! 🚀💪`;
        }

        return "Hmm, I didn't quite get that. Let's continue with your setup! 😊";
    }

    private async getData(whatsappId: string): Promise<any> {
        const state = await this.conversation.getState(whatsappId);
        return state ? state.data : {};
    }

    private async handleMemberMessage(member: Member, message: string, mediaUrl?: string): Promise<string> {
        // Meal logging removed as requested

        const msg = message.toLowerCase();

        // Workout queries
        if (msg.includes('workout') || msg.includes('exercise') || msg.includes('train')) {
            const workoutPlan = await this.workoutAgent.generatePlan(member);
            return `Hey ${member.name}! 💪 Here's your workout for today:\n\n${workoutPlan.exercises.map(ex => `• ${ex.name} - ${ex.sets}x${ex.reps}`).join('\n')}\n\nRemember: Form over ego! Let's crush it! 🔥`;
        }

        // Meal/diet queries
        if (msg.includes('meal') || msg.includes('eat') || msg.includes('food') || msg.includes('diet')) {
            const plans = await this.db.read<MealPlan>('meal_plans');
            const activePlan = plans.find(p => p.member_id === member.member_id && p.status === 'active');

            if (activePlan) {
                const nextMeal = activePlan.meals[0]; // Simplified - would check time in production
                return `Hey ${member.name}! 🍽️\n\nYour next meal: ${nextMeal.name}\n⏰ Time: ${nextMeal.time}\n🔥 Calories: ${nextMeal.calories} kcal\n💪 Protein: ${nextMeal.protein}g\n\nStay on track! You're doing amazing! 🌟`;
            }
            return `Let me check your meal plan, ${member.name}... Hmm, looks like we need to set one up! Type "plan" and I'll help you out! 😊`;
        }

        // Progress/motivation queries
        if (msg.includes('progress') || msg.includes('how am i') || msg.includes('doing')) {
            return `You're doing fantastic, ${member.name}! 🎉\n\n📊 Adherence Score: ${member.adherence_score}%\n🎯 Goal: ${member.goal}\n\nKeep pushing! Every day is progress! 💪🔥`;
        }

        // Plan request
        if (msg.includes('plan') || msg.includes('new plan')) {
            const newPlan = await this.planGenerator.generatePlan(member);
            newPlan.status = 'active';
            await this.db.upsert('meal_plans', newPlan, 'plan_id');
            return `Fresh plan generated, ${member.name}! 📋\n\n🔥 Daily Calories: ${newPlan.daily_calories}\n💪 Protein: ${newPlan.macros.protein_g}g\n🍚 Carbs: ${newPlan.macros.carbs_g}g\n🥑 Fats: ${newPlan.macros.fat_g}g\n\nLet's make it happen! 🚀`;
        }

        // Use LLM for conversational response
        return await this.llm.generateResponse(message, member);
    }

    private async handleTrainerMessage(trainer: Trainer, message: string): Promise<string> {
        if (!message.startsWith('#')) {
            return `Hi Coach ${trainer.name}! 👋\n\nCommands:\n#clients - View your clients\n#view M001 - View member details\n#plan M001 - Generate new plan\n#edit M001 calories 2000 - Edit plan`;
        }

        const parts = message.trim().split(' ');
        const command = parts[0];
        const memberId = parts[1];

        switch (command) {
            case '#clients':
                const members = await this.db.read<Member>('members');
                const clientList = members.map(m => `${m.member_id}: ${m.name} - ${m.goal} (${m.adherence_score}%)`).join('\n');
                return `📋 Your Clients:\n${clientList}`;

            case '#view':
                if (!memberId) return 'Usage: #view M001';
                const member = await this.db.findOne<Member>('members', m => m.member_id === memberId);
                if (!member) return 'Member not found';
                return `👤 ${member.name}\nAge: ${member.age} | Weight: ${member.weight_kg}kg\nGoal: ${member.goal}\nAdherence: ${member.adherence_score}%`;

            case '#plan':
                if (!memberId) return 'Usage: #plan M001';
                const targetMember = await this.db.findOne<Member>('members', m => m.member_id === memberId);
                if (!targetMember) return 'Member not found';

                const newPlan = await this.planGenerator.generatePlan(targetMember);
                newPlan.status = 'active';
                await this.db.upsert('meal_plans', newPlan, 'plan_id');
                return `✅ New plan generated for ${targetMember.name}\nCalories: ${newPlan.daily_calories}\nStatus: Active`;

            case '#edit':
                const field = parts[2];
                const value = parts[3];
                if (!memberId || !field || !value) return 'Usage: #edit M001 calories 2000';

                const plans = await this.db.read<MealPlan>('meal_plans');
                const planToEdit = plans.find(p => p.member_id === memberId && p.status === 'active');
                if (!planToEdit) return 'No active plan found';

                if (field === 'calories') {
                    planToEdit.daily_calories = parseInt(value);
                    await this.db.upsert('meal_plans', planToEdit, 'plan_id');
                    return `✅ Updated ${memberId} calories to ${value}`;
                }
                return 'Field not supported';

            default:
                return 'Unknown command';
        }
    }
}
