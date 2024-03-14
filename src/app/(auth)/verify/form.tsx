'use client';

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
import { verifyFormSchema, type VerifyFormValues } from '@/schemas/auth';

export const VerifyForm = () => {
  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: VerifyFormValues) => {
    // TODO: Verify that code is correct and not expired
    console.error('Not implemented yet.\nEntered code:', values.code);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button variant='link' className='h-auto p-0' type='button'>
              Resend
            </Button>
          </div>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button>Verify</Button>
        </CardFooter>
      </form>
    </Form>
  );
};
