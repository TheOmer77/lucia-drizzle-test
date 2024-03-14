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
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        `relative flex h-10 w-10 items-center justify-center border-y border-r
border-input text-sm transition-all first:rounded-l-md first:border-l
last:rounded-r-md`,
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
            className='animate-caret-blink h-4 w-px bg-foreground
duration-1000'
          />
        </div>
      )}
    </div>
  );
});
OTPInputSlot.displayName = 'OTPInputSlot';