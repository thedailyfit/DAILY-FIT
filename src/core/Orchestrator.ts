import { MessageRouter } from './MessageRouter';
import { DatabaseManager } from '../db/DatabaseManager';
import { ConversationManager } from './ConversationManager';
import { RAGService } from './RAGService';
import { LLMService } from './LLMService';
import { Member, Trainer, MealPlan, WorkoutPlan } from '../models/types';
import { AgentRegistry } from './AgentRegistry';

// Active & Background Agents
import { OnboardingAgent } from '../agents/OnboardingAgent';
import { MemberAgent } from '../agents/MemberAgent';
import { TrainerAgent } from '../agents/TrainerAgent';
import { PlanGeneratorAgent } from '../agents/PlanGeneratorAgent';
import { PhotoEstimatorAgent } from '../agents/PhotoEstimatorAgent';
import { MotivationAgent } from '../agents/MotivationAgent';
import { TrainerOverrideAgent } from '../agents/TrainerOverrideAgent';
import { PersonalizationAgent } from '../agents/PersonalizationAgent';
import { ProgressAnalysisAgent } from '../agents/ProgressAnalysisAgent';
import { GymAdminAgent } from '../agents/GymAdminAgent';
import { PricingUpsellAgent } from '../agents/PricingUpsellAgent';

export class Orchestrator {
    private db: DatabaseManager;
    private router: MessageRouter;
    private conversation: ConversationManager;
    private rag: RAGService;
    private llm: LLMService;
    private registry: AgentRegistry;
    private planGenerator: PlanGeneratorAgent;
    private trainerOverrideAgent: TrainerOverrideAgent;

    constructor() {
        this.db = new DatabaseManager();
        this.router = new MessageRouter(this.db);
        this.conversation = new ConversationManager(this.db);
        this.llm = new LLMService();
        this.rag = new RAGService(this.llm); // Vector RAG equipped with LLM embedding engine
        this.registry = new AgentRegistry();

        this.planGenerator = new PlanGeneratorAgent(this.db, this.rag, this.llm);
        this.trainerOverrideAgent = new TrainerOverrideAgent(this.llm, this.db);
        this.initializeAgents();
    }

    private initializeAgents() {
        // Service agents
        const photoEstimator = new PhotoEstimatorAgent(this.llm);

        // Core message agents
        const onboarding = new OnboardingAgent(this.conversation, this.db, this.llm, this.planGenerator);
        const member = new MemberAgent(this.llm, this.db, photoEstimator);
        const trainer = new TrainerAgent(this.llm, this.db);

        // Background service agents
        const motivation = new MotivationAgent(this.llm);
        const personalization = new PersonalizationAgent(this.llm, this.db);
        const progressAnalysis = new ProgressAnalysisAgent(this.llm, this.db);
        const gymAdmin = new GymAdminAgent(this.llm, this.db);
        const pricingUpsell = new PricingUpsellAgent(this.llm);

        // Register all agents in registry
        this.registry.register(onboarding);
        this.registry.register(member);
        this.registry.register(trainer);
        this.registry.register(photoEstimator);
        this.registry.register(this.planGenerator);
        this.registry.register(motivation);
        this.registry.register(this.trainerOverrideAgent);
        this.registry.register(personalization);
        this.registry.register(progressAnalysis);
        this.registry.register(gymAdmin);
        this.registry.register(pricingUpsell);
    }

    /**
     * Called when a trainer manually edits or overrides a client's plan.
     * Uses TrainerOverrideAgent to extract insight and save to Vector RAG.
     */
    async handleTrainerOverride(
        trainerId: string,
        memberProfile: any,
        beforePlan: any,
        afterPlan: any,
        reason: string
    ): Promise<void> {
        try {
            const analysis = await this.trainerOverrideAgent.analyzeOverride({
                trainer_id: trainerId,
                member_profile: memberProfile,
                before_plan: beforePlan,
                after_plan: afterPlan,
                reason
            });

            if (analysis?.rag_doc) {
                await this.rag.addDocument({
                    id: `override_${Date.now()}`,
                    content: analysis.rag_doc,
                    meta: { trainerId, tags: analysis.tags }
                });
                console.log("🧠 Successfully learned from trainer override and added to Vector RAG!");
            }
        } catch (err) {
            console.error("Error in handleTrainerOverride:", err);
        }
    }

    async handleIncomingMessage(
        whatsappId: string,
        messageBody: string,
        mediaUrl?: string,
        mediaContentType?: string
    ): Promise<string> {
        const user = await this.router.identifyUser(whatsappId);
        const state = await this.conversation.getState(whatsappId);

        // MEDIA HANDLING: Audio → Transcribe → Treat as text
        if (mediaUrl && mediaContentType?.startsWith('audio/')) {
            messageBody = await this.llm.transcribeAudio(mediaUrl);
            mediaUrl = undefined;
        }

        // Context for agents
        const context = {
            whatsappId,
            step: state?.step,
            data: state?.data,
            mediaUrl
        };

        // Image → PhotoEstimator
        if (mediaUrl && (mediaContentType?.startsWith('image/') || !mediaContentType)) {
            const photoAgent = this.registry.get('photo_estimator');
            if (photoAgent) {
                const photoContext = { ...context, photo_url: mediaUrl };
                const response = await photoAgent.handleMessage(user, messageBody, photoContext);
                if (response) return response;
            }
        }

        // 1. Onboarding / Unknown User
        if (user.type === 'unknown' || (state && state.step.startsWith('onboarding_'))) {
            const agent = this.registry.get('onboarding');
            if (agent) {
                const response = await agent.handleMessage(user, messageBody, context);
                return response || "Error in onboarding.";
            }
        }

        // 2. Member
        if (user.type === 'member') {
            const agent = this.registry.get('member');
            if (agent) {
                const response = await agent.handleMessage(user, messageBody, context);
                return response || "I'm not sure how to help with that yet.";
            }
        }

        // 3. Trainer
        if (user.type === 'trainer') {
            const agent = this.registry.get('trainer');
            if (agent) {
                const response = await agent.handleMessage(user, messageBody, context);
                return response || "Command not recognized.";
            }
        }

        return "Error: User type not recognized.";
    }

    // M-10: Public method for API-triggered plan generation
    async generatePlanForMember(member: Member): Promise<{ mealPlan: MealPlan; workoutPlan: WorkoutPlan; summary: string }> {
        return this.planGenerator.generatePlan(member);
    }
}
