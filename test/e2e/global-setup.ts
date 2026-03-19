import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Wait } from 'testcontainers';
import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('[e2e Tests] Global setup');

  const postgresContainer = new PostgreSqlContainer('postgres:17')
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const postgresUrl = (await postgresContainer).getConnectionUri();

  process.env.DATABASE_URL = postgresUrl;

  console.log('[e2e Tests] Setting DATABASE_URL to:', postgresUrl);
  console.log(
    '[e2e Tests] PostgresSQL is running on %s',
    process.env.DATABASE_URL,
  );

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: postgresUrl },
    stdio: 'inherit',
  });

  console.log('[e2e Tests] Prisma migrations applied');
}
