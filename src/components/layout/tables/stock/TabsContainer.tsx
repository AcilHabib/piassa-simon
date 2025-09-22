'use client';

import {Table} from '@/components/ui/table';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useStockContext} from '@/contexts/Stock';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import React, {FC} from 'react';
import {StockCategoryType, TableContainerProps} from '~/types';

const TabsContainer: FC<TableContainerProps> = ({categories, children}) => {
  const {currentTab, setCurrentTab} = useStockContext();
  const t = useTranslations('stockPage');
  return (
    <Tabs defaultValue={currentTab} onValueChange={(value) => setCurrentTab(value as StockCategoryType)}>
      <TabsList className="mb-2 grid w-[30%] grid-cols-5">
        <TabsTrigger value={categories[0]}>
          <Image src={'/categories/all.svg'} alt="piece" className="scale-125" width={20} height={20} />
        </TabsTrigger>
        <TabsTrigger value={categories[1]}>
          <Image src={'/categories/piece.svg'} alt="piece" className="scale-125" width={20} height={20} />
        </TabsTrigger>
        <TabsTrigger value={categories[2]}>
          <Image src={'/categories/carosserie.svg'} alt="carosserie" className="scale-90" width={50} height={50} />
        </TabsTrigger>
        <TabsTrigger value={categories[3]}>
          <Image src={'/categories/vitrage.svg'} alt="vitrage" className="scale-125" width={35} height={35} />
        </TabsTrigger>
        <TabsTrigger value={categories[4]}>
          <Image src={'/categories/pneumatique.svg'} alt="pneumatique" className="scale-150" width={20} height={20} />
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabsContainer;
