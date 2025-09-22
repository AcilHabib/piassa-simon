import {formatCurrency} from '@/lib/utils';
import {format, formatDate} from 'date-fns';
import {useLocale} from 'next-intl';
import {FC} from 'react';

interface DisplayDataProps {
  data: any;
}

const DisplayData: FC<DisplayDataProps> = ({data}) => {
  const locale = useLocale();
  // const total = data?.reduce((acc: number, item: any) => {
  //   return acc + item?.sellingPrice;
  // }, 0);

  return (
    <div
      className="flex items-center w-full   text-subtle justify-between text-lg"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="  w-7/12 text-md">{format(new Date(data?.createdAt), 'dd / mm / yyyy | hh:mm')}</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className="w-3/12 text-center">{formatCurrency(data?.sellingPrice * data?.quantity)}</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className="w-2/12 text-center ">{data?.ref}</div>
    </div>
  );
};

export default DisplayData;
