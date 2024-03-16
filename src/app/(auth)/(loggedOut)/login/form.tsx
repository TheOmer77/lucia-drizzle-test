'use client';

import { useTransition } from 'react';
import Link from 'next/link';
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
import { useToast } from '@/hooks/useToast';
import { loginUser } from '@/actions/auth';
import { loginFormSchema, type LoginFormValues } from '@/schemas/auth';

export const LoginForm = () => {
  const { displayToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    startTransition(async () => {
      const res = await loginUser(values);
      if (!res.success) {
        displayToast('Failed to sign in', {
          description:
            res.error || 'Something went wrong while trying to sign you in.',
          variant: 'destructive',
        });
        return;
      }

      if (!res.data.emailVerified) redirect('/verify');
      displayToast(`Welcome back!`);
      redirect('/');
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
          <Button type='submit' disabled={isPending} className='w-full'>
            Sign in
          </Button>
          <div className='text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Button asChild variant='link' className='h-auto p-0'>
              <Link href='/signup'>Sign up</Link>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
