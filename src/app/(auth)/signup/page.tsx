import { SignupForm } from './form';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

const SignupPage = () => (
  <div className='grid min-h-dvh w-full place-items-center p-4'>
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <SignupForm />
    </Card>
  </div>
);

export default SignupPage;
