import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';

import { cn } from '@/lib/utils';

export const AuthPageTitle = forwardRef<
  ElementRef<'h1'>,
  ComponentPropsWithoutRef<'h1'>
>(({ className, children, ...props }, ref) => (
  <h1
    {...props}
    ref={ref}
    className={cn('text-3xl font-bold tracking-tight', className)}
  >
    {children}
  </h1>
));
AuthPageTitle.displayName = 'AuthPageTitle';
