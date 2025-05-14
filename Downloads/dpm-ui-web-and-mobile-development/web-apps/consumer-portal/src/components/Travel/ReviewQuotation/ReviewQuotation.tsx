import React, { useEffect, useState } from "react";
import QuoteCards from "components/QuoteCard";
import TravelDetailCard from "../TravelDetailCard";
import DeclarationCard from "components/DeclarationCard";
import SubscribeEmail from "components/SubscribeEmail";
import TermsAndCon from "../../../claims/register/compensation/TermsAndCon";
import { CombinedData, LanguageData } from "types/languageData";
import { coverageTypeIdMap, JAVA_API_ROUTES, TRAVEL, TRAVEL_COVERAGE_TYPE } from "../../../constant";
import BuyProductHeading from "components/BuyProductHeading";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext"; 
import TravelInfoCard from "../TravelInfoCard";
import {
  worldwidecalculatePremium,
  worldwideexceptcalculatePremium,
  europecalculatePremium,
  worldwideFamilycalculatePremium,
} from "../../QuoteAndBuy/Commonfunction";
 
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
    
    settravelCovidcoverage,
    settravelWintersportscoverage,
    dataWorldwidepearl,
    isAddTravelerValidation,
    setIsAddTravelerValidation,
    dataWorldwidetraveller,
    setworldwidepearlInitialPrice,
    setworldwidetravellerInitialPrice,
    setworldwideCardPrice,
    setdataworldwidepearlVAT,
    setdataworldwidepearladminfee,
    setdataworldwidepearlnetpremium,
    setdataworldwidetravellerVAT,
    setdataworldwidetravelleradminfee,
    setdataworldwidetravellernetpremium,
    travelCovidcoverage,
    travelWintersportscoverage,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    setworldwideexceptpearlInitialPrice,
    setworldwideexcepttravellerInitialPrice,
    setworldwideexceptCardPrice,
    setdataworldwideexceptpearlVAT,
    setdataworldwideexceptpearladminfee,
    setdataworldwideexceptpearlnetpremium,
    setdataworldwideexcepttravellerVAT,
    setdataworldwideexcepttravelleradminfee,
    setdataworldwideexcepttravellernetpremium,
    dataEuropeeurope,
    dataEuropeschengen,
    setEuropeeuropeInitialPrice,
    setEuropeschengenInitialPrice,
    setEuropeCardPrice,
    setEuropeeuropeVAT,
    setdataEuropeeuropeadminfee,
    setdataEuropeeuropenetpremium,
    setdataEuropeschengenVAT,
    setdataEuropeschengenadminfee,
    setdataEuropeschengennetpremium,
    ownerDetailsResponseData,
    setpTravelername,
    setpTravelerPassportno,
    setpTravelerPassportexpiry,
    pTravelerPassportexpiry,
    pTravelerPassportno,
    pTravelername,
    policyStartDate,
    adultCount,
    setAdultCount,
    childCount,
    setChildCount,
    srCitizenCount,
    setSrCitizenCount,
    primaryTravelers,
    setPrimaryTravelers,
    travelers,
    setTravelers,
    travelersChild,
    setTravelersChild,
    travelersSrcitizen,
    setTravelersSrcitizen,
    
    setworldwideFamilyCPPrice,
     
    travellerType,
    setTotalCount,
    setworldwideSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    seteuropeSelfCPPrice,

    schemeCode,
    travelcoverageTypeCode,
    travelcoverage,
    worldwidetravellerInitialPrice,
    worldwidepearlInitialPrice,
    dataworldwidepearladminfee,
    dataworldwidetravelleradminfee,
    dataworldwidepearlnetpremium,
    dataworldwidetravellernetpremium,
    dataworldwidepearlVAT,
    dataworldwidetravellerVAT,

    worldwideCoveragePrice,
    worldwideFamilyCoveragePrice,
    worldwideexceptCoveragePrice,
    europeCoveragePrice,
    worldwideFamilyCPPrice,
    dataworldwideCoverageFamily,
    dataCoverageplanselfworldwide, 
    dataCoverageplanselfworldwideusa, 
    dataCoverageplanselfeurope, 
    dataCoverageplanfamilyworldwide,
    worldwideexcepttravellerInitialPrice,
    worldwideexceptpearlInitialPrice,
    dataworldwideexceptpearladminfee,
    dataworldwideexcepttravelleradminfee,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellernetpremium,
    dataworldwideexceptpearlVAT,
    dataworldwideexcepttravellerVAT,
    EuropeeuropeInitialPrice,
    EuropeschengenInitialPrice,
    dataEuropeeuropeadminfee,
    dataEuropeschengenadminfee,
    dataEuropeeuropenetpremium,
    dataEuropeschengennetpremium,
    dataEuropeeuropeVAT,
    dataEuropeschengenVAT,
  } = useQuoteAndBuyContext(); 
 
    const [policyRelData, setPolicyRelData] = useState({});  
    const [travelsubtotal, setTravelsubtotal] = useState(0);

    useEffect(() => {
      const handleData = (key: string, value: React.SetStateAction<{}>) => {
        switch (key) {
          case 'dataWorldwidepearl':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'dataWorldwidetraveller':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'travelCovidcoverage':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'travelWintersportscoverage':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'dataWorldwideexceptpearl':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'dataWorldwideexcepttraveller':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'dataEuropeeurope':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          case 'dataEuropeschengen':
            if (value) {
              setPolicyRelData(value);
            }
            break;
          default:
            break;
        }
      };
  
      handleData('dataWorldwidepearl', dataWorldwidepearl);
      handleData('dataWorldwidetraveller', dataWorldwidetraveller);
      handleData('travelCovidcoverage', travelCovidcoverage);
      handleData('travelWintersportscoverage', travelWintersportscoverage);
      handleData('dataWorldwideexceptpearl', dataWorldwideexceptpearl);
      handleData('dataWorldwideexcepttraveller', dataWorldwideexcepttraveller);
      handleData('dataEuropeeurope', dataEuropeeurope);
      handleData('dataEuropeschengen', dataEuropeschengen);
    }, [
      dataWorldwidepearl,
      dataWorldwidetraveller,
      travelCovidcoverage,
      travelWintersportscoverage,
      dataWorldwideexceptpearl,
      dataWorldwideexcepttraveller,
      dataEuropeeurope,
      dataEuropeschengen
    ]);  
 
 
   const renderPricebyCoverageplanAPI = () => {
 
     switch (travelcoverage) {
 
       case coverageTypeIdMap.worldwide:{
         if (travelcoverageTypeCode === "3") {
           return {
             price: worldwideFamilyCoveragePrice.dataworldwidefamilyFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_seven,
             adminFee: worldwideFamilyCoveragePrice.dataworldwidefamilyadminfee,
             netpremium: worldwideFamilyCoveragePrice.dataworldwidefamilynetpremium,
             vat: worldwideFamilyCoveragePrice.dataworldwidefamilyVAT,
             travellers: worldwideFamilyCoveragePrice.dataworldwidefamilypurchasedCoverage
 
           };
         }
         else if (travelcoverageTypeCode === "2") {
           return {
             price: worldwideCoveragePrice?.dataworldwidepearlFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_two,
             adminFee: worldwideCoveragePrice?.dataworldwidepearladminfee,
             netpremium: worldwideCoveragePrice?.dataworldwidepearlnetpremium,
             vat: worldwideCoveragePrice?.dataworldwidepearlVAT
           }
         }
         else if (travelcoverageTypeCode === "1") {
           return {
             price: worldwideCoveragePrice.dataworldwidetravellerFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_one,
             adminFee: worldwideCoveragePrice.dataworldwidetravelleradminfee,
             netpremium: worldwideCoveragePrice.dataworldwidetravellernetpremium,
             vat: worldwideCoveragePrice.dataworldwidetravellerVAT
           };
         }
         else break;
        }
       case coverageTypeIdMap.worldwide1:{
         if (travelcoverageTypeCode === "1") {
           return {
             price: worldwideexceptCoveragePrice.dataworldwideexcepttravellerFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_three,
             adminFee: worldwideexceptCoveragePrice.dataworldwideexcepttravelleradminfee,
             netpremium: worldwideexceptCoveragePrice.dataworldwideexcepttravellernetpremium,
             vat: worldwideexceptCoveragePrice.dataworldwideexcepttravellerVAT
           };
         } else if (travelcoverageTypeCode === "2") {
           return {
             price: worldwideexceptCoveragePrice.dataworldwideexceptpearlFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_four,
             adminFee: worldwideexceptCoveragePrice.dataworldwideexceptpearladminfee,
             netpremium: worldwideexceptCoveragePrice.dataworldwideexceptpearlnetpremium,
             vat: worldwideexceptCoveragePrice.dataworldwideexceptpearlVAT
           };
         }
         else break;
        }
       case coverageTypeIdMap.europe: {
         if (travelcoverageTypeCode === "4") {
           return {
             price: europeCoveragePrice.dataEuropeschengenFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_five,
             adminFee: europeCoveragePrice.dataEuropeschengenadminfee,
             netpremium: europeCoveragePrice.dataEuropeschengennetpremium,
             vat: europeCoveragePrice.dataEuropeschengenVAT
           };
         } else if (travelcoverageTypeCode === "5") {
           return {
             price: europeCoveragePrice.dataEuropeeuropeFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_six,
             adminFee: europeCoveragePrice.dataEuropeeuropeadminfee,
             netpremium: europeCoveragePrice.dataEuropeeuropenetpremium,
             vat: europeCoveragePrice.dataEuropeeuropeVAT
           };
         }
         else break;
        }
 
       default:
         break;
     }
   }
 
 
   const renderPricebyCPApi = () => {
     switch (travelcoverage) {
 
       case coverageTypeIdMap.worldwide:{
 
         if (travelcoverageTypeCode === "3") {
           return {
             price: worldwideFamilyCPPrice.dataworldwideFamilyFinalPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_seven,
             adminFee: worldwideFamilyCPPrice.dataworldwideFamilyadminfee,
             netpremium: worldwideFamilyCPPrice.dataworldwideFamilynetpremium,
             vat: worldwideFamilyCPPrice.dataworldwideFamilyVAT,
             travellers: worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage
           };
         }
         else if (travelcoverageTypeCode === "1") {
           return {
             price: worldwidetravellerInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_one,
             adminFee: dataworldwidetravelleradminfee,
             netpremium: dataworldwidetravellernetpremium,
             vat: dataworldwidetravellerVAT
           };
         } else if (travelcoverageTypeCode === "2") {
           return {
             price: worldwidepearlInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_two,
             adminFee: dataworldwidepearladminfee,
             netpremium: dataworldwidepearlnetpremium,
             vat: dataworldwidepearlVAT
           };
         }
         else break;
        } 
       case coverageTypeIdMap.worldwide1:
         if (travelcoverageTypeCode === "1") {
           return {
             price: worldwideexcepttravellerInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_three,
             adminFee: dataworldwideexcepttravelleradminfee,
             netpremium: dataworldwideexcepttravellernetpremium,
             vat: dataworldwideexcepttravellerVAT
           };
         } else {
           return {
             price: worldwideexceptpearlInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_four,
             adminFee: dataworldwideexceptpearladminfee,
             netpremium: dataworldwideexceptpearlnetpremium,
             vat: dataworldwideexceptpearlVAT
           };
         }
       case coverageTypeIdMap.europe:
         if (travelcoverageTypeCode === "4") {
           return {
             price: EuropeschengenInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_five,
             adminFee: dataEuropeschengenadminfee,
             netpremium: dataEuropeschengennetpremium,
             vat: dataEuropeschengenVAT
           };
         } else {
           return {
             price: EuropeeuropeInitialPrice || 0,
             type: TRAVEL_COVERAGE_TYPE.type_six,
             adminFee: dataEuropeeuropeadminfee,
             netpremium: dataEuropeeuropenetpremium,
             vat: dataEuropeeuropeVAT
           };
         }
       default:
         break
     }
   };
 
   useEffect(() => {
     const newSubtotalTravel = renderPricebyCPApi();
 
     if (newSubtotalTravel && newSubtotalTravel.netpremium !== null) {
       setTravelsubtotal( newSubtotalTravel.netpremium );
     }
    
   }, [travelcoverage, travelcoverageTypeCode, dataEuropeeuropenetpremium, dataEuropeschengennetpremium, dataworldwideexceptpearlnetpremium, dataworldwideexcepttravellernetpremium, dataworldwidepearlnetpremium, dataworldwidetravellernetpremium, worldwideFamilyCPPrice]);
 
   useEffect(() => {
     const newSubtotalTravel = renderPricebyCoverageplanAPI();
 
     if (newSubtotalTravel && newSubtotalTravel.netpremium !== null) {
       setTravelsubtotal( newSubtotalTravel.netpremium );
     }
      
   }, [travelcoverage, travelcoverageTypeCode, dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide, dataworldwideCoverageFamily]);
 
 
 
  return (
    <>
      <div className="review-qutation-section background-color-white">
        {languageData?.review_and_make_payment && (
          <BuyProductHeading heading={languageData?.review_and_make_payment} />
        )}
        {languageData && (
          <QuoteCards
            languageData={languageData}
            setLeftStep={setLeftStep}
            leftStep={leftStep}
          />
        )}
        <TravelDetailCard policyPremiumAmt={travelsubtotal} languageData={languageData} />
      </div> 

      <div className="review-qutation-section background-color-white"> 
         
          {languageData?.traveller_details && ( 
            <BuyProductHeading heading={languageData?.traveller_details} />
          )} 

          {(adultCount && adultCount > 0 || childCount && childCount > 0 || 
          srCitizenCount && srCitizenCount > 0) ? (
            (travellerType === "1") && (
              <div className="addtravellerbtn text-end">  
              <div className="traveler-footer">
                <div className="footer-btn" onClick={() => setLeftStep(3)}> 
                  {languageData?.add_traveller}
                </div>
              </div> 
              </div>
            )
          ) : null}

          {languageData && (
            <TravelInfoCard policyRelData={policyRelData} languageData={languageData} /> 
          )} 
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
          languageData={languageData as LanguageData}
          isChecked={isTermCondition} 
          setIsChecked={setIsTermCondition}
          productcode={TRAVEL}/>
      </div> 
     
    </>
  );
};

export default ReviewQuotation;