import React, { useEffect, useState } from "react";
import BuyProductHeading from "components/BuyProductHeading";
import QuoteCards from "components/QuoteCard";
import TravelDetailCard from "../TravelDetailCard";
import TravelInfoCard from "../TravelInfoCard";
import DeclarationCard from "components/DeclarationCard";
import SubscribeEmail from "components/SubscribeEmail";
import TermsAndCon from "../../../claims/register/compensation/TermsAndCon";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {
  coveragePlanTypeIdMap,
  coverageTypeIdMap,
  TRAVEL,
  TRAVEL_COVERAGE_TYPE,
  travelerTypeIdMap,
} from "../../../constant";
import "./index.scss";
import { CombinedData, LanguageData } from "types/languageData";
import { covergaeTypes } from "../constantsTravel";

interface ReviewQuotationProps {
  languageData: CombinedData | undefined | null;
  setLeftStep: (val: number) => void;
  leftStep: number;
}

const ReviewQuotation = ({
  languageData,
  setLeftStep,
  leftStep,
}: ReviewQuotationProps) => {
  const {
    email,
    setEmail,
    isTermCondition,
    setIsTermCondition,
    dataWorldwidepearl,
    dataWorldwidetraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    dataEuropeeurope,
    dataEuropeschengen,
    adultCount,
    childCount,
    srCitizenCount,
    travellerType,
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
    worldwideFamilyCPPrice,
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
        case "dataWorldwidepearl":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "dataWorldwidetraveller":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "travelCovidcoverage":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "travelWintersportscoverage":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "dataWorldwideexceptpearl":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "dataWorldwideexcepttraveller":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "dataEuropeeurope":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        case "dataEuropeschengen":
          if (value) {
            setPolicyRelData(value);
          }
          break;
        default:
          break;
      }
    };

    handleData("dataWorldwidepearl", dataWorldwidepearl);
    handleData("dataWorldwidetraveller", dataWorldwidetraveller);
    handleData("travelCovidcoverage", travelCovidcoverage);
    handleData("travelWintersportscoverage", travelWintersportscoverage);
    handleData("dataWorldwideexceptpearl", dataWorldwideexceptpearl);
    handleData("dataWorldwideexcepttraveller", dataWorldwideexcepttraveller);
    handleData("dataEuropeeurope", dataEuropeeurope);
    handleData("dataEuropeschengen", dataEuropeschengen);
  }, [
    dataWorldwidepearl,
    dataWorldwidetraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    dataEuropeeurope,
    dataEuropeschengen,
  ]);

  const renderPricebyCPApi = () => {
    switch (travelcoverage) {
      case coverageTypeIdMap.worldwide: {
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type3) {
          const finalAmount =
            worldwideFamilyCPPrice?.dataworldwideFamilypurchasedCoverage?.[0]
              ?.premiumInfo?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_seven,
            adminFee: worldwideFamilyCPPrice.dataworldwideFamilyadminfee,
            netpremium:
              worldwideFamilyCPPrice.dataworldwideFamilynetpremium ?? 0,
            vat: worldwideFamilyCPPrice.dataworldwideFamilyVAT,
            travellers:
              worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage,
          };
        } else if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          const finalAmount =
            dataWorldwidetraveller?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_one,
            adminFee: dataworldwidetravelleradminfee,
            netpremium:
              dataWorldwidetraveller?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwidetravellerVAT,
            coverageOpted: dataWorldwidetraveller?.purchasedCoverage,
          };
        } else if (travelcoverageTypeCode === coveragePlanTypeIdMap.type2) {
          const finalAmount =
            dataWorldwidepearl?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_two,
            adminFee: dataworldwidepearladminfee,
            netpremium: dataWorldwidepearl?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwidepearlVAT,
            coverageOpted: dataWorldwidepearl?.purchasedCoverage,
          };
        } else break;
      }
      case coverageTypeIdMap.worldwide1:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type1) {
          const finalAmount =
            dataWorldwideexcepttraveller?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_three,
            adminFee: dataworldwideexcepttravelleradminfee,
            netpremium:
              dataWorldwideexcepttraveller?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwideexcepttravellerVAT,
            coverageOpted: dataWorldwideexcepttraveller?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataWorldwideexceptpearl?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_four,
            adminFee: dataworldwideexceptpearladminfee,
            netpremium:
              dataWorldwideexceptpearl?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataworldwideexceptpearlVAT,
            coverageOpted: dataWorldwideexceptpearl?.purchasedCoverage,
          };
        }
      case coverageTypeIdMap.europe:
        if (travelcoverageTypeCode === coveragePlanTypeIdMap.type4) {
          const finalAmount =
            dataEuropeschengen?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_five,
            adminFee: dataEuropeschengenadminfee,
            netpremium: dataEuropeschengen?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataEuropeschengenVAT,
            coverageOpted: dataEuropeschengen?.purchasedCoverage,
          };
        } else {
          const finalAmount =
            dataEuropeeurope?.purchasedCoverage[0]?.premiumInfo
              ?.annualPremium ?? 0;
          return {
            price: finalAmount,
            type: TRAVEL_COVERAGE_TYPE.type_six,
            adminFee: dataEuropeeuropeadminfee,
            netpremium: dataEuropeeurope?.pricingOptions[0]?.premiumDue ?? 0,
            vat: dataEuropeeuropeVAT,
            coverageOpted: dataEuropeeurope?.purchasedCoverage,
          };
        }
      default:
        break;
    }
  };

  useEffect(() => {
    const newSubtotalTravel = renderPricebyCPApi();

    if (newSubtotalTravel && newSubtotalTravel.netpremium !== null) {
      setTravelsubtotal(newSubtotalTravel.netpremium);
    }
  }, [
    travelcoverage,
    travelcoverageTypeCode,
    dataEuropeeuropenetpremium,
    dataEuropeschengennetpremium,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellernetpremium,
    dataworldwidepearlnetpremium,
    dataworldwidetravellernetpremium,
    worldwideFamilyCPPrice,
  ]);

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
        <TravelDetailCard
          policyPremiumAmt={travelsubtotal}
          languageData={languageData}
        />
      </div>

      <div className="review-qutation-section background-color-white">
        {languageData?.traveller_details && (
          <BuyProductHeading heading={languageData?.traveller_details} />
        )}

        {(adultCount && adultCount > 0) ||
        (childCount && childCount > 0) ||
        (srCitizenCount && srCitizenCount > 0)
          ? travellerType === travelerTypeIdMap.family && (
              <div className="addtravellerbtn text-end">
                <div className="traveler-footer">
                  <div className="footer-btn" onClick={() => setLeftStep(3)}>
                    {languageData?.add_traveller}
                  </div>
                </div>
              </div>
            )
          : null}

        {languageData && (
          <TravelInfoCard
            policyRelData={policyRelData}
            languageData={languageData}
          />
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
          productcode={TRAVEL}
        />
      </div>
    </>
  );
};

export default ReviewQuotation;
