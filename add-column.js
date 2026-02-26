const { Client } = require('pg');

async function addColumns() {
    const url = 'postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected to DB via Pooler.');

        await client.query('ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "institution" TEXT;');
        console.log('Column "institution" added to User table successfully!');

        await client.query('ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 10;');
        console.log('Column "credits" added to User table successfully!');

        await client.query('ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS "password" TEXT;');
        console.log('Column "password" added to User table successfully! (Just in case)');

        await client.end();
    } catch (err) {
        console.error('Error executing query:', err.message);
    }
}

addColumns();
