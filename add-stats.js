const { Client } = require('pg');

async function addUserStats() {
    const url = 'postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected to DB...');

        await client.query('ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "totalScore" INTEGER NOT NULL DEFAULT 0;');
        console.log('Column "totalScore" added.');

        await client.query('ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;');
        console.log('Column "currentStreak" added.');

        await client.end();
    } catch (err) {
        console.error('Error executing query:', err.message);
    }
}

addUserStats();
