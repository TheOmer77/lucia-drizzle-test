import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_URL: z.string().url(),
    MAIL_HOST: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_PORT: z
      .string()
      .transform(s => Number(s))
      .pipe(z.number()),
    MAIL_SECURE: z
      .string()
      .refine(s => s.toLowerCase() === 'true' || s.toLowerCase() === 'false')
      .transform(s => s === 'true'),
    MAIL_SENDER: z.string(),
    MAIL_USER: z.string(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  runtimeEnv: {
    DB_URL: process.env.DB_URL,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_SECURE: process.env.MAIL_SECURE,
    MAIL_SENDER: process.env.MAIL_SENDER,
    MAIL_USER: process.env.MAIL_USER,
    NODE_ENV: process.env.NODE_ENV,
  },
});
