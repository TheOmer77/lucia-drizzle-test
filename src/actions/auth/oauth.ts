'use server';

import { cookies } from 'next/headers';
import { generateState } from 'arctic';

import { github } from '@/lib/auth/oauth';
import { env } from '@/config/env';

export const createGithubAuthorizationURL = async (): Promise<
  { success: true; data: string } | { success: false; message: string }
> => {
  try {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ['user:email'],
    });

    cookies().set('github_oauth_state', state, {
      path: '/',
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });

    return { success: true, data: url.toString() };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong while trying to sign you in.',
    };
  }
};
