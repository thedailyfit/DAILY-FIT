import express from 'express';
import bodyParser from 'body-parser';
import { Orchestrator } from './core/Orchestrator';
import twilio from 'twilio';
import dotenv from 'dotenv';
import crypto from 'crypto';

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
// Helper function to send WhatsApp messages
async function sendWhatsAppMessage(to: string, message: string, memberId?: string) {
    try {
        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
            body: message
        });
        console.log(`✅ Message sent to ${to}`);

        // Save outgoing message to DB
        if (memberId) {
            await db.upsert('chat_history', {
                id: crypto.randomUUID(),
                member_id: memberId,
                sender: 'assistant',
                message: message,
                metadata: { whatsapp_id: to },
                created_at: new Date()
            }, 'id');
        }

    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
}

// Webhook for WhatsApp
app.post('/webhook/whatsapp', async (req, res) => {
    const { From, Body, MediaUrl0 } = req.body;

    try {
        const whatsappId = From.replace('whatsapp:', '');

        // 1. Lookup Member
        const member = await db.findOne<any>('members', { whatsapp_id: whatsappId });
        let memberId = member?.member_id;

        // If no member found, we might be in onboarding or they are unknown.
        // For now, if unknown, we can't link to chat_history effectively if it has FK constraint.
        // But we can check if table allows null member_id? 
        // Master script says: member_id UUID REFERENCES members(member_id)
        // It's not NOT NULL, so it might allow null.
        // Ideally we should create a 'prospect' or 'lead' member?
        // For simplicity, if not found, we skip DB save or create a temp member?
        // Let's log warning and try to save with raw whatsapp_id in metadata if possible?
        // Actually, chat_history has member_id.

        const metadata = { whatsapp_id: whatsappId };

        // Save incoming user message
        if (memberId) {
            await db.upsert('chat_history', {
                id: crypto.randomUUID(),
                member_id: memberId,
                sender: 'user', // schema says: 'user', 'assistant', 'system'
                message: Body,
                metadata: metadata,
                created_at: new Date()
            }, 'id');
        }

        // Process message through Orchestrator
        const orchestrator = new Orchestrator();
        const response = await orchestrator.handleIncomingMessage(
            whatsappId,
            Body,
            MediaUrl0,
            req.body.MediaContentType0 // Pass MIME type
        );

        // Check if request is from browser (has JSON content-type) or Twilio
        const isBrowserRequest = req.headers['content-type']?.includes('application/json');

        if (isBrowserRequest) {
            // Browser request - return JSON
            res.json({ message: response });
        } else {
            // Twilio WhatsApp request - send message via API and return empty TwiML
            await sendWhatsAppMessage(whatsappId, response, memberId);

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
