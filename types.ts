import {Body, Brand, CarModel, Glaze, Part, Tire} from '@prisma/client';
import {UseQueryResult} from '@tanstack/react-query';
import React from 'react';
export type ChildrenProp = {
  children: React.ReactNode;
};
export type StockRowType = {
  name: string;
  refTD: string;
  refAM: string;
  cat: string;
  price: number;
  createdAt: Date;
  qt: number;
  id: string;
};
export type ProductInfoType = {
  generalInfo: {
    title: string;
    afterMarketRef: string;
    name: string;
    Qnt: string;
    location: string;
  };
  tecDocInformation: {
    title: string;
    OEM: string;
    technicalName: string;
    category: string;
  };
  prices: {
    title: string;
    retailPrice: string;
    addPrice: string;
  };
};

export type CurrentStuffType = {
  id: string;
  username: string;
  role: string;
  store: {
    name: string;
    logo: string;
    id: string;
  };
};
export type StuffContextProps = {
  currentStuffData: UseQueryResult<
    {
      currentStuff: CurrentStuffType;
    },
    Error
  >;
};

export type LoginInformationProps = {
  currentStuff: CurrentStuffType | null;
};
export interface TableHeadTitleType {
  text: string;
  width: number;
}
export type TableHeadProp = {
  titles: TableHeadTitleType[];
};

export type TableProps = {
  headTitles: TableHeadTitleType[];
  moreOptions: {
    edit: string;
    seeDetails: string;
    delete: string;
  };
  editHeaders: StockTableHeadType;
  data: any;
};
export type StockTableHeadType = {
  designation: string;
  ref: string;
  brand: Brand;
  carModels: CarModel[];
  sellingPrice: string;
  qt: number;
};

export type StockCategoryType = 'all' | 'parts' | 'bodies' | 'tires' | 'glazes';
export type TableLayoutProps = {
  titles: TableHeadTitleType[];
  children: React.ReactNode;
};
export type StockContextProps = {
  currentTab: StockCategoryType;
  setCurrentTab: React.Dispatch<React.SetStateAction<StockCategoryType>>;
  currentStock: ArticleType[];
};
export type TableContainerProps = {
  categories: StockCategoryType[];
  categoryData: StockRowType[];
  children: React.ReactNode;
};
export type ArticleType = Body | Part | Glaze | Tire;
export interface ArticlesDataType {
  tires: ArticleType[];
  glazes: ArticleType[];
  bodies: ArticleType[];
  parts: ArticleType[];
}
