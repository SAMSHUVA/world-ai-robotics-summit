const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('public', 'dev')
    `);
        console.log("Tables found:");
        res.rows.forEach(r => console.log(`${r.table_schema}.${r.table_name}`));
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await client.end();
    }
}

run();
