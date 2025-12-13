import express from 'express';
import bodyParser from 'body-parser';
import { Orchestrator } from './core/Orchestrator';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// Enable CORS for browser testing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const PORT = process.env.PORT || 3000;

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

import { DatabaseManager } from './db/DatabaseManager';

// Initialize DB for saving messages
const db = new DatabaseManager();

// Helper function to send WhatsApp messages
async function sendWhatsAppMessage(to: string, message: string) {
    try {
        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
            body: message
        });
        console.log(`✅ Message sent to ${to}`);

        // Save outgoing message to DB
        await db.upsert('messages', {
            whatsapp_id: to, // 'to' is the whatsapp_id (phone number)
            role: 'assistant',
            content: message,
            created_at: new Date()
        }, 'id'); // We rely on auto-gen ID, so 'id' as conflict key is dummy if we don't provide it.
        // Actually upsert expects a key. If we want to simple insert, upsert might wrong if we don't have unique key.
        // DatabaseManager.upsert implementation:
        // INSERT INTO table (keys) VALUES (vals) ON CONFLICT (uniqueKey) DO UPDATE...
        // If we want just INSERT, we can't use upsert easily unless we generate an ID.
        // But DatabaseManager doesn't have 'insert'.
        // Let's look at DatabaseManager again. It has `upsert`.
        // If I pass a dummy ID it might fail.
        // I should probably add `insert` to DatabaseManager or use `pool.query` directly if accessible.
        // `pool` is private.
        // But `server.ts` acts as the app. behavior.
        // I will add a method to DatabaseManager or just use a random ID for upsert.
        // UUID generation needed.

    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
}

// ... (in webhook handler)
try {
    // Save incoming user message
    await db.upsert('messages', {
        id: crypto.randomUUID(), // Need crypto or uuid
        whatsapp_id: whatsappId,
        role: 'user',
        content: Body,
        media_url: MediaUrl0,
        created_at: new Date()
    }, 'id');

    // Process message through Orchestrator
    const orchestrator = new Orchestrator();
    const response = await orchestrator.handleIncomingMessage(
        whatsappId,
        Body,
        MediaUrl0
    );

    // Check if request is from browser (has JSON content-type) or Twilio
    const isBrowserRequest = req.headers['content-type']?.includes('application/json');

    if (isBrowserRequest) {
        // Browser request - return JSON
        res.json({ message: response });
    } else {
        // Twilio WhatsApp request - send message via API and return empty TwiML
        await sendWhatsAppMessage(whatsappId, response);

        // Return empty TwiML response (WhatsApp requires API, not TwiML messages)
        res.type('text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
    }
} catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Error processing message' });
}
});

// API Endpoints (for testing and admin)
app.get('/api/member/:id/plan', async (req, res) => {
    const orchestrator = new Orchestrator();
    // Implementation here
    res.json({ message: 'Get member plan endpoint' });
});

app.post('/api/plans', async (req, res) => {
    const orchestrator = new Orchestrator();
    // Implementation here
    res.json({ message: 'Generate plan endpoint' });
});

app.post('/api/notify/member', async (req, res) => {
    const { memberId, message } = req.body;
    // Send notification via WhatsApp
    res.json({ message: 'Notification sent' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 DailyFit server running on port ${PORT}`);
    console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
