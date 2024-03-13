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
import { registerUser } from '@/actions/auth';
import { signupFormSchema, type SignupFormValues } from '@/schemas/auth';

export const SignupForm = () => {
  const { displayToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: SignupFormValues) => {
    startTransition(async () => {
      const res = await registerUser(values);
      if (!res.success) {
        displayToast('Something went wrong', {
          description:
            res.error instanceof Error
              ? res.error.message
              : 'Failed to create a new user.',
          variant: 'destructive',
        });
        return;
      }

      displayToast(`Welcome, ${res.data.username}!`, {
        description: `You've successfully signed up.`,
      });
      redirect('/');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
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
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
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
            Sign up
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
