
const { Client } = require('pg');

async function testDirect() {
    const client = new Client({
        connectionString: "postgresql://postgres:Asamasa.123@db.tedgsbumeyofrqtleevi.supabase.co:5432/postgres"
    });

    try {
        await client.connect();
        console.log("Direct connection SUCCESSful");
    } catch (err) {
        console.error("Direct connection FAILED:", err.message);
    } finally {
        await client.end();
    }
}

testDirect();
