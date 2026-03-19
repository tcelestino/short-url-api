import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Wait } from 'testcontainers';
import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('[Integration Tests] Global setup');

  const container = await new PostgreSqlContainer('postgres:17')
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const postgresUrl = container.getConnectionUri();

  process.env.DATABASE_URL = postgresUrl;

  console.log('[Integration Tests] PostgreSQL running on %s', postgresUrl);

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: postgresUrl },
    stdio: 'inherit',
  });

  console.log('[Integration Tests] Prisma migrations applied');
}
