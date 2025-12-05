import { MessageRouter } from './MessageRouter';
import { DatabaseManager } from '../db/DatabaseManager';
import { ConversationManager } from './ConversationManager';
import { RAGService } from './RAGService';
import { LLMService } from './LLMService';
import { Member, Trainer } from '../models/types';
import { AgentRegistry } from './AgentRegistry';

// Agents
import { OnboardingAgent } from '../agents/OnboardingAgent';
import { MemberAgent } from '../agents/MemberAgent';
import { TrainerAgent } from '../agents/TrainerAgent';
import { PlanGeneratorAgent } from '../agents/PlanGeneratorAgent';
import { PhotoEstimatorAgent } from '../agents/PhotoEstimatorAgent';
import { PersonalizationAgent } from '../agents/PersonalizationAgent';
import { TrainerOverrideAgent } from '../agents/TrainerOverrideAgent';
import { MotivationAgent } from '../agents/MotivationAgent';

export class Orchestrator {
    private db: DatabaseManager;
    private router: MessageRouter;
    private conversation: ConversationManager;
    private rag: RAGService;
    private llm: LLMService;
    private registry: AgentRegistry;

    constructor() {
        this.db = new DatabaseManager();
        this.router = new MessageRouter(this.db);
        this.conversation = new ConversationManager(this.db);
        this.rag = new RAGService();
        this.llm = new LLMService();
        this.registry = new AgentRegistry();

        this.initializeAgents();
    }

    private initializeAgents() {
        // Service Agents (Dependencies)
        const photoEstimator = new PhotoEstimatorAgent(this.llm);
        const planGenerator = new PlanGeneratorAgent(this.db, this.rag, this.llm);
        const personalization = new PersonalizationAgent(this.llm, this.db);
        const trainerOverride = new TrainerOverrideAgent(this.llm, this.db);
        const motivation = new MotivationAgent(this.llm);

        // Core Agents
        const onboarding = new OnboardingAgent(this.conversation, this.db, this.llm, planGenerator);
        const member = new MemberAgent(this.llm, this.db, photoEstimator);
        const trainer = new TrainerAgent(this.llm, this.db);

        // Register Agents
        this.registry.register(onboarding);
        this.registry.register(member);
        this.registry.register(trainer);
        this.registry.register(photoEstimator);
        this.registry.register(planGenerator);
        this.registry.register(personalization);
        this.registry.register(trainerOverride);
        this.registry.register(motivation);
    }

    async handleIncomingMessage(whatsappId: string, messageBody: string, mediaUrl?: string): Promise<string> {
        const user = await this.router.identifyUser(whatsappId);
        const state = await this.conversation.getState(whatsappId);

        // Context for agents
        const context = {
            whatsappId,
            step: state?.step,
            data: state?.data,
            mediaUrl
        };

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
}
