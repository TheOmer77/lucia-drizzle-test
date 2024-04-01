import type { SeparatorProps } from '@radix-ui/react-separator';

import { Separator } from './Separator';

export const SeparatorWithText = ({ children, ...props }: SeparatorProps) => (
  <div className='grid grid-cols-[1fr,auto,1fr] items-center'>
    <Separator {...props} />
    <span className='p-2 text-xs text-muted-foreground'>{children}</span>
    <Separator {...props} />
  </div>
);
