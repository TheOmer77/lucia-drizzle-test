import { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { VerifyForm } from './form';

const VerifyPage = () => (
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

export default VerifyPage;
