import { Orchestrator } from './src/core/Orchestrator';
import { DatabaseManager } from './src/db/DatabaseManager';

async function testArchitecture() {
    console.log("🚀 Starting Architecture Test...");

    const orchestrator = new Orchestrator();

    // Test 1: Onboarding (New User)
    const newUserId = `TEST_${Date.now()}`;
    console.log(`\n--- Test 1: Onboarding (${newUserId}) ---`);

    let response = await orchestrator.handleIncomingMessage(newUserId, "Start");
    console.log(`User: Start`);
    console.log(`Bot: ${response}`);

    response = await orchestrator.handleIncomingMessage(newUserId, "John Doe");
    console.log(`User: John Doe`);
    console.log(`Bot: ${response}`);

    // Test 2: Member Query (Existing Member)
    // Let's assume we have a member "M001" (from sample data or previous runs)
    // Or we can use the user we just onboarded if we finish the flow, but that takes many steps.
    // Let's use a known member ID if possible, or just mock one in DB.
    // For now, let's try to query with the new user (who is still in onboarding).

    // Test 3: Trainer Command
    console.log(`\n--- Test 3: Trainer Command ---`);
    // We need a trainer in the DB.
    // Let's insert a dummy trainer first.
    const db = new DatabaseManager();
    await db.upsert('trainers', {
        trainer_id: 'T_TEST',
        whatsapp_id: 'T_WA_TEST',
        name: 'Test Trainer',
        specialization: 'General',
        assigned_member_ids: [],
        edit_history: [],
        daily_digest_preferences: { time: '08:00', include_low_adherence: true }
    }, 'trainer_id');

    response = await orchestrator.handleIncomingMessage('T_WA_TEST', '#clients');
    console.log(`Trainer: #clients`);
    console.log(`Bot: ${response}`);

    console.log("\n✅ Architecture Test Complete");
}

testArchitecture().catch(console.error);
