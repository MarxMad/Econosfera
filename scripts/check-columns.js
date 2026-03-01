
const { Client } = require('pg');

async function checkColumns() {
    const client = new Client({
        connectionString: "postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    });

    try {
        await client.connect();
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `);
        console.log("Columns in User table:");
        res.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkColumns();
