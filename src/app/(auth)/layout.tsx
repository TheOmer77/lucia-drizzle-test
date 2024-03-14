import type { PropsWithChildren } from 'react';

import { Card } from '@/components/ui/Card';

const AuthLayout = ({ children }: PropsWithChildren) => (
  <div className='grid min-h-dvh w-full place-items-center p-4'>
    <Card className='w-full max-w-md'>{children}</Card>
  </div>
);

export default AuthLayout;
