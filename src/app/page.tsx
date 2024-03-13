import { redirect } from 'next/navigation';

import { validateRequest } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

const Home = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/login');

  return (
    <div className='grid min-h-dvh w-full place-items-center p-4'>
      <div>
        <h1
          className='mb-8 w-full text-center text-8xl font-extrabold
tracking-tight'
        >
          Hello.
        </h1>
        <Card className='grid grid-cols-[auto,1fr] gap-4 p-4'>
          <h2 className='col-span-full font-semibold'>Your user details:</h2>
          {Object.entries(user).map(([key, value]) => (
            <>
              <span className='text-sm font-medium'>{key}:</span>
              <span className='text-muted-foreground text-sm'>{value}</span>
            </>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Home;
