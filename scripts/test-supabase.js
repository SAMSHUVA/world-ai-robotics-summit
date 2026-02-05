
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple env parser
function parseEnv(content) {
    const res = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            res[match[1]] = value;
        }
    });
    return res;
}

const envPath = path.resolve(__dirname, '../.env');
const envConfig = parseEnv(fs.readFileSync(envPath, 'utf8'));

const url = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const key = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', url);
console.log('Key (start):', key ? key.substring(0, 10) + '...' : 'MISSING');

if (!url || !key) {
    console.error('Missing URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    try {
        // Try a simple health check or table select
        // 'AdminUser' might be empty or restricted, but 'count' should work if connected
        const { data, error } = await supabase.from('AdminUser').select('*').limit(1);

        if (error) {
            console.error('Connection Failed:', error.message);
            console.error('Error Details:', JSON.stringify(error, null, 2));
        } else {
            console.log('Connection Successful! Database is accessible.');
        }

        // Also test Auth
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('Auth Service Error:', authError.message);
        } else {
            console.log('Auth Service Accessible.');
        }

    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

test();
