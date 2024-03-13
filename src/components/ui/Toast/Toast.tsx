'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { Provider, Root } from '@radix-ui/react-toast';
import { type VariantProps } from 'class-variance-authority';

import { toastVariants } from './variants';
import { cn } from '@/lib/utils';

export const ToastProvider = Provider;

export const Toast = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = Root.displayName;
