'use client';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import useCart from '@/hooks/useCart';
import {PlusCircle} from 'lucide-react';
import {FC} from 'react';

interface AddToCartBtnProps {
  toast: string;
  designation: string;
  id: string;
  sellingPrice: number;
}

const ViewOrder: FC<AddToCartBtnProps> = ({toast, id, designation, sellingPrice}) => {
  const {addToCart} = useCart();
  return (
    <div className={'relative flex w-[10%] items-center justify-center gap-3 transition-all duration-700 ease-in-out'}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer bg-grayedout/50 backdrop-blur-2xl hover:bg-grayedout/70">
            <button
              className="rounded p-4 outline-primary"
              // todo: add onclick: add product to cart + open cart modal
              onClick={() => {
                addToCart({
                  id,
                  quantity: 1,
                  sellingPrice,
                  designation,
                });
              }}>
              <PlusCircle className="cursor-pointer" width={32} height={32} aria-label="Plus Info" />
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

export default ViewOrder;
