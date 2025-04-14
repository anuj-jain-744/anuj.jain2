import React, { createContext, useState, ReactNode } from "react";
import { getCurrentLanguage, setUserLanguage } from "../../index";

interface CommonContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  triggerLogin: boolean;
  setTriggerLogin: (triggerLogin: boolean) => void;
}

const CommonContext = createContext<CommonContextType | undefined>(undefined);

const CommonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [triggerLogin, setTriggerLogin] = useState(false);

  const changeLanguage = (lang: string) => {
    setUserLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <CommonContext.Provider value={{ currentLanguage, changeLanguage, triggerLogin, setTriggerLogin }}>
      {children}
    </CommonContext.Provider>
  );
};

export { CommonProvider, CommonContext };
