// scripts/apply_migration.ts
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function migrate() {
    console.log("🚀 Starting DailyFit V2 Migration...");

    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is not set in .env");
        console.log("⚠️ If you are using local JSON files (no database), you don't need to run this!");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const sqlPath = path.join(__dirname, '../src/models/schema_v2.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("📄 Reading schema_v2.sql...");

        // Split by ';' to run statements individually if needed, or run as one block
        // PostgreSQL driver can often run multiple statements in one query
        await pool.query(sql);

        console.log("✅ Migration applied successfully!");
        console.log("   - Created 'gyms' table");
        console.log("   - Created 'leads' table");
        console.log("   - Created 'diet_templates' table");
        console.log("   - Created 'subscriptions' table");

    } catch (error) {
        console.error("❌ Migration Failed:", error);
    } finally {
        await pool.end();
    }
}

migrate();
