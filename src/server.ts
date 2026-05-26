import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Orchestrator } from './core/Orchestrator';
import twilio from 'twilio';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { DatabaseManager } from './db/DatabaseManager';

dotenv.config();

// ============================================================
// C-01: Validate required environment variables at startup
// ============================================================
const REQUIRED_ENV_VARS = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_WHATSAPP_NUMBER',
    'GEMINI_API_KEY',
] as const;

for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
        console.error(`FATAL: Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const app = express();

// Parse request bodies
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static('public'));

// ============================================================
// C-03: Environment-based CORS configuration
// ============================================================
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim());

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ============================================================
// H-08: Rate limiting
// ============================================================
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(maxRequests: number, windowMs: number) {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const entry = requestCounts.get(key);

        if (!entry || now > entry.resetAt) {
            requestCounts.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (entry.count >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((entry.resetAt - now) / 1000)
            });
        }

        entry.count++;
        next();
    };
}

// Global rate limit: 100 requests per minute per IP
app.use(rateLimiter(100, 60 * 1000));

// ============================================================
// C-04: API Key authentication middleware
// ============================================================
const API_KEY = process.env.API_SECRET_KEY;

function requireApiKey(req: Request, res: Response, next: NextFunction) {
    if (!API_KEY) {
        // If no API key is configured, skip auth (dev mode)
        console.warn('⚠️ API_SECRET_KEY not set — API endpoints are unprotected');
        return next();
    }

    const providedKey = req.headers['x-api-key'] || req.query.apiKey;
    if (providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Invalid or missing API key' });
    }
    next();
}

// ============================================================
// H-01: Twilio webhook signature validation middleware
// ============================================================
function validateTwilioSignature(req: Request, res: Response, next: NextFunction) {
    // Skip validation in development
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }

    const twilioSignature = req.headers['x-twilio-signature'] as string;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const isValid = twilio.validateRequest(
        authToken,
        twilioSignature || '',
        url,
        req.body
    );

    if (!isValid) {
        console.error('⚠️ Invalid Twilio webhook signature — possible spoofing attempt');
        return res.status(403).json({ error: 'Invalid signature' });
    }

    next();
}

// ============================================================
// RAILWAY DETECTION
// ============================================================
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL;
const envPort = process.env.PORT;
const PORT = (isRailway && envPort) ? parseInt(envPort) : 4000;

// ============================================================
// C-05: Singleton instances — NOT created per request
// ============================================================
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const db = new DatabaseManager();
const orchestrator = new Orchestrator();

// ============================================================
// Types
// ============================================================
interface ProxySession {
    trainer_id: string;
    active_member_id: string;
    last_active_at: string;
}

// ============================================================
// Routes
// ============================================================

// Health check with real DB connectivity
app.get('/', (_req: Request, res: Response) => {
    res.send('DailyFit Backend is Running! 🚀');
});

app.get('/health', async (_req: Request, res: Response) => {
    const dbHealth = await db.healthCheck();
    const status = dbHealth.connected ? 'healthy' : 'degraded';
    const statusCode = dbHealth.connected ? 200 : 503;

    res.status(statusCode).json({
        status,
        timestamp: new Date().toISOString(),
        database: dbHealth,
        uptime: process.uptime()
    });
});

// L-07: Debug endpoint — only in development
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/debug-status', (_req: Request, res: Response) => {
        res.json({
            status: 'online',
            version: 'v4.0-security-hardened',
            env: {
                port: PORT,
                twilio_number_set: !!process.env.TWILIO_WHATSAPP_NUMBER,
                twilio_sid_set: !!process.env.TWILIO_ACCOUNT_SID,
                node_env: process.env.NODE_ENV
            },
            timestamp: new Date().toISOString()
        });
    });
}

// ============================================================
// Helper: Send WhatsApp message via Twilio
// ============================================================
async function sendWhatsAppMessage(to: string, message: string, memberId?: string) {
    try {
        // Validate phone number format
        const cleanPhone = to.replace(/[^0-9+]/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            throw new Error(`Invalid phone number: ${to}`);
        }

        const toNumber = cleanPhone.startsWith('whatsapp:') ? cleanPhone : `whatsapp:${cleanPhone}`;

        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: toNumber,
            body: message.slice(0, 1600) // WhatsApp message limit
        });
        console.log(`✅ Message sent to ${cleanPhone}`);

        // Save outgoing message to DB
        if (memberId) {
            await db.upsert('chat_history', {
                id: crypto.randomUUID(),
                member_id: memberId,
                sender: 'assistant',
                message: message,
                metadata: { whatsapp_id: cleanPhone },
                created_at: new Date()
            }, 'id');
        }
    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
}

// ============================================================
// Helper: Normalize phone numbers
// ============================================================
function normalizePhoneNumber(phone: string): string {
    return phone.replace('whatsapp:', '').replace(/[^0-9]/g, '');
}

// ============================================================
// Webhook: WhatsApp — Twilio signature validated
// ============================================================
app.post('/webhook/whatsapp',
    rateLimiter(30, 60 * 1000), // 30 webhook calls/min per IP
    validateTwilioSignature,
    async (req: Request, res: Response) => {
        const { From, Body, MediaUrl0, To } = req.body;

        try {
            const whatsappId = normalizePhoneNumber(From || '');

            if (!whatsappId || !Body) {
                res.type('text/xml').send('<Response></Response>');
                return;
            }

            console.log(`📩 Webhook received from: ${whatsappId}`);

            // ---- CASE 1: TRAINER (Proxy Reply) ----
            const connections = await db.read<any>('whatsapp_connections');
            const trainerConnection = connections?.find((c: any) => {
                const dbPhone = normalizePhoneNumber(c.phone_number || '');
                return (dbPhone.endsWith(whatsappId) || whatsappId.endsWith(dbPhone)) && c.is_connected;
            });

            if (trainerConnection) {
                console.log(`👨‍🏫 Message from Trainer ${trainerConnection.trainer_id}`);

                const session = await db.findOne<ProxySession>(
                    'whatsapp_proxy_sessions',
                    { trainer_id: trainerConnection.trainer_id }
                );

                if (session?.active_member_id) {
                    const member = await db.findOne<any>('members', { member_id: session.active_member_id });
                    if (member?.whatsapp_id) {
                        console.log(`↪️ Proxying to Member ${member.name} (${member.whatsapp_id})`);
                        await sendWhatsAppMessage(member.whatsapp_id, Body, member.member_id);
                        res.type('text/xml').send('<Response></Response>');
                        return;
                    }
                } else {
                    await sendWhatsAppMessage(
                        whatsappId,
                        "⚠️ No active client session. Wait for a client to message you first."
                    );
                    res.type('text/xml').send('<Response></Response>');
                    return;
                }
            }

            // ---- CASE 2: CLIENT (Standard Flow) ----
            const members = await db.read<any>('members');
            const member = members?.find((m: any) => {
                if (!m.whatsapp_id) return false;
                const dbPhone = normalizePhoneNumber(m.whatsapp_id);
                return dbPhone.endsWith(whatsappId) || whatsappId.endsWith(dbPhone);
            });

            const memberId = member?.member_id;
            const assignedTrainerId = member?.assigned_trainer_id || member?.trainer_id;

            if (!memberId) {
                console.log(`❓ Unknown sender: ${whatsappId}`);
                const welcomeMsg = `👋 Welcome to DailyFit!\n\nI don't recognize this number yet. Please ask your trainer to add you to their client list.\n\n(If you are a trainer testing this, please ensure your number is connected in the Dashboard).`;
                await sendWhatsAppMessage(whatsappId, welcomeMsg);
                res.type('text/xml').send('<Response></Response>');
                return;
            }

            // Daily limit check
            const todayCount = await db.countDailyMessages(memberId, 'user');
            if (todayCount >= 20) {
                await sendWhatsAppMessage(whatsappId, "Daily AI limit reached.", memberId);
                res.type('text/xml').send('<Response></Response>');
                return;
            }

            // Save incoming message
            await db.upsert('chat_history', {
                id: crypto.randomUUID(),
                member_id: memberId,
                sender: 'user',
                message: Body,
                metadata: {
                    whatsapp_id: whatsappId,
                    trainer_id: member?.trainer_id,
                    assigned_trainer_id: member?.assigned_trainer_id,
                },
                created_at: new Date()
            }, 'id');

            // Forward to trainer
            if (assignedTrainerId) {
                await db.upsert('whatsapp_proxy_sessions', {
                    trainer_id: assignedTrainerId,
                    active_member_id: memberId,
                    last_active_at: new Date()
                }, 'trainer_id');

                const staffTrainer = await db.findOne<any>('staff', { id: assignedTrainerId });
                if (staffTrainer?.whatsapp_notification_number) {
                    await sendWhatsAppMessage(
                        staffTrainer.whatsapp_notification_number,
                        `📩 *${member.name || 'Client'}*: ${Body}`
                    );
                } else {
                    const trainerConn = await db.findOne<any>(
                        'whatsapp_connections',
                        { trainer_id: assignedTrainerId, is_connected: true }
                    );
                    if (trainerConn) {
                        await sendWhatsAppMessage(
                            trainerConn.phone_number,
                            `📩 *${member.name || 'Client'}*: ${Body}`
                        );
                    }
                }
            }

            // Process through AI
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
                await sendWhatsAppMessage(whatsappId, response, memberId);
                res.type('text/xml');
                res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ============================================================
// M-10: Real API endpoints (no stubs)
// ============================================================
app.get('/api/member/:id/plan', requireApiKey, async (req: Request, res: Response) => {
    try {
        const memberId = req.params.id;
        if (!memberId || !/^[a-zA-Z0-9-]+$/.test(memberId)) {
            return res.status(400).json({ error: 'Invalid member ID format' });
        }

        const member = await db.findOne<any>('members', { member_id: memberId });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        const plans = await db.read<any>('meal_plans', { member_id: memberId });
        const activePlan = plans.find((p: any) => p.status === 'active');

        const workoutPlans = await db.read<any>('workout_plans', { member_id: memberId });
        const activeWorkout = workoutPlans.find((p: any) => p.status === 'active');

        res.json({
            member: {
                member_id: member.member_id,
                name: member.name,
                goal: member.goal,
            },
            meal_plan: activePlan || null,
            workout_plan: activeWorkout || null
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/plans', requireApiKey, async (req: Request, res: Response) => {
    try {
        const { memberId } = req.body;
        if (!memberId) {
            return res.status(400).json({ error: 'memberId is required' });
        }

        const member = await db.findOne<any>('members', { member_id: memberId });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        const { mealPlan, workoutPlan, summary } = await orchestrator.generatePlanForMember(member);

        await db.upsert('meal_plans', mealPlan, 'plan_id');
        await db.upsert('workout_plans', workoutPlan, 'plan_id');

        res.json({
            success: true,
            summary,
            meal_plan: mealPlan,
            workout_plan: workoutPlan
        });
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/notify/member', requireApiKey, async (req: Request, res: Response) => {
    const { memberId, message, phone } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (message.length > 1600) {
        return res.status(400).json({ error: 'Message exceeds 1600 character limit' });
    }

    try {
        let targetPhone = phone;

        if (!targetPhone && memberId) {
            const member = await db.findOne<any>('members', { member_id: memberId });
            targetPhone = member?.whatsapp_id || member?.phone_number;
        }

        if (!targetPhone) {
            return res.status(400).json({ error: 'No phone number found for this member' });
        }

        await sendWhatsAppMessage(targetPhone, message, memberId);
        res.json({ success: true, message: 'WhatsApp notification sent' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// ============================================================
// Server startup
// ============================================================
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DailyFit server running on port ${PORT}`);
    console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🔒 CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
    console.log(`🔑 API auth: ${API_KEY ? 'ENABLED' : 'DISABLED (dev mode)'}`);
});

// ============================================================
// L-10: Graceful shutdown
// ============================================================
async function shutdown(signal: string) {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        await db.close();
        console.log('Server closed. Goodbye.');
        process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
