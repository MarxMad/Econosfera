const { Client } = require('pg');

async function createGamificationTables() {
    const url = 'postgresql://postgres.tedgsbumeyofrqtleevi:Asamasa.123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected to DB via Pooler. Creating Quiz tables...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS "Quiz" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "difficulty" TEXT NOT NULL,
          "module" TEXT NOT NULL,
          "xpReward" INTEGER NOT NULL DEFAULT 10,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "Question" (
          "id" TEXT NOT NULL,
          "quizId" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "explanation" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "Option" (
          "id" TEXT NOT NULL,
          "questionId" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "isCorrect" BOOLEAN NOT NULL DEFAULT false,
          CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "QuizAttempt" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "quizId" TEXT NOT NULL,
          "score" INTEGER NOT NULL DEFAULT 0,
          "completed" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "QuizAnswer" (
          "id" TEXT NOT NULL,
          "attemptId" TEXT NOT NULL,
          "questionId" TEXT NOT NULL,
          "optionId" TEXT NOT NULL,
          "isCorrect" BOOLEAN NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "Badge" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "imageUrl" TEXT,
          "criteria" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Badge_name_key" ON "Badge"("name");
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS "UserBadge" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "badgeId" TEXT NOT NULL,
          "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");
    `);

        // Add Foreign Keys if they don't exist
        const fgks = [
            'ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
            'ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;'
        ];

        for (const fg of fgks) {
            try { await client.query(fg); } catch (e) {
                if (!e.message.includes('already exists')) { console.warn('Constraint warning:', e.message); }
            }
        }

        console.log('Finished gamification schema setup!');
        await client.end();
    } catch (err) {
        console.error('Error executing query:', err.message);
    }
}

createGamificationTables();
