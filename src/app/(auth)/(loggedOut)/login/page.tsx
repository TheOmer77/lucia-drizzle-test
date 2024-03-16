import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoginForm } from './form';

const LoginPage = () => (
  <>
    <CardHeader>
      <CardTitle>Welcome back!</CardTitle>
      <CardDescription>Enter your account details to continue.</CardDescription>
    </CardHeader>
    <LoginForm />
  </>
);

export default LoginPage;
