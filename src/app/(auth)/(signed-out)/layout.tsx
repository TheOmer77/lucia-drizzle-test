import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { validateRequest } from '@/lib/auth';

const AuthLoggedOutLayout = async ({ children }: PropsWithChildren) => {
  const { user } = await validateRequest();
  if (user) {
    if (!user.emailVerified) redirect('/verify');
    redirect('/');
  }

  return children;
};

export default AuthLoggedOutLayout;
