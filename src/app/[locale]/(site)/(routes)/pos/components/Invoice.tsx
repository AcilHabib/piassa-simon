'use client';
import AlertDialog from '@/components/models/AlertDialog';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import useCart from '@/hooks/useCart';
import {cn, formatCurrency, formatDatePart} from '@/lib/utils';
import {Download} from 'lucide-react';
import {FC, useMemo} from 'react';
import ProductsList from './invoice/ProductsList';
import {format} from 'date-fns';
import {useTranslations} from 'next-intl';
import React from 'react';
import {createOrder} from '@/lib/simon/requests/createOrder';
import {usePathname} from 'next/navigation';

interface InvoiceProps {
  isOrderView?: boolean;

  months: {
    [key: string]: string;
  };
}

const Invoice: FC<InvoiceProps> = ({months}) => {
  const {cart, clearCart} = useCart();
  const t = useTranslations('POSPage.order');
  const subTotal = useMemo(() => {
    return cart.reduce((acc, product) => {
      return acc + product.sellingPrice * product.quantity;
    }, 0);
  }, [cart]);
  //   alert(subTotal)
  const today = format(new Date(), 'dd/MM/yyyy');

  const randomOrderNumber = Math.floor(Math.random() * 1000000);
  const [orderNumber, setOrderNumber] = React.useState(randomOrderNumber);

  const [state, setState] = React.useState(false);
  const path = usePathname();
  const isOrders = path.includes('orders');
  console.log('isOrders', isOrders);
  const handleCreateNewOrder = async () => {
    try {
      const payload = {
        ref: `${orderNumber}`,
        items: cart.map((product) => ({
          id: product.id,
          quantity: product.quantity,
          sellingPrice: product.sellingPrice,
          store_id: product.store_id,
          type: 'BODY',
        })),
        total: subTotal * 1.19,
      };
      const result = await createOrder(payload);
      console.log('Order created:', result);
      clearCart();
    } catch (error) {
      console.error('Failed to create order', error);
    }
  };

  return (
    <div className={cn('w-[0%] text-foreground transition-all duration-700 ease-in-out', cart.length && 'w-[35%]')}>
      <div className={cn('opacity-0 transition-opacity duration-500 ease-in-out', cart.length && 'opacity-100')}>
        <div className="mb-4 flex max-h-[60vh] flex-col gap-4 rounded bg-white px-4 py-6 shadow-2xl">
          {/* general info */}
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">
                {t('title')} #{randomOrderNumber}{' '}
              </h1>
              <span className="text-subtle">Date : {today}</span>
            </div>
            {/* <Download className="h-6 w-6 cursor-pointer text-subtle" onClick={() => {}} /> */}
          </div>
          {/* products in cart */}
          <div className="grid grid-cols-5 gap-2 text-start">
            {/* TableHead */}
            <div className="col-span-4 grid grid-cols-4">
              <div className="">{t('articles')}</div>
              <div className="text-center">Qt</div>
              <div className="text-center">PU</div>
              <div className="text-center">PT</div>
            </div>
            <ProductsList isOrders={isOrders} products={cart} />
            <Separator className="col-span-full" />
            {/* Subtotal and tax */}
            <div className="col-span-3">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span> {formatCurrency(subTotal)} DA</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span>Tax (19%)</span>
                <span> {formatCurrency(subTotal * 0.19)} DA</span>
              </div> */}
            </div>
            <Separator className="col-span-full" />
            {/* Total */}
            <div className="col-span-3 text-lg font-bold">
              <div className="flex items-center justify-between">
                <span>Total</span>
                {/* <span> {formatCurrency(subTotal * 1.19)} DA</span> */}
                <span> {formatCurrency(subTotal)} DA</span>
              </div>
            </div>
          </div>
        </div>
        {/* actions */}
        {!path.includes('orders') && (
          <div className="flex items-center justify-end gap-2">
            <Button onClick={clearCart} variant={'secondary'} className="px-10">
              Cancel
            </Button>
            <AlertDialog
              callToAction="Continue"
              title={`${t('confirmOrder')} #.${orderNumber}`}
              description="This action is irreversible. Are you sure you want to confirm this order?"
              onConfirm={handleCreateNewOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
