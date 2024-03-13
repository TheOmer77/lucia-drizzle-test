import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

import { FormItemContext } from './FormItemContext';
import { cn } from '@/lib/utils';

export const FormItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';
