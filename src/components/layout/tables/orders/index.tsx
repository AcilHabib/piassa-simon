'use client';
import React, {FC} from 'react';
import TableLayout from '../components/TableLayout';
import {ArticleType, StockRowType, StockTableHeadType} from '~/types';
import {getTranslations} from 'next-intl/server';
import {useStockContext} from '@/contexts/Stock';
import {useTranslations} from 'next-intl';
import useCart from '@/hooks/useCart';
import Row from '../orders/Row';

interface TableProps {
  addToCartText: string;
  data: ArticleType[];
  // headTitles: Table;
}

const Table: FC<TableProps> = ({addToCartText, data}) => {
  const {currentStock} = useStockContext();
  const t = useTranslations('POSPage.order');
  console.log('[shit[[[e , ', data);
  const {addToCart, clearCart} = useCart();
  const [state, setState] = React.useState('');

  React.useEffect(() => {
    if (state) {
      // setState('');
      clearCart();
    }
    console.log('state', state);
  }, [state]);
  // console.log('fuuuuu', data);
  return (
    <TableLayout
      titles={[
        {
          text: t('date'),

          width: 7,
        },
        {text: t('total'), width: 3},
        {text: t('ref'), width: 2},
      ]}>
      {/* //todo display real Data */}
      {data?.map((row: any) => (
        <Row key={row?.id} state={state} setState={setState} addToCart={addToCartText} data={row} />
      ))}
    </TableLayout>
  );
};

export default Table;
