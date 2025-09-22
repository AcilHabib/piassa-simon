import {formatCurrency} from '@/lib/utils';
import {format} from 'date-fns';
import {useLocale} from 'next-intl';
import {FC} from 'react';

interface DisplayDataProps {
  data: any;
}

const DisplayData: FC<DisplayDataProps> = ({data}) => {
  const locale = useLocale();
  return (
    <div
      className="flex items-center w-full   text-subtle justify-between text-lg"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="  w-4/12 text-md">{data?.org_designation || data?.designation}</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className="w-2/12 text-center">{data?.ref}</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className="w-2/12 text-center ">{data?.brand?.name}</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className="w-2/12 text-center ">{data?.carModels?.map((c: any) => c?.name + ' ')} </div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className=" w-1/12 text-center">{data?.sellingPrice} DA</div>
      <span className="w-[1px] h-8 bg-neutral-200 " />
      <div className=" w-1/12 flex justify-center    ">
        <div className=" w-8 border-[1px] border-neutral-300 rounded-md  text-center  ">{data?.quantity}</div>
      </div>
    </div>
  );
};

export default DisplayData;
