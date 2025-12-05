import { Agent } from './Agent';

export class AgentRegistry {
    private agents: Map<string, Agent> = new Map();

    register(agent: Agent) {
        this.agents.set(agent.name, agent);
        console.log(`✅ Registered agent: ${agent.name}`);
    }

    get(name: string): Agent | undefined {
        return this.agents.get(name);
    }

    getAll(): Agent[] {
        return Array.from(this.agents.values());
    }
}
