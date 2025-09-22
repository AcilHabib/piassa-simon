import Table from '@/components/layout/tables/pos';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
import InfoHeader from './components/InfoHeader';
import Invoice from './components/Invoice';
import {db} from '@/lib/db';
import {getTranslations} from 'next-intl/server';
import getArticles from '@/lib/simon/requests/getArticles';
import {ArticleType} from '~/types';
import {getCurrentStuff} from '@/app/lib/current';

const page: FC = async ({}) => {
  const currentStuff = await getCurrentStuff();
  const m = await getTranslations('months');
  const getMonths = () =>
    Object.fromEntries(
      Array(12)
        .fill(0)
        .map((_, i) => [i + 1, m(`${i + 1}`)])
    );

  const t = await getTranslations('POSPage');
  const data = await getArticles(currentStuff?.store?.id as string);

  const {tires, glazes, bodies, parts} = data;
  const allArticles: ArticleType[] = [...tires, ...glazes, ...bodies, ...parts];
  return (
    <>
      <InfoHeader />
      <div className="flex h-full w-full gap-2">
        <Table addToCartText={t('addToCart')} data={allArticles} />
        <Invoice months={getMonths()} />
      </div>
    </>
  );
};

export default page;
