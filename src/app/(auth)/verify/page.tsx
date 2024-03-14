import { redirect } from 'next/navigation';

import { VerifyForm } from './form';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { validateRequest } from '@/lib/auth';

const VerifyPage = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/');
  if (user.emailVerified) redirect('/');

  return (
    <>
      <CardHeader>
        <CardTitle>Verify your account</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification code to your email - please enter it
          below.
        </CardDescription>
      </CardHeader>
      <VerifyForm />
    </>
  );
};

export default VerifyPage;
