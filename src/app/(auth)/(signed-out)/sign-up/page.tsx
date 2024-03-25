import { SignupForm } from './form';
import { AuthPageDescription } from '../../AuthPageDescription';
import { AuthPageTitle } from '../../AuthPageTitle';
import { CardHeader } from '@/components/ui/Card';

const SignupPage = () => (
  <>
    <CardHeader>
      <AuthPageTitle>Let&apos;s get started</AuthPageTitle>
      <AuthPageDescription>
        Fill in your details below to create your account.
      </AuthPageDescription>
    </CardHeader>
    <SignupForm />
  </>
);

export default SignupPage;
