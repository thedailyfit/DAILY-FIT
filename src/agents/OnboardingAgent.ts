import { Agent } from '../core/Agent';
import { ConversationManager } from '../core/ConversationManager';
import { LLMService } from '../core/LLMService';
import { DatabaseManager } from '../db/DatabaseManager';
import { PlanGeneratorAgent } from './PlanGeneratorAgent';
import { Member } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// H-03: Configurable gym name — no more placeholder
const GYM_NAME = process.env.GYM_NAME || 'DailyFit';

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
        const msg = message.trim();

        // 1. Initial Start / Greeting
        if (!currentStep) {
            if (msg.toLowerCase() === 'start' || msg.toLowerCase().includes('hi') || msg.toLowerCase().includes('hello')) {
                const existingMember = await this.db.findOne<Member>('members', { whatsapp_id: whatsappId });
                if (existingMember) {
                    return `Welcome back, ${existingMember.name}! Ready to crush a workout today? 💪`;
                }

                await this.conversation.setState(whatsappId, 'onboarding_check_code');
                return `Hello! 👋\n\nI am your AI Assistant from **${GYM_NAME}** powered by *DailyFit AI*.\n\nDo you have a **Membership Code** (e.g., FIT-123)?\n\nIf yes, please type it below.\nIf you are looking to join, just type 'New'.`;
            }
            return `Hey! 👋 I am the AI Assistant for ${GYM_NAME} powered by DailyFit AI.\n\nType 'Hi' to get started!`;
        }

        const data = context.data || {};

        switch (currentStep) {
            // 2. Check Code vs Lead
            case 'onboarding_check_code':
                if (msg.toLowerCase().includes('new') || msg.toLowerCase().includes('join') || msg.toLowerCase().includes('enquiry')) {
                    await this.conversation.setState(whatsappId, 'lead_name');
                    return `Fantastic! We'd love to have you at ${GYM_NAME}! 🏋️‍♂️\n\nTo help us serve you better, could you please tell me your **Name**?`;
                }

                // H-03: Real code verification against database
                if (msg.startsWith('FIT-') || /^[A-Z0-9]{4,8}$/i.test(msg)) {
                    // Look up the code in members table (pre-imported by trainer)
                    const memberByCode = await this.db.findOne<Member>('members', { member_id: msg.toUpperCase() });
                    if (memberByCode) {
                        await this.conversation.setState(whatsappId, 'code_verified_confirm', {
                            linked_member_id: memberByCode.member_id,
                            linked_name: memberByCode.name
                        });
                        return `Code found! Are you **${memberByCode.name}**? (Yes/No)`;
                    }
                    return "I didn't recognize that code. Please double-check it, or type 'New' if you want to join our gym! 😊";
                }

                return "I didn't recognize that code. Please double-check it, or type 'New' if you want to join our gym! 😊";

            // 3. Lead Capture Flow
            case 'lead_name':
                await this.conversation.setState(whatsappId, 'lead_goal', { name: msg });
                return `Nice to meet you, ${msg}! 👋\n\nWhat are your fitness goals? (e.g., Weight Loss, Muscle Gain, General Fitness)`;

            case 'lead_goal':
                await this.conversation.setState(whatsappId, 'lead_contact', { ...data, goal: msg });
                return "Great goal! 💪 We have specialized plans for that.\n\nOne of our trainers will contact you shortly with our best offers.\n\nIs this the best number to reach you on WhatsApp? (Yes/No)";

            case 'lead_contact':
                // Save lead to database
                try {
                    await this.db.upsert('leads', {
                        lead_id: uuidv4(),
                        whatsapp_id: whatsappId,
                        name: data.name || 'Unknown',
                        status: 'new',
                        notes: `Goal: ${data.goal || 'Not specified'}. Contact confirmed: ${msg}`,
                        created_at: new Date().toISOString()
                    }, 'lead_id');
                } catch (e) {
                    console.error('Error saving lead:', e);
                }
                await this.conversation.clearState(whatsappId);
                return `Perfect! I've noted down your details. 📝\n\nA trainer from ${GYM_NAME} will message you soon. Have a great day!`;

            // 4. Code Verified Flow
            case 'code_verified_confirm':
                if (msg.toLowerCase().includes('yes')) {
                    // H-03: Link whatsapp_id to the pre-imported member record
                    if (data.linked_member_id) {
                        const existingMember = await this.db.findOne<Member>('members', { member_id: data.linked_member_id });
                        if (existingMember) {
                            await this.db.upsert('members', {
                                ...existingMember,
                                whatsapp_id: whatsappId
                            }, 'member_id');
                        }
                    }
                    await this.conversation.clearState(whatsappId);
                    return "Account Linked! 🎉\n\nI have your Workout and Diet plan ready (as set by your trainer).\n\nType 'Plan' to verify them!";
                }
                await this.conversation.setState(whatsappId, 'onboarding_check_code');
                return "Oops! Let's try the code again. Please type your code:";

            // 5. Manual Onboarding Flow
            case 'onboarding_name':
                let extractedName = await this.llm.extractName(message);
                if (!extractedName) extractedName = message.trim().split(' ')[0];
                extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();

                if (extractedName.length > 30 || !/^[a-zA-Z\s]+$/.test(extractedName)) {
                    return "Hmm, that doesn't look like a name! Please let me know your real name. 😊";
                }

                await this.conversation.setState(whatsappId, 'onboarding_age', { name: extractedName });
                return `Great to meet you, ${extractedName}! 🎉\n\nHow old are you?`;

            case 'onboarding_age':
                const age = parseInt(message);
                if (isNaN(age) || age < 13 || age > 100) {
                    if (isNaN(age)) {
                        return await this.llm.generateOnboardingResponse('age', message, data);
                    }
                    return "Please enter a valid age between 13 and 100. 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_gender', { ...data, age });
                return `Got it! ${age} years young! 💪\n\nWhat's your gender?\n\n👨 Male\n👩 Female\n🧑 Other`;

            // H-03: Added gender step (was hardcoded to 'other')
            case 'onboarding_gender':
                const genderInput = msg.toLowerCase();
                let gender: 'male' | 'female' | 'other' = 'other';
                if (genderInput.includes('male') || genderInput.includes('man') || genderInput.includes('m')) {
                    gender = 'male';
                } else if (genderInput.includes('female') || genderInput.includes('woman') || genderInput.includes('f')) {
                    gender = 'female';
                }
                await this.conversation.setState(whatsappId, 'onboarding_weight', { ...data, gender });
                return `Got it! 📝\n\nWhat's your current weight in kg?`;

            case 'onboarding_weight':
                const w = parseFloat(message);
                if (isNaN(w) || w < 20 || w > 300) {
                    if (isNaN(w)) {
                        return await this.llm.generateOnboardingResponse('weight', message, data);
                    }
                    return "Please enter a valid weight between 20kg and 300kg. 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_height', { ...data, weight_kg: w });
                return `Perfect! ${w}kg noted! 📝\n\nAnd your height in cm?`;

            case 'onboarding_height':
                const h = parseFloat(message);
                if (isNaN(h) || h < 100 || h > 250) {
                    if (isNaN(h)) {
                        return await this.llm.generateOnboardingResponse('height', message, data);
                    }
                    return "Please enter a valid height between 100cm and 250cm. 😊";
                }
                await this.conversation.setState(whatsappId, 'onboarding_goal', { ...data, height_cm: h });
                return `Awesome! ${h}cm! 📏\n\nNow, what's your main fitness goal?\n\n🔥 Fat Loss\n💪 Muscle Gain\n⚖️ Maintenance`;

            // H-03: Goal actually parses user input (was hardcoded to fat_loss)
            case 'onboarding_goal':
                const goalInput = msg.toLowerCase();
                let goal: 'fat_loss' | 'muscle_gain' | 'maintenance' = 'fat_loss';
                if (goalInput.includes('muscle') || goalInput.includes('gain') || goalInput.includes('bulk')) {
                    goal = 'muscle_gain';
                } else if (goalInput.includes('maintain') || goalInput.includes('balance')) {
                    goal = 'maintenance';
                } else if (goalInput.includes('fat') || goalInput.includes('loss') || goalInput.includes('lose') || goalInput.includes('slim') || goalInput.includes('lean')) {
                    goal = 'fat_loss';
                }
                await this.conversation.setState(whatsappId, 'onboarding_diet', { ...data, goal });
                return `Great choice — ${goal.replace('_', ' ')}! 🎯\n\nLast question: Diet preference?\n\n🥬 Veg\n🍗 Non-Veg\n🌱 Vegan`;

            // H-03: Diet properly parses vegan option (was missing)
            case 'onboarding_diet':
                const dietInput = msg.toLowerCase();
                let diet: 'veg' | 'non-veg' | 'vegan' = 'veg';
                if (dietInput.includes('non') || dietInput.includes('non-veg') || dietInput.includes('meat') || dietInput.includes('chicken')) {
                    diet = 'non-veg';
                } else if (dietInput.includes('vegan') || dietInput.includes('plant')) {
                    diet = 'vegan';
                }

                // H-03: Ask for consent before proceeding
                await this.conversation.setState(whatsappId, 'onboarding_consent', { ...data, diet_preference: diet });
                return `Almost done! 🎉\n\nBy continuing, you agree to:\n✅ Our Terms of Service\n✅ DailyFit processing your health data to create personalized plans\n\nDo you agree? (Yes/No)`;

            // H-03: Actual consent collection (was auto-set to true)
            case 'onboarding_consent':
                if (!msg.toLowerCase().includes('yes') && !msg.toLowerCase().includes('agree')) {
                    await this.conversation.clearState(whatsappId);
                    return "No worries! You can come back anytime when you're ready. Have a great day! 👋";
                }

                const finalData = data;

                // CREATE MEMBER
                const newMember: Member = {
                    member_id: uuidv4(),
                    whatsapp_id: whatsappId,
                    name: finalData.name,
                    age: finalData.age,
                    gender: finalData.gender || 'other',
                    height_cm: finalData.height_cm,
                    weight_kg: finalData.weight_kg,
                    goal: finalData.goal,
                    diet_preference: finalData.diet_preference,
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

                try {
                    const { mealPlan, workoutPlan, summary } = await this.planGenerator.generatePlan(newMember);
                    await this.db.upsert('meal_plans', mealPlan, 'plan_id');
                    await this.db.upsert('workout_plans', workoutPlan, 'plan_id');
                    return `🎉 Welcome to ${GYM_NAME}, ${finalData.name}!\n\n${summary}\n\nYou are handled by DailyFit AI. Ask me anything!`;
                } catch (planError) {
                    console.error('Error generating initial plan:', planError);
                    return `🎉 Welcome to ${GYM_NAME}, ${finalData.name}!\n\nYour account is set up! Your trainer will assign your personalized plan shortly.\n\nIn the meantime, feel free to ask me any fitness questions! 💪`;
                }
        }

        return "I didn't quite get that. Let's continue! 😊";
    }
}
