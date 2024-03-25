import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';

import { cn } from '@/lib/utils';

export const AlertText = forwardRef<
  ElementRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn('flex flex-col items-start', className)}
  >
    {children}
  </div>
));
AlertText.displayName = 'AlertText';
