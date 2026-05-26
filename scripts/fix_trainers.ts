import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    
    try {
        console.log('Ensuring trainers table exists...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS trainers (
                trainer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                whatsapp_id VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                age INT,
                phone_number VARCHAR(20),
                city VARCHAR(100),
                profile_picture_url TEXT,
                specialization VARCHAR(255),
                assigned_member_ids JSONB DEFAULT '[]'::jsonb,
                edit_history JSONB DEFAULT '[]'::jsonb,
                daily_digest_preferences JSONB DEFAULT '{"time":"08:00","include_low_adherence":true}'::jsonb
            );
        `);
        
        console.log('Checking columns in trainers...');
        const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'trainers'`);
        const columns = res.rows.map(r => r.column_name);
        
        if (!columns.includes('assigned_member_ids')) {
            console.log('Adding assigned_member_ids...');
            await client.query(`ALTER TABLE trainers ADD COLUMN assigned_member_ids JSONB DEFAULT '[]'::jsonb`);
        }
        if (!columns.includes('edit_history')) {
            console.log('Adding edit_history...');
            await client.query(`ALTER TABLE trainers ADD COLUMN edit_history JSONB DEFAULT '[]'::jsonb`);
        }
        if (!columns.includes('daily_digest_preferences')) {
            console.log('Adding daily_digest_preferences...');
            await client.query(`ALTER TABLE trainers ADD COLUMN daily_digest_preferences JSONB DEFAULT '{"time":"08:00","include_low_adherence":true}'::jsonb`);
        }
        
        console.log('Trainers table updated successfully.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run().catch(console.error);
