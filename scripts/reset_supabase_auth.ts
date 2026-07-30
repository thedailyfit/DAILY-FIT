import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../dashboard/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wtdutcahpdtjsimzwcbj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'theakhileshreddy07@gmail.com';
    const password = 'AdminPassword123!';

    console.log(`Attempting to sign in with: ${email}`);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.log(`Sign-in result: ${signInError.message}`);
        console.log(`Attempting to create account / sign-up for: ${email}`);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });

        if (signUpError) {
            console.error(`Sign-up error: ${signUpError.message}`);
        } else {
            console.log(`✅ Account created successfully for ${email}!`);
            console.log(`User ID: ${signUpData.user?.id}`);
        }
    } else {
        console.log(`✅ Account already exists and password is set to ${password}!`);
        console.log(`User ID: ${signInData.user?.id}`);
    }
}

main().catch(console.error);
