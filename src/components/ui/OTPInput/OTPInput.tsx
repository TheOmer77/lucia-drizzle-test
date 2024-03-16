'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { OTPInput as OTPInputRoot } from 'input-otp';

import { cn } from '@/lib/utils';

export const OTPInput = forwardRef<
  ElementRef<typeof OTPInputRoot>,
  ComponentPropsWithoutRef<typeof OTPInputRoot>
>(({ className, ...props }, ref) => (
  <OTPInputRoot
    ref={ref}
    containerClassName={cn('flex items-center gap-1', className)}
    {...props}
  />
));
OTPInput.displayName = 'OTPInput';
