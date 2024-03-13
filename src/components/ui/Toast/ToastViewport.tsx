'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { Viewport } from '@radix-ui/react-toast';

import { cn } from '@/lib/utils';

export const ToastViewport = forwardRef<
  ElementRef<typeof Viewport>,
  ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, ref) => (
  <Viewport
    ref={ref}
    className={cn(
      `fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4
sm:right-0 sm:flex-col md:max-w-[420px]`,
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = Viewport.displayName;
