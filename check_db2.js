const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function run() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) { console.log('NO URL'); return; }
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("CONNECTED");
        const res = await client.query(`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('public', 'dev')`);
        console.log(JSON.stringify(res.rows));
    } catch (err) {
        console.log("DB ERROR MESSAGE:", err.message);
    } finally {
        await client.end();
    }
}

run();
