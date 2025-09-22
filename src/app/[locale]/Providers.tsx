'use client';
import StuffContext from '@/contexts/Stuff';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NextIntlClientProvider} from 'next-intl';
import {FC} from 'react';
import {ChildrenProps} from '~/types';
import fr from '../../../messages/fr.json';

const Providers: FC<ChildrenProps> = ({children}) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="fr" messages={fr}>
        {/* <StuffContext> */}
        {children}
        {/* </StuffContext> */}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

export default Providers;
