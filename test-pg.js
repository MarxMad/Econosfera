const { Client } = require('pg');

async function test(url) {
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        console.log('SUCCESS:', url);
        await client.end();
    } catch (err) {
        console.log('FAILED:', url, '| ERROR:', err.message);
    }
}

async function main() {
    await test('postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
    await test('postgresql://postgres:Asamasa.123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
    await test('postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-0-us-east-1.pooler.supabase.com:5432/postgres');
}
main();
