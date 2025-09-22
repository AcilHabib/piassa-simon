import {ScrollArea} from '@/components/ui/scroll-area';
import {useStockContext} from '@/contexts/Stock';
import {excludedKeys} from '@/lib/simon/exports';
import {Glaze, Part, Tire, Body} from '@prisma/client';
import {useLocale, useTranslations} from 'next-intl';
import Image from 'next/image';
import {FC, use} from 'react';

interface DetailsProps {
  data: Body | Part | Glaze | Tire;
}

const Details: FC<DetailsProps> = ({data}) => {
  const t = useTranslations('stockPage.addProduct');
  const locale = useLocale();
  return (
    <div className="flex h-full w-full gap-2 bg-gray-50 ">
      {/* the picture */}
      <div
        className={`flex w-[30%] bg-[url(/defaults/article.webp)] items-center bg-cover bg-center justify-center   p-2`}></div>
      {/* name and price */}
      <div className="flex w-full flex-col gap-6 p-2 font-bold text-black" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex w-full items-center pt-4 px-8  text-3xl">
          <span className="grow text-center">{data?.designation}</span>
          <span className="text-red-500">{data?.sellingPrice} DA</span>
        </div>
        <ScrollArea dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <div className="mt-2 flex h-full flex-col gap-4">
            {Object.entries(data)
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <div className="grid w-full grid-flow-col grid-cols-3" key={key}>
                  <div>{t(key)}</div>
                  <div className="text-subtle">{String(value?.name || value)}</div>
                </div>
              ))}

            <div className="grid w-full grid-flow-col grid-cols-3">
              <div>{t('years')}</div>
              {data?.years?.map((year, i) => (
                <div key={i} className="text-subtle">
                  {year}
                </div>
              ))}
            </div>
            {/* {currentTab === } */}
            <div className="grid w-full grid-flow-col grid-cols-3">
              <div className="">{t('quantity')}</div>
              <div className="text-subtle">{data?.quantity}</div>
            </div>
            {/* <div className="grid w-full grid-flow-col grid-cols-3">
              <div>{headers.location}</div>
              <div className="text-subtle">B12</div>
            </div> */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Details;
