'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { GithubLogo, GoogleLogo } from '@/components/layout/logos';
import { createGithubAuthorizationURL } from '@/actions/auth/oauth';

export type SocialButtonsProps = {
  disabled?: boolean;
  onError?: (error: string) => void;
  onPendingChange?: (isPending: boolean) => void;
};

export const SocialButtons = ({
  disabled,
  onError,
  onPendingChange,
}: SocialButtonsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleGithubClick = () =>
    startTransition(async () => {
      onPendingChange?.(true);
      const res = await createGithubAuthorizationURL();
      if (!res.success) {
        onError?.(res.message);
        return onPendingChange?.(false);
      }
      router.push(res.data);
      onPendingChange?.(false);
    });

  return (
    <div>
      <div
        className='grid grid-cols-2 gap-2 [&>button>svg]:size-4
[&>button>svg]:shrink-0 [&>button]:gap-2'
      >
        {/* Google sign in not implemented yet */}
        <Button type='button' disabled>
          <GoogleLogo />
          <span>Google</span>
        </Button>
        <Button
          type='button'
          onClick={handleGithubClick}
          disabled={disabled || isPending}
        >
          <GithubLogo />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};
