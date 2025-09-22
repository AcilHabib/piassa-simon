import {useTranslations} from 'next-intl';
import {FC} from 'react';
import {db} from '@/lib/db';
import {getTranslations} from 'next-intl/server';
import getArticles from '@/lib/simon/requests/getArticles';
import {ArticleType} from '~/types';
import {getCurrentStuff} from '@/app/lib/current';
import InfoHeader from '../components/InfoHeader';
import Invoice from '../components/Invoice';
import {getOrders} from '@/lib/simon/requests/getOrders';
import Table from '@/components/layout/tables/orders';

const OrdersPage: FC = async ({}) => {
  const currentStuff = await getCurrentStuff();
  const m = await getTranslations('months');
  const getMonths = () =>
    Object.fromEntries(
      Array(12)
        .fill(0)
        .map((_, i) => [i + 1, m(`${i + 1}`)])
    );

  const t = await getTranslations('POSPage');
  const data = await getOrders();

  // const allArticles: ArticleType[] = [...data?.tires, ...data?.glazes, ...data?.bodies, ...data?.parts];
  const allOrders = data;
  console.log('allOrders', allOrders);
  return (
    <>
      <InfoHeader />
      <div className="flex h-full w-full gap-2">
        <Table addToCart={t('addToCart')} data={allOrders} />

        <Invoice months={getMonths()} />
      </div>
    </>
  );
};

export default OrdersPage;
