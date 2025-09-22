'use client';
import React from 'react';
import DisplayData from '../components/DisplayData';
import AddToCartBtn from './AddToCartBtn';
import {ArticleType, StockRowType} from '~/types';
import MoreOption from '../stock/MoreOption';
import {Eye, EyeClosed} from 'lucide-react';
import {useRouter} from 'next/router';
import {usePathname} from 'next/navigation';

interface RowProps {
  addToCart: string;
  data: ArticleType;
  state?: string;
  setState?: React.Dispatch<React.SetStateAction<string>>;
}

const Row: React.FC<RowProps> = ({addToCart, data, setState, state}) => {
  // console.log('ROW DATA', data);
  // console.log('[ROUTER]', router);
  // const {orders} = router;

  return (
    <div className="flex gap-4 w-full items-center">
      <div className={'mt-2 w-[90%] bg-offWhite px-10 py-6 text-foreground transition-all duration-700 ease-in-out'}>
        <DisplayData data={data} />
      </div>
      <AddToCartBtn
        designation={data?.designation}
        state={state}
        setState={setState}
        sellingPrice={data?.sellingPrice}
        toast={addToCart}
        id={data?.id}
      />
    </div>
  );
};

export default Row;
