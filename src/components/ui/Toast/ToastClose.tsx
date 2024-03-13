'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { Close } from '@radix-ui/react-toast';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export const ToastClose = forwardRef<
  ElementRef<typeof Close>,
  ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, ref) => (
  <Close
    ref={ref}
    className={cn(
      `text-foreground/50 hover:text-foreground absolute right-2 top-2
rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none
focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300
group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400
group-[.destructive]:focus:ring-offset-red-600`,
      className
    )}
    toast-close=''
    {...props}
  >
    <XIcon className='h-4 w-4' />
  </Close>
));
ToastClose.displayName = Close.displayName;
