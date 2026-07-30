import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL missing");
        process.exit(1);
    }

    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    const email = 'theakhileshreddy07@gmail.com';

    console.log(`Checking user: ${email}...`);
    const res = await client.query(`SELECT id, email, encrypted_password FROM auth.users WHERE email = $1`, [email]);

    if (res.rows.length === 0) {
        console.log(`User not found in auth.users.`);
    } else {
        const userId = res.rows[0].id;
        console.log(`User found (ID: ${userId}).`);
    }

    await client.end();
}

main().catch(console.error);
