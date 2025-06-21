import React from "react";
import QuoteCards from "components/QuoteCard";
import VehicalDetailCard from "components/VehicalDetailCard";
import HousePropertyDetails from "components/HousePropertyDetails";
import DeclarationCard from "components/DeclarationCard";
import SubscribeEmail from "components/SubscribeEmail";
import TermsAndCon from "../../../claims/register/compensation/TermsAndCon";
import { CombinedData, LanguageData } from "types/languageData";
import BuyProductHeading from "components/BuyProductHeading";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface ReviewQuotationProps {
  languageData: CombinedData | undefined | null;
  setLeftStep: (val: number) => void;
  leftStep: number;
}

const ReviewQuotation: React.FC<ReviewQuotationProps> = ({
  languageData,
  setLeftStep,
  leftStep,
}) => {
  const {
    email, 
    setEmail,
    isTermCondition,
    setIsTermCondition,
    homePremiumResponse,
    productName,
    coverageType
  } = useQuoteAndBuyContext();

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0

  return (
    <>
      <div className="review-qutation-section background-color-white">
        {languageData?.review_quotation && (
          <BuyProductHeading heading={languageData?.review_quotation} />
        )}
        {languageData && (
          <QuoteCards
            languageData={languageData}
            setLeftStep={setLeftStep}
            leftStep={leftStep}
          />
        )}
        {isHome ? <HousePropertyDetails languageData={languageData} /> : <VehicalDetailCard /> }
      </div>
      <div className="Quote-bottom">
        <DeclarationCard
          declare={
            Array.isArray(languageData?.personarrary)
              ? languageData?.personarrary
              : []
          }
          declareHead={languageData?.declaration_confirmation ?? ""}
          languageData={languageData as LanguageData}
        />
        <br />
        <SubscribeEmail
          languageData={languageData as LanguageData}
          email={email}
          setEmail={setEmail}
        />
        <br />
        <TermsAndCon 
           productcode={productName}
           languageData={languageData as LanguageData}
           isChecked={isTermCondition}
           coverageName={coverageType}
           setIsChecked={setIsTermCondition}/>
      </div>
    </>
  );
};

export default ReviewQuotation;
