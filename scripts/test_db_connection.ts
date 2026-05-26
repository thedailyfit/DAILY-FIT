import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

async function testConnection() {
    console.log("🔌 Testing connection to Supabase database...");
    console.log(`URI: ${process.env.DATABASE_URL?.split('@')[1] || 'NOT SET'}`);

    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is not set in environment!");
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false // Use false in dev for transaction pooling, true with cert rejection for prod
    });

    try {
        const start = Date.now();
        const res = await pool.query('SELECT NOW() as db_time, version() as db_version');
        const latency = Date.now() - start;
        console.log("✅ Successfully connected to Supabase PostgreSQL!");
        console.log(`🕒 DB Time: ${res.rows[0].db_time}`);
        console.log(`📊 DB Version: ${res.rows[0].db_version.split(',')[0]}`);
        console.log(`⚡ Latency: ${latency}ms`);
    } catch (err: any) {
        console.error("❌ Database connection failed!");
        console.error("Reason:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
