'use client';
import {Glaze, Part, Tire} from '@prisma/client';
import React from 'react';
import {StockCategoryType, ChildrenProp, StockContextProps} from '~/types';

const Context = React.createContext({} as StockContextProps);
Context.displayName = 'StockContext';
export const useStockContext = () => React.useContext(Context);
const StockContext = ({children, initialStock}: any) => {
  const [currentTab, setCurrentTab] = React.useState<StockCategoryType>('all');
  const [currentStock, setCurrentStock] = React.useState<any>(initialStock || []);
  const [currentParts, setCurrentParts] = React.useState<Part[]>([]);
  const [currentBodies, setCurrentBodies] = React.useState<Body[]>([]);
  const [currentGlazes, setCurrentGlazes] = React.useState<Glaze[]>([]);
  const [currentTires, setCurrentTires] = React.useState<Tire[]>([]);

  // React.useEffect(() => {
  //   console.log('currentTab', currentStock);
  // }, [currentTab]);
  return (
    <Context.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentStock,
      }}>
      {children}
    </Context.Provider>
  );
};
export default StockContext;
