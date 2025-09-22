// import Table from '@/components/layout/tables/stock';
// import {useTranslations} from 'next-intl';
// import {FC} from 'react';
// import {getProductInformationsT} from '../../page';

// const LowstockPage: FC = ({}) => {
//   const t = useTranslations('stockPage');
//   const pT = useTranslations('productInformations');
//   //   @ts-expect-error this is fine
//   const productInfo = getProductInformationsT(pT);

//   return (
//     <>
//       {/* display the number of low stock products */}
//       <div className="mb-3 w-fit rounded-md bg-offWhite/20 p-4 shadow-md backdrop-blur-2xl">
//         <span className="text-xl font-bold">{8}</span>
//       </div>
//       <Table
//         //   @ts-expect-error this is fine
//         productInfo={productInfo}
//         t={{
//           tableHeaders: {
//             ProductName: t('tableHeaders.ProductName'),
//             Ref: t('tableHeaders.Ref'),
//             Category: t('tableHeaders.Category'),
//             // BuyPrice: t('tableHeaders.BuyPrice'),
//             SellPrice: t('tableHeaders.SellPrice'),
//             DateAdded: t('tableHeaders.DateAdded'),
//             Qt: t('tableHeaders.Qt'),
//           },
//           moreOptions: {
//             edit: t('moreOptions.edit'),
//             seeDetails: t('moreOptions.seeDetails'),
//             delete: t('moreOptions.delete'),
//           },
//         }}
//       />
//     </>
//   );
// };

// export default LowstockPage;
'use client';
import {useTranslations} from 'next-intl';
import React, {FC, useEffect, useState} from 'react';
import {getTranslations} from 'next-intl/server';
import getArticles from '@/lib/simon/requests/getArticles';
import {ArticleType} from '~/types';
import {getCurrentStuff} from '@/app/lib/current';

function CountdownToDeadline() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Retrieve or create a deadline 18 hours from now
    const storageKey = 'deadline';
    let storedDeadline = localStorage.getItem(storageKey);
    if (!storedDeadline) {
      const newDeadline = new Date();
      newDeadline.setHours(newDeadline.getHours() + 18);
      storedDeadline = newDeadline.toISOString();
      localStorage.setItem(storageKey, storedDeadline);
    }
    const deadline = new Date(storedDeadline);

    // Update the countdown every second
    const timer = setInterval(() => {
      const now = new Date();
      const distance = deadline.getTime() - now.getTime();

      if (distance <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black/60 text-center h-min">Les données seront collectées et disponibles sous 30 jours. </div>
  );
}

const OfflinePage: FC = () => {
  // const currentStuff = await getCurrentStuff();
  // const t = await getTranslations('POSPage');
  // const data = await getArticles(currentStuff?.store?.id as string);

  // const {tires, glazes, bodies, parts} = data;
  // const allArticles: ArticleType[] = [...tires, ...glazes, ...bodies, ...parts];

  return (
    <>
      <div className="flex h-[500px] justify-center items-center w-full gap-2">
        <div>{/* Other elements here */}</div>

        <CountdownToDeadline />

        {/* <Table addToCart={t('addToCart')} data={allArticles} />
        <Invoice months={getMonths()} /> */}
      </div>
    </>
  );
};

export default OfflinePage;
