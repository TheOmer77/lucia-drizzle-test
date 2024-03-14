import { SignupForm } from './form';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const SignupPage = () => (
  <>
    <CardHeader>
      <CardTitle>Sign up</CardTitle>
      <CardDescription>
        Enter your email and password below to create your account.
      </CardDescription>
    </CardHeader>
    <SignupForm />
  </>
);

export default SignupPage;
