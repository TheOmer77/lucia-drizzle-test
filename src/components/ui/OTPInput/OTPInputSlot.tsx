import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { type SlotProps } from 'input-otp';

import { cn } from '@/lib/utils';

export const OTPInputSlot = forwardRef<
  ElementRef<'div'>,
  SlotProps & ComponentPropsWithoutRef<'div'>
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `relative flex aspect-square h-12 items-center justify-center rounded-lg
border border-input text-lg`,
      isActive && 'z-10 ring-2 ring-ring ring-offset-background',
      className
    )}
    {...props}
  >
    {char}
    {hasFakeCaret && (
      <div
        className='pointer-events-none absolute inset-0 flex items-center
justify-center'
      >
        <div
          className='h-5 w-px animate-caret-blink bg-foreground
duration-1000'
        />
      </div>
    )}
  </div>
));
OTPInputSlot.displayName = 'OTPInputSlot';
