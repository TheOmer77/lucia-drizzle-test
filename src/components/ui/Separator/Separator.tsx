'use client';

import { forwardRef, type ElementRef } from 'react';
import {
  Separator as SeparatorRoot,
  type SeparatorProps,
} from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

export const Separator = forwardRef<
  ElementRef<typeof SeparatorRoot>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorRoot
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorRoot.displayName;
