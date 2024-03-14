import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoginForm } from './form';

const LoginPage = () => (
  <>
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your login details to continue.</CardDescription>
    </CardHeader>
    <LoginForm />
  </>
);

export default LoginPage;
