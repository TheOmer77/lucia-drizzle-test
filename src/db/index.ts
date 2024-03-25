import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';
import { env } from '@/config/env';

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, { schema });
