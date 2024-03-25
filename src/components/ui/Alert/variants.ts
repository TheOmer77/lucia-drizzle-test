import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  `relative flex w-full flex-row items-start gap-2 rounded-lg px-4 py-3
text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-foreground dark:bg-neutral-900',
        destructive: `text-destructive bg-destructive-100
dark:bg-destructive-900 [&>svg]:text-destructive`,
      },
    },
    defaultVariants: { variant: 'default' },
  }
);
