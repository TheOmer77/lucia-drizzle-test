import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
  schema: './src/db/schema',
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DB_URL! },
  verbose: true,
  strict: true,
});

export default config;
