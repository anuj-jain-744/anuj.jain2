import React from "react";
import useLanguageData from "./hooks/useLanguageData";
import PolicyContent from './PolicyRelatedDocuments/PolicyContent';
// import { useLocation } from "react-router-dom";
import { QuoteAndBuyProvider } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
interface Props {
  navigateTo?: (url: string) => void;
}

const AcceessPolicyDocuments: React.FC<Props> = ({ navigateTo }) => {
 
  // const location = useLocation();
  // const {policyNo} = location.state;

  const { languageData, isLoading: isLanguageLoading, error: languageError } = useLanguageData();

  return ( 
    <QuoteAndBuyProvider>
    <PolicyContent languageData={languageData} isLanguageLoading={isLanguageLoading} languageError={languageError} policyNumber={"P-OS01-25-605-000064"} navigateTo={navigateTo}/>;
    </QuoteAndBuyProvider>
   
  )
};

export default AcceessPolicyDocuments;