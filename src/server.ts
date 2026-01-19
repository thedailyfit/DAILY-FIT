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

// Basic root handler for Railway Health Checks
app.get('/', (req, res) => {
    res.send('DailyFit Backend is Running! 🚀');
});

// DEBUG ENDPOINT - To verify the server is running the latest code
app.get('/api/debug-status', (req, res) => {
    res.json({
        status: 'online',
        version: 'v3.0-fixed-numbers', // increment this to prove deployment
        env: {
            port: PORT,
            twilio_number_set: !!process.env.TWILIO_WHATSAPP_NUMBER,
            twilio_sid_set: !!process.env.TWILIO_ACCOUNT_SID
        },
        timestamp: new Date().toISOString()
    });
});

// RAILWAY DETECTION:
// If on Railway, trust their dynamic PORT.
// If Local, force 4000 to avoid conflict with Dashboard (3000).
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL;
const envPort = process.env.PORT;

const PORT = (isRailway && envPort) ? parseInt(envPort) : 4000;

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

import { DatabaseManager } from './db/DatabaseManager';

// Types
interface ProxySession {
    trainer_id: string;
    active_member_id: string;
    last_active_at: string;
}

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

// Webhook for WhatsApp - Multi-tenant support
app.post('/webhook/whatsapp', async (req, res) => {
    const { From, Body, MediaUrl0, To } = req.body;

    try {
        // Helper to normalize phone numbers (remove +, spaces, dashes)
        const normalizePhoneNumber = (phone: string) => {
            return phone.replace('whatsapp:', '').replace(/[^0-9]/g, '');
        };

        const rawFrom = From;
        const rawTo = To || process.env.TWILIO_WHATSAPP_NUMBER || '';

        const whatsappId = normalizePhoneNumber(rawFrom); // e.g., "19362336699"
        // Twilio sends "whatsapp:+1..." so we strip everything non-numeric. 
        // We also need to be careful if DB stores it with "+" or not.

        console.log(`📩 Webhook received from: ${whatsappId} (Raw: ${rawFrom})`);

        // ============================================================
        // CASE 1: Message from TRAINER (Proxy Reply)
        // ============================================================
        // Check if sender is a trainer
        // We search effectively by checking if the DB number contains this digits or matches exactly
        // Since DB usually stores "+1936..." we try to match robustly

        // Fetch all connections and filter in memory if needed, or search by exact match if standardized.
        // For now, let's assume DB stores "+1936..." or "1936..."
        // We'll try to match both forms.

        const connections = await db.read<any>('whatsapp_connections');

        const trainerConnection = connections?.find((c: any) => {
            const dbPhone = normalizePhoneNumber(c.phone_number);
            return (dbPhone.endsWith(whatsappId) || whatsappId.endsWith(dbPhone)) && c.is_connected;
        });

        if (trainerConnection) {
            console.log(`👨‍🏫 Message from Trainer ${trainerConnection.trainer_id}`);

            // Check for Active Proxy Session
            const session = await db.findOne<ProxySession>('whatsapp_proxy_sessions', { trainer_id: trainerConnection.trainer_id });

            if (session && session.active_member_id) {
                // Get Member Details
                const member = await db.findOne<any>('members', { member_id: session.active_member_id });

                if (member && member.whatsapp_id) {
                    console.log(`↪️ Proxying to Member ${member.name} (${member.whatsapp_id})`);

                    // Forward message to Member
                    await sendWhatsAppMessage(member.whatsapp_id, Body, member.member_id);

                    res.type('text/xml').send('<Response></Response>');
                    return;
                }
            } else {
                await sendWhatsAppMessage(whatsappId, "⚠️ No active client session. Wait for a client to message you first.");
                res.type('text/xml').send('<Response></Response>');
                return;
            }
        }

        // ============================================================
        // CASE 2: Message from CLIENT (Standard Flow + Forwarding)
        // ============================================================

        // 1. Multi-tenant: Find which trainer owns this WhatsApp number (if dedicated) OR use shared logic
        let trainerId: string | null = null;

        // Logic: Who is this member's trainer?
        // We also normalize member's whatsapp_id for robust matching
        const members = await db.read<any>('members');
        const member = members?.find((m: any) => {
            if (!m.whatsapp_id) return false;
            const dbPhone = normalizePhoneNumber(m.whatsapp_id);
            return dbPhone.endsWith(whatsappId) || whatsappId.endsWith(dbPhone);
        });

        if (member) {
            trainerId = member.trainer_id;
        }

        /* 
           Fallback for Shared Number: 
           If member not found, we can't route yet unless we use Invite Code (Phase 14.3).
           For now, assuming member is already registered via dashboard.
        */

        let memberId = member?.member_id;

        // For Pro Plan: Use assigned_trainer_id (staff trainer) if set, otherwise fallback to trainer_id (solo trainer)
        const assignedTrainerId = member?.assigned_trainer_id || member?.trainer_id;
        const metadata = {
            whatsapp_id: whatsappId,
            trainer_id: member?.trainer_id,
            assigned_trainer_id: member?.assigned_trainer_id,
            routing_trainer: assignedTrainerId // The trainer who will receive this message
        };

        if (!memberId) {
            console.log(`❓ Unknown sender: ${whatsappId}`);

            // Check if this is a "Join" attempt or just a random message
            // We'll send a generic Welcome / Fallback message so the user knows the bot is alive.
            const welcomeMsg = `👋 Welcome to DailyFit!\n\nI don't recognize this number yet. Please ask your trainer to add you to their client list.\n\n(If you are a trainer testing this, please ensure your number is connected in the Dashboard).`;

            await sendWhatsAppMessage(whatsappId, welcomeMsg);

            res.type('text/xml').send('<Response></Response>');
            return;
        }

        // Save incoming user message
        if (memberId) {
            // Check Daily Limit
            const todayCount = await db.countDailyMessages(memberId, 'user');
            if (todayCount >= 20) {
                await sendWhatsAppMessage(whatsappId, "Daily AI limit reached.", memberId);
                res.type('text/xml').send('<Response></Response>');
                return;
            }

            await db.upsert('chat_history', {
                id: crypto.randomUUID(),
                member_id: memberId,
                sender: 'user',
                message: Body,
                metadata: metadata,
                created_at: new Date()
            }, 'id');
        }

        // ============================================================
        // BRIDGE: Forward to Trainer & Update Session
        // ============================================================
        // Use assignedTrainerId for Pro Plan trainers
        if (assignedTrainerId) {
            // 1. Update Proxy Session (Set this member as Active)
            await db.upsert('whatsapp_proxy_sessions', {
                trainer_id: assignedTrainerId,
                active_member_id: memberId,
                last_active_at: new Date()
            }, 'trainer_id');

            // 2. Forward to Trainer's WhatsApp (if connected)
            // First check staff table for Pro trainers
            const staffTrainer = await db.findOne<any>('staff', { id: assignedTrainerId });
            if (staffTrainer?.whatsapp_notification_number) {
                const forwardBody = `📩 *${member.name || 'Client'}*: ${Body}`;
                await sendWhatsAppMessage(staffTrainer.whatsapp_notification_number, forwardBody);
            } else {
                // Fallback to whatsapp_connections for solo trainers
                const trainerConn = await db.findOne<any>('whatsapp_connections', { trainer_id: assignedTrainerId, is_connected: true });
                if (trainerConn) {
                    const forwardBody = `📩 *${member.name || 'Client'}*: ${Body}`;
                    await sendWhatsAppMessage(trainerConn.phone_number, forwardBody);
                }
            }
        }

        // Process message through Orchestrator (AI Agent)
        const orchestrator = new Orchestrator();
        const response = await orchestrator.handleIncomingMessage(
            whatsappId,
            Body,
            MediaUrl0,
            req.body.MediaContentType0
        );

        const isBrowserRequest = req.headers['content-type']?.includes('application/json');

        if (isBrowserRequest) {
            res.json({ message: response });
        } else {
            // Send AI Reply to Client
            await sendWhatsAppMessage(whatsappId, response, memberId);

            // OPTIONAL: Forward AI reply to Trainer so they see what AI said?
            // checking... user didn't explicitly ask, but it's good context.
            // keeping it simple for now to save costs/noise.

            res.type('text/xml');
            res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DailyFit server running on port ${PORT}`);
    console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
