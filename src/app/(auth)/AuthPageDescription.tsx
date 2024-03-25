import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';

import { cn } from '@/lib/utils';

export const AuthPageDescription = forwardRef<
  ElementRef<'p'>,
  ComponentPropsWithoutRef<'p'>
>(({ className, children, ...props }, ref) => (
  <p
    {...props}
    ref={ref}
    className={cn('text-base text-muted-foreground', className)}
  >
    {children}
  </p>
));
AuthPageDescription.displayName = 'AuthPageDescription';
