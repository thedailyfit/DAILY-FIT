import { MessageRouter } from './MessageRouter';
import { DatabaseManager } from '../db/DatabaseManager';
import { ConversationManager } from './ConversationManager';
import { RAGService } from './RAGService';
import { LLMService } from './LLMService';
import { Member, Trainer, MealPlan, WorkoutPlan } from '../models/types';
import { AgentRegistry } from './AgentRegistry';

// Active Agents — only import agents that are actually wired into the message flow
import { OnboardingAgent } from '../agents/OnboardingAgent';
import { MemberAgent } from '../agents/MemberAgent';
import { TrainerAgent } from '../agents/TrainerAgent';
import { PlanGeneratorAgent } from '../agents/PlanGeneratorAgent';
import { PhotoEstimatorAgent } from '../agents/PhotoEstimatorAgent';

export class Orchestrator {
    private db: DatabaseManager;
    private router: MessageRouter;
    private conversation: ConversationManager;
    private rag: RAGService;
    private llm: LLMService;
    private registry: AgentRegistry;
    private planGenerator: PlanGeneratorAgent;

    constructor() {
        this.db = new DatabaseManager();
        this.router = new MessageRouter(this.db);
        this.conversation = new ConversationManager(this.db);
        this.rag = new RAGService();
        this.llm = new LLMService();
        this.registry = new AgentRegistry();

        // M-05: Only initialize agents that are actually active in the message flow
        this.planGenerator = new PlanGeneratorAgent(this.db, this.rag, this.llm);
        this.initializeAgents();
    }

    private initializeAgents() {
        // Service agents (used by core agents)
        const photoEstimator = new PhotoEstimatorAgent(this.llm);

        // Core agents (handle messages directly)
        const onboarding = new OnboardingAgent(this.conversation, this.db, this.llm, this.planGenerator);
        const member = new MemberAgent(this.llm, this.db, photoEstimator);
        const trainer = new TrainerAgent(this.llm, this.db);

        // Register only active agents
        this.registry.register(onboarding);
        this.registry.register(member);
        this.registry.register(trainer);
        this.registry.register(photoEstimator);
        this.registry.register(this.planGenerator);

        // M-05: Removed orphaned agents that returned null from handleMessage:
        // - PersonalizationAgent, TrainerOverrideAgent, MotivationAgent,
        //   ProgressAnalysisAgent, GymAdminAgent, PricingUpsellAgent,
        //   NotificationSchedulerAgent
        // These should be re-added when their service methods are actually
        // wired into specific triggers (cron jobs, events, etc.)
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
