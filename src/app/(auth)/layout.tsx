import type { PropsWithChildren } from 'react';

import { SunTornado } from '@/components/layout/backgrounds/SunTornado';

const AuthLayout = ({ children }: PropsWithChildren) => (
  <div className='min-h-dvh w-full lg:grid lg:grid-cols-2'>
    <div className='grid place-items-center py-4 md:py-12'>
      <div className='grid w-full max-w-sm'>{children}</div>
    </div>
    <div className='hidden overflow-hidden lg:block'>
      <SunTornado animated className='h-full' />
    </div>
  </div>
);

export default AuthLayout;
