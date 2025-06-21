import React, { createContext, useState, useMemo } from 'react';
import { navigateTo } from "../../../app-shell/src/utils";
import { useNavigate } from "react-router-dom";

export interface ClaimContextProps {

}



export const ClaimContext = createContext<ClaimContextProps | undefined>(undefined);

export const ClaimProvider: React.FC<{ children: React.ReactNode; initialTrackClaimInfo: { [key: string]: string }; initialContactData: { [key: string]: string }; trackClaimData: { [key: string]: string }, productType:string }> = ({ children, initialTrackClaimInfo, initialContactData, trackClaimData, productType }) => {
  const [trackClaimInfo, setTrackClaimInfo] = useState(initialTrackClaimInfo);
  const [contactData, setContactData] = useState(initialContactData);
    const [trackNewData, setTrackNewData] = useState(trackClaimData);
    const [productName, setproductName] = useState(productType)

  const navigate = useNavigate();

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const ClaimContextValue = useMemo(() => ({
    trackClaimInfo,
    setTrackClaimInfo,
    contactData,
    setContactData,
    setTrackNewData,
    trackNewData,
    handleNavigate,
    setproductName,
    productName
  }), [trackClaimInfo, contactData, trackNewData,productName]);

  return (
    <ClaimContext.Provider value={{ ...ClaimContextValue }}>
      {children}
    </ClaimContext.Provider>
  );
};