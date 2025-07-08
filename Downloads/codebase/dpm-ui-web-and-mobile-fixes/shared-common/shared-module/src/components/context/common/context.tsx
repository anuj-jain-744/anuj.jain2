import React, { createContext, useState, ReactNode } from "react";
import { getCurrentLanguage, setUserLanguage } from "../../index";
import { CommonContextType } from "../../types";


const CommonContext = createContext<CommonContextType | undefined>(undefined);

const CommonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [triggerLogin, setTriggerLogin] = useState(false);

  const changeLanguage = (lang: string) => {
    setUserLanguage(lang);
    setCurrentLanguage(lang);
  };
  const value= React.useMemo(() => (
    {currentLanguage, changeLanguage, triggerLogin, setTriggerLogin }
    ), [currentLanguage,triggerLogin,changeLanguage,setTriggerLogin]); // value is cached by useMemo

  return (
    <CommonContext.Provider value={value}>
      {children}
    </CommonContext.Provider>
  );
};

export { CommonProvider, CommonContext };
