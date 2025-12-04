import { Orchestrator } from '../core/Orchestrator';

async function testNameExtraction() {
    console.log("🎬 Testing Intelligent Name Extraction\n");
    console.log("=".repeat(60));

    const orchestrator = new Orchestrator();

    async function testName(userId: string, input: string) {
        console.log(`\n👤 User says: "${input}"`);
        await orchestrator.handleIncomingMessage(userId, "start");
        const response = await orchestrator.handleIncomingMessage(userId, input);
        console.log(`🤖 Agent: ${response.substring(0, 100)}...`);
        console.log("-".repeat(60));
    }

    // Test various ways people might say their name
    await testName("test1", "my name is Akhil");
    await testName("test2", "I'm Priya");
    await testName("test3", "call me Rahul");
    await testName("test4", "name is just akhil");
    await testName("test5", "hey name is not 'akhil what about you' my name is just akhil");
    await testName("test6", "Sneha");  // Simple name

    console.log("\n✅ Name extraction test complete!\n");
}

testNameExtraction().catch(console.error);
