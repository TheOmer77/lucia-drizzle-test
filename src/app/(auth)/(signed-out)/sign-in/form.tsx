'use client';

import { useState, useTransition } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { OctagonAlertIcon } from 'lucide-react';

import { Alert } from '@/components/ui/Alert';
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
import { signIn } from '@/actions/auth/signIn';
import { signInFormSchema, type SignInFormValues } from '@/schemas/auth';

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInFormValues) => {
    startTransition(async () => {
      setError(null);
      const res = await signIn(values);
      if (!res.success) {
        setError(
          res.error || 'Something went wrong while trying to sign you in.'
        );
        return;
      }

      if (!res.data.emailVerified) redirect('/verify');
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
                <div className='flex items-center'>
                  <FormLabel>Password</FormLabel>
                  <Link href='/forgot-password' className='ms-auto text-sm'>
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <Alert variant='destructive'>
              <OctagonAlertIcon />
              {error}
            </Alert>
          )}
        </CardContent>
        <CardFooter className='flex-col items-start gap-4'>
          <Button
            type='submit'
            variant='primary'
            disabled={isPending}
            className='w-full'
          >
            Sign in
          </Button>
          <div className='text-sm text-muted-foreground'>
            Don&apos;t have an account? <Link href='/sign-up'>Sign up</Link>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
