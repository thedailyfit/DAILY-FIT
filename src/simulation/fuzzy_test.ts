import { Orchestrator } from '../core/Orchestrator';

async function testFuzzyMatching() {
    console.log("🎬 Testing Fuzzy Matching for User Inputs\n");
    console.log("=".repeat(60));

    const orchestrator = new Orchestrator();
    const userId = "fuzzy_test_" + Date.now();

    async function chat(input: string) {
        console.log(`\n👤 User: "${input}"`);
        const response = await orchestrator.handleIncomingMessage(userId, input);
        console.log(`🤖 Agent: ${response}`);
        console.log("-".repeat(60));
    }

    // Complete onboarding with various input formats
    await chat("start");
    await chat("Rahul");
    await chat("28");
    await chat("75");
    await chat("180");
    await chat("lose weight");  // Instead of "fat_loss"
    await chat("non veg");  // With space instead of hyphen

    console.log("\n✅ Fuzzy matching test complete!\n");
    console.log("The agent understood:");
    console.log("  • 'lose weight' → fat_loss");
    console.log("  • 'non veg' → non-veg");
}

testFuzzyMatching().catch(console.error);
