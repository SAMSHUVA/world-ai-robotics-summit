const { Client } = require('pg');
const fs = require('fs');
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
            ORDER BY table_schema, table_name
        `);

        let output = "=== Database Table Audit ===\n";
        const schemas = {};
        res.rows.forEach(r => {
            if (!schemas[r.table_schema]) schemas[r.table_schema] = [];
            schemas[r.table_schema].push(r.table_name);
        });

        for (const [schema, tables] of Object.entries(schemas)) {
            output += `\nSchema: ${schema}\n`;
            tables.forEach(t => output += ` - ${t}\n`);
        }

        console.log(output);
        fs.writeFileSync('db_audit_final.txt', output);
        console.log("\nResults also saved to db_audit_final.txt");
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await client.end();
    }
}

run();
