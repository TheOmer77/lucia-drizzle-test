import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { validateRequest } from '@/lib/auth';

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const { user } = await validateRequest();
  if (user) redirect('/');

  return (
    <div className='grid min-h-dvh w-full place-items-center p-4'>
      <Card className='w-full max-w-md'>{children}</Card>
    </div>
  );
};

export default AuthLayout;
