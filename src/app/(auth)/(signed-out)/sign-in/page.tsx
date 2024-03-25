import { LoginForm } from './form';
import { AuthPageDescription } from '../../AuthPageDescription';
import { AuthPageTitle } from '../../AuthPageTitle';
import { CardHeader } from '@/components/ui/Card';

const LoginPage = () => (
  <>
    <CardHeader>
      <AuthPageTitle>Welcome back!</AuthPageTitle>
      <AuthPageDescription className='text-base'>
        Enter your account details to continue.
      </AuthPageDescription>
    </CardHeader>
    <LoginForm />
  </>
);

export default LoginPage;
