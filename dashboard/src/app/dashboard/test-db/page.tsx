import { createClient } from "@/lib/supabase";

export default async function TestPage() {
    const supabase = createClient();

    // Test 1: Can we connect?
    let connectionTest = "Unknown";
    try {
        const { data, error } = await supabase.from('members').select('count');
        connectionTest = error ? `Error: ${error.message}` : `Success - ${JSON.stringify(data)}`;
    } catch (e) {
        connectionTest = `Exception: ${e}`;
    }

    // Test 2: Can we fetch members?
    let membersTest = "Unknown";
    try {
        const { data, error } = await supabase.from('members').select('*');
        membersTest = error ? `Error: ${error.message}` : `Success - Found ${data?.length || 0} members`;
    } catch (e) {
        membersTest = `Exception: ${e}`;
    }

    // Test 3: Can we fetch specific member?
    let specificMemberTest = "Unknown";
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('member_id', '604e4f7f-2b40-4ce3-a939-2052d6015894')
            .single();
        specificMemberTest = error ? `Error: ${error.message}` : `Success - ${data?.name || 'No name'}`;
    } catch (e) {
        specificMemberTest = `Exception: ${e}`;
    }

    // Test 4: Environment variables
    const envTest = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Database Connection Test</h1>

            <div style={{ marginTop: '20px' }}>
                <h2>Environment Variables</h2>
                <pre>{JSON.stringify(envTest, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Test 1: Connection</h2>
                <pre>{connectionTest}</pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Test 2: Fetch All Members</h2>
                <pre>{membersTest}</pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Test 3: Fetch Specific Member</h2>
                <pre>{specificMemberTest}</pre>
            </div>
        </div>
    );
}
