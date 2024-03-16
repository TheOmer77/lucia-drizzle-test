import { SignupForm } from './form';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const SignupPage = () => (
  <>
    <CardHeader>
      <CardTitle>Let&apos;s create your account</CardTitle>
      <CardDescription>
        Fill in your details below to get started.
      </CardDescription>
    </CardHeader>
    <SignupForm />
  </>
);

export default SignupPage;
