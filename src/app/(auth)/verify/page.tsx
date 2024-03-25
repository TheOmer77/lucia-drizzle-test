import { redirect } from 'next/navigation';

import { VerifyForm } from './form';
import { AuthPageTitle } from '../AuthPageTitle';
import { AuthPageDescription } from '../AuthPageDescription';
import { CardHeader } from '@/components/ui/Card';
import { validateRequest } from '@/lib/auth';

const VerifyPage = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  if (user.emailVerified) redirect('/');

  return (
    <>
      <CardHeader>
        <AuthPageTitle>Verify your account</AuthPageTitle>
        <AuthPageDescription>
          We&apos;ve sent a verification code to your email - please enter it
          below.
        </AuthPageDescription>
      </CardHeader>
      <VerifyForm />
    </>
  );
};

export default VerifyPage;
