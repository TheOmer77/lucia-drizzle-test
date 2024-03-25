'use client';

import { useTransition } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { CardContent, CardFooter } from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Link } from '@/components/ui/Link';
import { useToast } from '@/hooks/useToast';
import { signUp } from '@/actions/auth/signUp';
import { signUpFormSchema, type SignUpFormValues } from '@/schemas/auth';

export const SignupForm = () => {
  const { displayToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    startTransition(async () => {
      const res = await signUp(values);
      if (!res.success) {
        displayToast('Failed to sign up', {
          description:
            res.error ||
            'Something went wrong while trying to create your new user.',
          variant: 'destructive',
        });
        return;
      }

      redirect('/verify');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className='flex-col items-start gap-4'>
          <Button
            type='submit'
            variant='primary'
            disabled={isPending}
            className='w-full'
          >
            Sign up
          </Button>
          <div className='text-sm text-muted-foreground'>
            Already have an account? <Link href='/sign-in'>Sign in</Link>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
