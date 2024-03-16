'use client';

import { useEffect, useTransition } from 'react';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdown } from 'usehooks-ts';
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
import { resendVerificationCode, verifyUser } from '@/actions/auth';

export const VerifyForm = () => {
  const { displayToast } = useToast();
  const [resendCount, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({ countStart: 60 });
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: { code: '' },
  });

  const handleSubmit = (values: VerifyFormValues) => {
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

      stopCountdown();
      displayToast(`Welcome!`, {
        description: `You've successfully verified your account.`,
      });
      redirect('/');
    });
  };

  const handleResend = async () => {
    startTransition(async () => {
      const res = await resendVerificationCode();
      if (!res.success) {
        displayToast('Failed to resend code', {
          description:
            res.error ||
            'Something went wrong while trying to resend the code.',
          variant: 'destructive',
        });
        form.reset();
        return;
      }

      resetCountdown();
      startCountdown();
      form.clearErrors();
      displayToast('New verification code sent.');
    });
  };

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

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
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    className='justify-center'
                    render={({ slots }) => (
                      <>
                        {slots.map((slot, index) => (
                          <OTPInputSlot key={index} {...slot} />
                        ))}
                      </>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className='flex-col items-start gap-4'>
          <Button type='submit' disabled={isPending} className='w-full'>
            Verify
          </Button>
          <div className='text-sm text-muted-foreground'>
            Didn&apos;t get a code?{' '}
            {resendCount > 0 ? (
              `Try resending it in ${resendCount} ${resendCount === 1 ? 'second' : 'seconds'}.`
            ) : (
              <Button
                variant='link'
                className='h-auto p-0'
                type='button'
                disabled={isPending}
                onClick={handleResend}
              >
                Resend
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
