'use client';

import { Button } from '@/components/ui/Button';
import { GithubLogo, GoogleLogo } from '@/components/layout/logos';

export const SocialButtons = () => {
  const handleClick = (provider: 'google' | 'github') => {
    switch (provider) {
      case 'google':
        // TODO: Google login
        return console.log('TODO Google login');
      case 'github':
        // TODO: Github login
        return console.log('TODO Github login');
    }
  };

  return (
    <div>
      <div
        className='grid grid-cols-2 gap-2 [&>button>svg]:size-4
[&>button>svg]:shrink-0 [&>button]:gap-2'
      >
        <Button type='button' onClick={() => handleClick('google')}>
          <GoogleLogo />
          <span>Google</span>
        </Button>
        <Button type='button' onClick={() => handleClick('github')}>
          <GithubLogo />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};
