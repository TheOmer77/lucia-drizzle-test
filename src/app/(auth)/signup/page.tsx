import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

const SignupPage = () => (
  <div className='grid min-h-dvh w-full place-items-center'>
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <form>
        <CardContent>TODO: Signup form</CardContent>
        <CardFooter>
          <Button type='submit'>Sign up</Button>
        </CardFooter>
      </form>
    </Card>
  </div>
);

export default SignupPage;
