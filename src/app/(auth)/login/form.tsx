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
        displayToast('Something went wrong', {
          description: res.error || 'Failed to create a new user.',
          variant: 'destructive',
        });
        return;
      }

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
        <CardFooter className='justify-end'>
          <Button type='submit' disabled={isPending}>
            Login
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
