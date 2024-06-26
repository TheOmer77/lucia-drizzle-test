import { Fragment } from 'react';
import { redirect } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/actions/auth/signOut';
import { validateRequest } from '@/lib/auth/lucia';

const Home = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  if (!user.emailVerified) redirect('/verify');

  return (
    <div className='grid min-h-dvh w-full place-items-center p-4'>
      <div>
        <h1
          className='mb-8 w-full text-center text-8xl font-extrabold
tracking-tighter'
        >
          Hello.
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Your user details</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-[auto,1fr] gap-4'>
            {Object.entries(user).map(([key, value]) => (
              <Fragment key={key}>
                <span className='text-sm font-medium'>{key}:</span>
                <span className='text-sm text-muted-foreground'>{`${value}`}</span>
              </Fragment>
            ))}
          </CardContent>
          <CardFooter>
            <form action={signOut} className='w-full [&>*]:w-full'>
              <Button type='submit' variant='primary'>
                Sign out
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
