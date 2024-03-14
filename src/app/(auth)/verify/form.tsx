'use client';

import { useTransition } from 'react';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { Button } from '@/components/ui/Button';
import { CardContent, CardFooter } from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form';
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from '@/components/ui/OTPInput';
import { useToast } from '@/hooks/useToast';
import { verifyFormSchema, type VerifyFormValues } from '@/schemas/auth';
import { verifyUser } from '@/actions/auth';

export const VerifyForm = () => {
  const { displayToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: { code: '' },
  });

  const handleSubmit = async (values: VerifyFormValues) => {
    startTransition(async () => {
      const res = await verifyUser(values.code);
      if (!res.success) {
        displayToast('Failed to verify code', {
          description:
            res.error ||
            'Something went wrong while trying to verify the code.',
          variant: 'destructive',
        });
        form.reset();
        return;
      }

      displayToast(`Welcome!`, {
        description: `You've successfully signed up.`,
      });
      redirect('/');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className='space-y-4'>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OTPInput
                    {...field}
                    maxLength={8}
                    pattern={REGEXP_ONLY_DIGITS}
                    render={({ slots }) => (
                      <OTPInputGroup>
                        {slots.map((slot, index) => (
                          <OTPInputSlot key={index} {...slot} />
                        ))}
                      </OTPInputGroup>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='text-sm text-muted-foreground'>
            Didn&apos;t get a code?{' '}
            <Button
              variant='link'
              className='h-auto p-0'
              type='button'
              disabled={isPending}
            >
              Resend
            </Button>
          </div>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button type='submit' disabled={isPending}>
            Verify
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
