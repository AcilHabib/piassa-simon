import {Toaster} from '@/components/ui/sonner';
import type {Metadata} from 'next';
import './globals.css';
import Providers from './Providers';

export const metadata: Metadata = {
  title: 'SIMON - Piassa',
  description: 'Your personal Sales and Inventory Management System Online',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {locale: string};
}

export default function RootLayout({children, params: {locale}}: Readonly<RootLayoutProps>) {
  return (
    <html lang={locale}>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
