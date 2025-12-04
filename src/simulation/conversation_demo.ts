import { Orchestrator } from '../core/Orchestrator';

async function demoConversation() {
    console.log("🎬 Demo: Enhanced Conversational AI Agent\n");
    console.log("=".repeat(60));

    const orchestrator = new Orchestrator();
    const userId = "demo_user_" + Date.now();

    // Helper function
    async function chat(input: string) {
        console.log(`\n👤 User: "${input}"`);
        const response = await orchestrator.handleIncomingMessage(userId, input);
        console.log(`🤖 Agent: ${response}`);
        console.log("-".repeat(60));
    }

    // Complete onboarding first
    await chat("Start");
    await chat("Akhilesh");
    await chat("25");
    await chat("72");
    await chat("178");
    await chat("muscle_gain");
    await chat("non-veg");

    console.log("\n\n🎯 Now testing conversational responses...\n");
    console.log("=".repeat(60));

    // Test various conversational queries
    await chat("tell me what workout should i do today");
    await chat("what should i eat for lunch?");
    await chat("how am i doing?");
    await chat("hey there!");
    await chat("i need a new plan");

    console.log("\n✅ Demo Complete! The agent now responds naturally! 🎉\n");
}

demoConversation().catch(console.error);
