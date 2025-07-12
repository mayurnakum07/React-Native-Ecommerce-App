import React, { createContext, useContext } from 'react';

interface AppContextType {
  checkOnboardingStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  checkOnboardingStatus: async () => {},
});

export const useAppContext = () => useContext(AppContext);
export default AppContext; 