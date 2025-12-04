import readline from 'readline';
import { Orchestrator } from '../core/Orchestrator';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const orchestrator = new Orchestrator();

// Default to a random member ID for testing
let currentWhatsappId = '1234567890';

console.log('--- DailyFit WhatsApp Simulator ---');
console.log('Commands:');
console.log('/switch <id>  - Switch to a different WhatsApp ID');
console.log('/trainer <id> - Switch to a Trainer ID (you must manually create a trainer record first or use a known one)');
console.log('/exit         - Exit simulator');
console.log('-----------------------------------');
console.log(`Current ID: ${currentWhatsappId}`);

const ask = () => {
    rl.question('> ', async (input) => {
        if (input.startsWith('/exit')) {
            rl.close();
            return;
        }

        if (input.startsWith('/switch ')) {
            currentWhatsappId = input.split(' ')[1];
            console.log(`Switched to ID: ${currentWhatsappId}`);
            ask();
            return;
        }

        try {
            const response = await orchestrator.handleIncomingMessage(currentWhatsappId, input);
            console.log(`Bot: ${response}`);
        } catch (error) {
            console.error('Error:', error);
        }

        ask();
    });
};

ask();
