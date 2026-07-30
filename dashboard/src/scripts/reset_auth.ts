import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtdutcahpdtjsimzwcbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZHV0Y2FocGR0anNpbXp3Y2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDQzMTEsImV4cCI6MjA4MDMyMDMxMX0.gEbixAu1gL0lCoAlQMHmcD-l1cd7xMuvDfopCIZ3IpY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'theakhileshreddy07@gmail.com';
    const password = 'AdminPassword123!';

    console.log(`Checking account status for: ${email}`);

    // Try signing up (if user doesn't exist)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
    });

    if (signUpError) {
        console.log(`SignUp result: ${signUpError.message}`);
        if (signUpError.message.includes('User already registered') || signUpError.message.includes('already exists')) {
            console.log(`User is already registered in Supabase Auth.`);
            // Send password reset email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
            if (resetError) {
                console.error(`Reset error: ${resetError.message}`);
            } else {
                console.log(`✅ Password reset email dispatched for ${email}`);
            }
        }
    } else {
        console.log(`✅ Account created for ${email} with password: ${password}`);
    }
}

main().catch(console.error);
