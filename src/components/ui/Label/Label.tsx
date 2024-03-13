'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { Label as LabelRoot } from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

export const Label = forwardRef<
  ElementRef<typeof LabelRoot>,
  ComponentPropsWithoutRef<typeof LabelRoot>
>(({ className, ...props }, ref) => (
  <LabelRoot
    ref={ref}
    className={cn(
      `text-sm font-medium leading-none peer-disabled:cursor-not-allowed
peer-disabled:opacity-70`,
      className
    )}
    {...props}
  />
));
Label.displayName = LabelRoot.displayName;
