import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/index.css';
import { Toaster } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lucia + Drizzle test',
  description: 'Test app using Lucia & Drizzle for authentication.',
};

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang='en'>
    <body className={inter.className}>
      {children}
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
