import { Orchestrator } from '../core/Orchestrator';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const orchestrator = new Orchestrator();
let currentUserId = "interactive_user_" + Date.now();

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║         DailyFit AI Agent - Interactive Chat              ║");
console.log("╚════════════════════════════════════════════════════════════╝");
console.log("");
console.log("💬 Start chatting with your AI fitness agent!");
console.log("📝 Type 'Start' to begin onboarding");
console.log("🔄 Type '/reset' to start over with a new user");
console.log("❌ Type '/exit' to quit");
console.log("");

function askQuestion() {
    rl.question('You: ', async (input) => {
        const trimmedInput = input.trim();

        if (trimmedInput === '/exit') {
            console.log("\n👋 Goodbye! Stay fit!");
            rl.close();
            process.exit(0);
        }

        if (trimmedInput === '/reset') {
            currentUserId = "interactive_user_" + Date.now();
            console.log("\n🔄 Reset! Starting fresh conversation.\n");
            askQuestion();
            return;
        }

        if (!trimmedInput) {
            askQuestion();
            return;
        }

        try {
            const response = await orchestrator.handleIncomingMessage(
                currentUserId,
                trimmedInput
            );
            console.log(`\n🤖 Agent: ${response}\n`);
        } catch (error) {
            console.error("\n❌ Error:", error);
        }

        askQuestion();
    });
}

// Start the conversation
askQuestion();
