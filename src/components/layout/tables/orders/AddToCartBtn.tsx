'use client';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import useCart from '@/hooks/useCart';
import {Eye, EyeClosed, Icon, PlusCircle} from 'lucide-react';
import {usePathname} from 'next/navigation';
import React, {FC} from 'react';
import ViewOrder from './ViewOrder';
import {set} from 'date-fns';

interface AddToCartBtnProps {
  toast: string;
  designation: string;
  id: string;
  sellingPrice: number;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const AddToCartBtn: FC<AddToCartBtnProps> = ({toast, id, designation, sellingPrice, state, setState}) => {
  const {addToCart, viewOrder, clearCart} = useCart();

  const path = usePathname();
  const isOrders = path.includes('orders');
  return (
    <div className={'relative flex w-[10%] items-center justify-center gap-3 transition-all duration-700 ease-in-out'}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer bg-grayedout/50 backdrop-blur-2xl hover:bg-grayedout/70">
            <button
              className="rounded p-4 outline-primary"
              // todo: add onclick: add product to cart + open cart modal
              onClick={() => {
                if (state) setState('');
                else setState(id);
                // if (isOrders) {
                //   ViewOrder(data?.items);
                // } else {
                addToCart({
                  id,
                  quantity: 1,
                  sellingPrice,
                  designation,
                });
                // }
              }}>
              {path.includes('orders') ? (
                state !== id ? (
                  <EyeClosed />
                ) : (
                  <Eye />
                )
              ) : (
                <PlusCircle className="cursor-pointer" width={32} height={32} aria-label="Plus Info" />
              )}
              {}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="border-0 bg-[#494551]/90 text-primary-foreground">
            {toast}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AddToCartBtn;
