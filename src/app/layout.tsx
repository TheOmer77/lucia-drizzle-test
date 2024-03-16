import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import { Toaster } from '@/components/ui/Toast';
import '@/styles/index.css';

const font = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Lucia + Drizzle test',
  description: 'Test app using Lucia & Drizzle for authentication.',
};

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang='en' className={font.variable}>
    <body>
      {children}
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
