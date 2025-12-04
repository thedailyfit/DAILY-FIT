import { Orchestrator } from '../core/Orchestrator';

async function testConversationalFlow() {
    console.log("🎬 Testing Enhanced Conversational Onboarding\n");
    console.log("=".repeat(60));

    const orchestrator = new Orchestrator();
    const userId = "conversational_test_" + Date.now();

    async function chat(input: string) {
        console.log(`\n👤 User: "${input}"`);
        const response = await orchestrator.handleIncomingMessage(userId, input);
        console.log(`🤖 Agent: ${response}`);
        console.log("-".repeat(60));
    }

    // Test conversational interruptions
    await chat("start");
    await chat("hii what's your name");  // Asking question instead of giving name
    await chat("Akhilesh");  // Now giving actual name
    await chat("why do you need my age?");  // Asking why
    await chat("25");  // Giving age
    await chat("72");
    await chat("178");
    await chat("muscle_gain");
    await chat("non-veg");

    console.log("\n✅ Conversational flow test complete!\n");
}

testConversationalFlow().catch(console.error);
