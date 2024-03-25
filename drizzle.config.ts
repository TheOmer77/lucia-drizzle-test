import { defineConfig } from 'drizzle-kit';

import { env } from '@/config/env';

const config = defineConfig({
  schema: './src/db/schema',
  driver: 'pg',
  dbCredentials: { connectionString: env.DB_URL },
});

export default config;
