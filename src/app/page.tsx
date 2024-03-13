import { redirect } from 'next/navigation';

import { validateRequest } from '@/lib/auth';

const Home = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/login');

  return <div>Hello world.</div>;
};

export default Home;
