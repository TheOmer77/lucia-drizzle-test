import { GitHub } from 'arctic';

import { env } from '@/config/env';

export const github = new GitHub(
  env.AUTH_GITHUB_CLIENT_ID,
  env.AUTH_GITHUB_CLIENT_SECRET
);
