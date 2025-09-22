import {useLocale} from 'next-intl';
import {FC} from 'react';
import {TableHeadProp} from '~/types';

const TableHead: FC<TableHeadProp> = ({titles}) => {
  const locale = useLocale();
  return (
    <div
      className="inline-flex w-[90%]  flex-col items-center justify-between rounded-tl-lg rounded-tr-lg bg-gray-500/15 shadow-inner"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full rounded-tl-lg rounded-tr-lg px-10  py-3 backdrop-blur-xl  xl:py-5">
        <div className="flex   w-full items-center text-center justify-between border-none  font-bold ">
          {titles?.map((title, i) => (
            <span key={i} className={`w-${title.width}/12`}>
              {title.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableHead;
