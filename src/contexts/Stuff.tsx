'use client';
import React from 'react';

const Context = React.createContext({} as StuffContextProps);
Context.displayName = 'StuffContext';

export const useStuffContext = () => React.useContext(Context);
const StuffContext = ({children}: ChildrenProp) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export default StuffContext;
